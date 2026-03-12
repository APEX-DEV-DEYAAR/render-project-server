import pg from "pg";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BaseAdapter } from "./base.adapter.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Return NUMERIC and BIGINT as JavaScript numbers instead of strings
pg.types.setTypeParser(20, (val) => parseInt(val, 10)); // BIGINT (int8)
pg.types.setTypeParser(1700, (val) => parseFloat(val)); // NUMERIC / DECIMAL
export class PostgresAdapter extends BaseAdapter {
    pool;
    constructor(connectionString) {
        super();
        this.pool = new pg.Pool({ connectionString });
    }
    async query(text, params = []) {
        const result = await this.pool.query(text, params);
        return { rows: result.rows, rowCount: result.rowCount ?? 0 };
    }
    async initialize() {
        const sqlDir = path.resolve(__dirname, "..", "..", "..", "sql", "postgres");
        await this.pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
        const migrationFiles = [
            "001_init.sql",
            "002_cost_tracking.sql",
            "004_cost_tracking_v2.sql",
            "005_segregation_v3.sql",
            "006_relational_feasibility.sql",
            "007_sales_staff_discounts.sql",
            "008_collections_forecast.sql",
            "009_collections_forecast_source_fields.sql",
            "010_collections_forecast_lookups.sql",
            "011_collections_forecast_formula_inputs.sql",
            "012_users.sql",
            "013_audit_log.sql",
        ];
        for (const file of migrationFiles) {
            const alreadyApplied = await this.pool.query("SELECT filename FROM schema_migrations WHERE filename = $1", [file]);
            if ((alreadyApplied.rowCount ?? 0) > 0) {
                continue;
            }
            const sqlPath = path.join(sqlDir, file);
            if (fs.existsSync(sqlPath)) {
                const sql = fs.readFileSync(sqlPath, "utf-8");
                await this.pool.query("BEGIN");
                try {
                    await this.pool.query(sql);
                    await this.pool.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
                    await this.pool.query("COMMIT");
                }
                catch (error) {
                    await this.pool.query("ROLLBACK");
                    throw error;
                }
            }
        }
    }
    placeholder(index) {
        return `$${index}`;
    }
    async close() {
        await this.pool.end();
    }
}
//# sourceMappingURL=postgres.adapter.js.map