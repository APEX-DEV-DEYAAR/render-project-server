import { BaseAdapter } from "./adapters/base.adapter.js";
import type { AppConfig } from "../types/index.js";
/**
 * Factory: instantiate the right database adapter based on config.
 * Oracle adapter is dynamically imported so Postgres-only deployments don't need oracledb.
 */
export declare function createDatabaseAdapter(config: AppConfig): Promise<BaseAdapter>;
//# sourceMappingURL=index.d.ts.map