import { BaseAdapter } from "./base.adapter.js";
import type { QueryResult } from "../../types/index.js";
export declare class PostgresAdapter extends BaseAdapter {
    private pool;
    constructor(connectionString: string);
    query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<QueryResult<T>>;
    initialize(): Promise<void>;
    placeholder(index: number): string;
    close(): Promise<void>;
}
//# sourceMappingURL=postgres.adapter.d.ts.map