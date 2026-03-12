import oracledb from "oracledb";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BaseAdapter } from "./base.adapter.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export class OracleAdapter extends BaseAdapter {
    pool = null;
    config;
    constructor(config) {
        super();
        this.config = config;
    }
    // ---------------------------------------------------------------------------
    // Column name normalization: Oracle returns unquoted columns as UPPERCASE.
    // Quoted aliases ("projectId") are preserved.  Normalize ALL-UPPERCASE keys
    // to lowercase so the rest of the app can use consistent casing.
    // ---------------------------------------------------------------------------
    normalizeRows(rows) {
        return rows.map((row) => {
            const normalized = {};
            for (const [key, value] of Object.entries(row)) {
                const newKey = key === key.toUpperCase() ? key.toLowerCase() : key;
                normalized[newKey] = value;
            }
            return normalized;
        });
    }
    // ---------------------------------------------------------------------------
    // JSON auto-parse: PostgreSQL's pg driver auto-parses jsonb columns into
    // objects.  Oracle returns JSON / CLOB as strings.  Detect and parse them.
    // ---------------------------------------------------------------------------
    autoParseJson(rows) {
        for (const row of rows) {
            for (const key of Object.keys(row)) {
                const val = row[key];
                if (typeof val === "string" && val.length > 0 && (val[0] === "{" || val[0] === "[")) {
                    try {
                        row[key] = JSON.parse(val);
                    }
                    catch {
                        // Not valid JSON — keep as string
                    }
                }
            }
        }
    }
    async query(text, params = []) {
        if (!this.pool) {
            throw new Error("Oracle pool not initialized. Call initialize() first.");
        }
        const connection = await this.pool.getConnection();
        try {
            const result = await connection.execute(text, params, {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
                autoCommit: true,
            });
            const rawRows = (result.rows ?? []);
            const normalized = this.normalizeRows(rawRows);
            this.autoParseJson(normalized);
            const rowCount = result.rowsAffected ?? normalized.length;
            return { rows: normalized, rowCount };
        }
        finally {
            await connection.close();
        }
    }
    async initialize() {
        // Convert CLOBs to strings globally so JSON columns are returned as strings
        oracledb.fetchAsString = [oracledb.CLOB];
        // ATP thin mode — no initOracleClient needed, just walletLocation/walletPassword
        this.pool = await oracledb.createPool({
            user: this.config.user,
            password: this.config.password,
            connectString: this.config.connectString,
            configDir: this.config.configDir,
            walletLocation: this.config.walletDir,
            walletPassword: this.config.walletPassword,
            poolMin: 2,
            poolMax: 10,
            poolIncrement: 1,
        });
        console.log("Oracle connection pool created successfully.");
        // Run migrations
        await this.runMigrations();
    }
    async runMigrations() {
        const sqlDir = path.resolve(__dirname, "..", "..", "..", "sql", "oracle");
        // Create migration tracking table
        const connection = await this.pool.getConnection();
        try {
            await connection.execute(`BEGIN
           EXECUTE IMMEDIATE 'CREATE TABLE schema_migrations (
             filename  VARCHAR2(255) PRIMARY KEY,
             applied_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
           )';
         EXCEPTION
           WHEN OTHERS THEN
             IF SQLCODE != -955 THEN RAISE; END IF;
         END;`);
            await connection.commit();
        }
        finally {
            await connection.close();
        }
        const migrationFiles = [
            "001_init.sql",
            "002_cost_tracking.sql",
            "003_clear_cost_data.sql",
            "004_cost_tracking_v2.sql",
            "005_segregation_v3.sql",
            "006_relational_feasibility.sql",
            "007_sales_staff_discounts.sql",
            "008_collections_forecast.sql",
            "009_collections_forecast_source_fields.sql",
            "010_collections_forecast_lookups.sql",
            "011_collections_forecast_formula_inputs.sql",
            "012_users.sql",
        ];
        for (const file of migrationFiles) {
            const conn = await this.pool.getConnection();
            try {
                const result = await conn.execute(`SELECT filename FROM schema_migrations WHERE filename = :1`, [file]);
                if ((result.rows?.length ?? 0) > 0) {
                    continue;
                }
                const sqlPath = path.join(sqlDir, file);
                if (!fs.existsSync(sqlPath)) {
                    continue;
                }
                const sql = fs.readFileSync(sqlPath, "utf-8");
                // Split on "/" on its own line (PL/SQL block terminator)
                // and also on ";" for plain statements
                const blocks = this.splitOracleStatements(sql);
                for (const block of blocks) {
                    const trimmed = block.trim();
                    if (!trimmed || trimmed === "/")
                        continue;
                    try {
                        await conn.execute(trimmed);
                    }
                    catch (ddlError) {
                        const oraErr = ddlError;
                        // ORA-00955: name already used (table/index exists)
                        // ORA-01430: column already exists
                        // ORA-02261: unique/primary key already exists
                        // ORA-00942: table/view does not exist (for DROP IF NOT EXISTS patterns)
                        const ignorable = [955, 1430, 1408, 2261, 942];
                        if (oraErr.errorNum && ignorable.includes(oraErr.errorNum)) {
                            // Object already exists — safe to skip
                            continue;
                        }
                        throw ddlError;
                    }
                }
                await conn.execute(`INSERT INTO schema_migrations (filename) VALUES (:1)`, [file]);
                await conn.commit();
                console.log(`  Applied migration: ${file}`);
            }
            catch (error) {
                await conn.rollback();
                console.error(`  Migration failed: ${file}`, error);
                throw error;
            }
            finally {
                await conn.close();
            }
        }
    }
    /**
     * Split Oracle SQL script into individual executable statements.
     * Handles PL/SQL blocks (BEGIN...END;) terminated by "/" and plain
     * statements terminated by ";".
     */
    splitOracleStatements(sql) {
        const statements = [];
        const lines = sql.split("\n");
        let current = "";
        let inPlsql = false;
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Skip comment-only lines at statement boundaries
            if (!current.trim() && trimmedLine.startsWith("--")) {
                continue;
            }
            // Detect PL/SQL block start
            if (!inPlsql &&
                /^\s*(BEGIN|DECLARE|CREATE\s+(OR\s+REPLACE\s+)?(PROCEDURE|FUNCTION|TRIGGER|PACKAGE))/i.test(trimmedLine)) {
                inPlsql = true;
            }
            // "/" on its own line terminates a PL/SQL block
            if (trimmedLine === "/") {
                if (current.trim()) {
                    statements.push(current.trim());
                    current = "";
                }
                inPlsql = false;
                continue;
            }
            current += line + "\n";
            // For non-PL/SQL statements, split on ";" at end of line
            if (!inPlsql && trimmedLine.endsWith(";")) {
                const stmt = current.trim().replace(/;\s*$/u, "");
                if (stmt) {
                    statements.push(stmt);
                }
                current = "";
            }
        }
        // Handle any remaining content
        if (current.trim()) {
            const stmt = current.trim().replace(/;\s*$/u, "");
            if (stmt) {
                statements.push(stmt);
            }
        }
        return statements;
    }
    // ---------------------------------------------------------------------------
    // Dialect overrides
    // ---------------------------------------------------------------------------
    placeholder(index) {
        return `:${index}`;
    }
    nowExpression() {
        return "SYSTIMESTAMP";
    }
    limitClause(count) {
        return `FETCH FIRST ${count} ROWS ONLY`;
    }
    jsonCast(ph) {
        return ph; // Oracle accepts plain string for JSON/CLOB columns
    }
    dateToText(column) {
        return `TO_CHAR(${column}, 'YYYY-MM-DD')`;
    }
    boolExpr(expr) {
        return `CASE WHEN ${expr} THEN 1 ELSE 0 END`;
    }
    // ---------------------------------------------------------------------------
    // UPSERT — Oracle uses MERGE INTO ... USING dual
    // ---------------------------------------------------------------------------
    upsert(table, conflictCols, insertCols, updateCols, startIdx, extraSetClauses) {
        // Use positional aliases (c0, c1, ...) to avoid Oracle reserved-word issues
        const srcCols = insertCols
            .map((_, i) => `${this.placeholder(startIdx + i)} AS c${i}`)
            .join(", ");
        const colToAlias = new Map(insertCols.map((col, i) => [col, `c${i}`]));
        const onCondition = conflictCols
            .map((col) => `t.${col} = src.${colToAlias.get(col)}`)
            .join(" AND ");
        const updateSet = updateCols.map((col) => `t.${col} = src.${colToAlias.get(col)}`);
        if (extraSetClauses)
            updateSet.push(...extraSetClauses);
        const insertColList = insertCols.join(", ");
        const insertValues = insertCols.map((col) => `src.${colToAlias.get(col)}`).join(", ");
        return (`MERGE INTO ${table} t ` +
            `USING (SELECT ${srcCols} FROM dual) src ` +
            `ON (${onCondition}) ` +
            `WHEN MATCHED THEN UPDATE SET ${updateSet.join(", ")} ` +
            `WHEN NOT MATCHED THEN INSERT (${insertColList}) VALUES (${insertValues})`);
    }
    upsertOrIgnore(table, conflictCols, insertCols, startIdx) {
        const srcCols = insertCols
            .map((_, i) => `${this.placeholder(startIdx + i)} AS c${i}`)
            .join(", ");
        const colToAlias = new Map(insertCols.map((col, i) => [col, `c${i}`]));
        const onCondition = conflictCols
            .map((col) => `t.${col} = src.${colToAlias.get(col)}`)
            .join(" AND ");
        const insertColList = insertCols.join(", ");
        const insertValues = insertCols.map((col) => `src.${colToAlias.get(col)}`).join(", ");
        return (`MERGE INTO ${table} t ` +
            `USING (SELECT ${srcCols} FROM dual) src ` +
            `ON (${onCondition}) ` +
            `WHEN NOT MATCHED THEN INSERT (${insertColList}) VALUES (${insertValues})`);
    }
    // ---------------------------------------------------------------------------
    // INSERT RETURNING — Oracle uses RETURNING id INTO :outBind + separate SELECT
    // ---------------------------------------------------------------------------
    async insertReturning(table, insertCols, values, returningExpr, startIdx = 1, valueExprs) {
        if (!this.pool) {
            throw new Error("Oracle pool not initialized. Call initialize() first.");
        }
        const placeholders = valueExprs
            ? valueExprs.join(", ")
            : insertCols.map((_, i) => this.placeholder(startIdx + i)).join(", ");
        const outIdx = values.length + 1;
        const sql = `INSERT INTO ${table} (${insertCols.join(", ")}) VALUES (${placeholders}) ` +
            `RETURNING id INTO ${this.placeholder(outIdx)}`;
        const connection = await this.pool.getConnection();
        try {
            const allParams = [...values, { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }];
            const result = await connection.execute(sql, allParams, { autoCommit: true });
            const outBinds = result.outBinds;
            const id = Array.isArray(outBinds[0]) ? outBinds[0][0] : outBinds[0];
            const selectResult = await connection.execute(`SELECT ${returningExpr} FROM ${table} WHERE id = ${this.placeholder(1)}`, [id], {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
                autoCommit: true,
            });
            const rawRows = (selectResult.rows ?? []);
            const rows = this.normalizeRows(rawRows);
            this.autoParseJson(rows);
            return { rows, rowCount: rows.length };
        }
        finally {
            await connection.close();
        }
    }
    // ---------------------------------------------------------------------------
    // UPSERT RETURNING — Oracle: execute MERGE, then SELECT back by conflict key
    // ---------------------------------------------------------------------------
    async upsertReturning(opts) {
        const sql = this.upsert(opts.table, opts.conflictCols, opts.insertCols, opts.updateCols, opts.startIdx ?? 1, opts.extraSetClauses);
        await this.query(sql, opts.values);
        // SELECT back the row using the conflict-key values
        const conflictValues = opts.conflictCols.map((col) => {
            const idx = opts.insertCols.indexOf(col);
            return opts.values[idx];
        });
        const where = opts.conflictCols
            .map((col, i) => `${col} = ${this.placeholder(i + 1)}`)
            .join(" AND ");
        return this.query(`SELECT ${opts.selectExpr} FROM ${opts.table} WHERE ${where} ${this.limitClause(1)}`, conflictValues);
    }
    // ---------------------------------------------------------------------------
    // DELETE with JOIN — Oracle uses WHERE EXISTS instead of USING
    // ---------------------------------------------------------------------------
    deleteWithJoin(targetTable, targetAlias, joinTable, joinAlias, joinCondition, whereCondition) {
        return (`DELETE FROM ${targetTable} ${targetAlias} ` +
            `WHERE EXISTS (SELECT 1 FROM ${joinTable} ${joinAlias} ` +
            `WHERE ${joinCondition} AND ${whereCondition})`);
    }
    async close() {
        if (this.pool) {
            await this.pool.close(0);
            this.pool = null;
        }
    }
}
//# sourceMappingURL=oracle.adapter.js.map