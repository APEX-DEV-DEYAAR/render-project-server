/**
 * Abstract database adapter.
 * Implement this for each supported database engine (Postgres, Oracle, etc.).
 */
export class BaseAdapter {
    /**
     * Return the positional placeholder token for the given 1-based index.
     * Postgres: $1   Oracle: :1
     */
    placeholder(index) {
        return `$${index}`;
    }
    /**
     * Database-specific expression for the current timestamp.
     */
    nowExpression() {
        return "CURRENT_TIMESTAMP";
    }
    /**
     * Database-specific single-row limiter.
     */
    limitClause(count) {
        return `FETCH FIRST ${count} ROWS ONLY`;
    }
    /** Cast a placeholder to JSON column type. PG: ::jsonb, Oracle: no-op */
    jsonCast(placeholder) {
        return `${placeholder}::jsonb`;
    }
    /** Convert a date/timestamp column to text string. PG: ::text, Oracle: TO_CHAR */
    dateToText(column) {
        return `${column}::text`;
    }
    /** Wrap an expression that should evaluate to a boolean value. PG: native bool, Oracle: CASE 0/1 */
    boolExpr(expr) {
        return `(${expr})`;
    }
    /**
     * Generate an UPSERT (INSERT ... ON CONFLICT ... DO UPDATE) statement.
     * PG: INSERT ... ON CONFLICT ... DO UPDATE SET col = EXCLUDED.col
     * Oracle: MERGE INTO ... USING dual ...
     */
    upsert(table, conflictCols, insertCols, updateCols, startIdx, extraSetClauses) {
        const placeholders = insertCols.map((_, i) => this.placeholder(startIdx + i)).join(", ");
        const updates = updateCols.map((c) => `${c} = EXCLUDED.${c}`);
        if (extraSetClauses)
            updates.push(...extraSetClauses);
        return (`INSERT INTO ${table} (${insertCols.join(", ")}) VALUES (${placeholders}) ` +
            `ON CONFLICT (${conflictCols.join(", ")}) DO UPDATE SET ${updates.join(", ")}`);
    }
    /**
     * Generate an UPSERT-or-ignore (INSERT ... ON CONFLICT ... DO NOTHING) statement.
     * PG: INSERT ... ON CONFLICT ... DO NOTHING
     * Oracle: MERGE INTO ... WHEN NOT MATCHED THEN INSERT
     */
    upsertOrIgnore(table, conflictCols, insertCols, startIdx) {
        const placeholders = insertCols.map((_, i) => this.placeholder(startIdx + i)).join(", ");
        return (`INSERT INTO ${table} (${insertCols.join(", ")}) VALUES (${placeholders}) ` +
            `ON CONFLICT (${conflictCols.join(", ")}) DO NOTHING`);
    }
    /**
     * Execute an INSERT and return the inserted row.
     * PG: appends RETURNING clause
     * Oracle: uses RETURNING id INTO + separate SELECT
     *
     * @param valueExprs  Optional custom value expressions (e.g. with jsonCast).
     *                    If omitted, plain placeholders are generated.
     */
    async insertReturning(table, insertCols, values, returningExpr, startIdx = 1, valueExprs) {
        const placeholders = valueExprs
            ? valueExprs.join(", ")
            : insertCols.map((_, i) => this.placeholder(startIdx + i)).join(", ");
        const sql = `INSERT INTO ${table} (${insertCols.join(", ")}) VALUES (${placeholders}) ` +
            `RETURNING ${returningExpr}`;
        return this.query(sql, values);
    }
    /**
     * Execute an UPSERT and return the resulting row.
     * PG: appends RETURNING to the ON CONFLICT statement
     * Oracle: executes MERGE then SELECT by conflict key
     */
    async upsertReturning(opts) {
        const sql = this.upsert(opts.table, opts.conflictCols, opts.insertCols, opts.updateCols, opts.startIdx ?? 1, opts.extraSetClauses);
        return this.query(`${sql} RETURNING ${opts.selectExpr}`, opts.values);
    }
    /**
     * Generate a DELETE with JOIN.
     * PG: DELETE ... USING
     * Oracle: DELETE ... WHERE EXISTS
     */
    deleteWithJoin(targetTable, targetAlias, joinTable, joinAlias, joinCondition, whereCondition) {
        return (`DELETE FROM ${targetTable} ${targetAlias} ` +
            `USING ${joinTable} ${joinAlias} ` +
            `WHERE ${joinCondition} AND ${whereCondition}`);
    }
}
//# sourceMappingURL=base.adapter.js.map