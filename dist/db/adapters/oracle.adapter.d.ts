import { BaseAdapter } from "./base.adapter.js";
import type { UpsertReturningOptions } from "./base.adapter.js";
import type { QueryResult } from "../../types/index.js";
export interface OracleConnectionConfig {
    user: string;
    password: string;
    connectString: string;
    configDir: string;
    walletDir: string;
    walletPassword: string;
}
export declare class OracleAdapter extends BaseAdapter {
    private pool;
    private config;
    constructor(config: OracleConnectionConfig);
    private normalizeRows;
    private autoParseJson;
    query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<QueryResult<T>>;
    initialize(): Promise<void>;
    private runMigrations;
    /**
     * Split Oracle SQL script into individual executable statements.
     * Handles PL/SQL blocks (BEGIN...END;) terminated by "/" and plain
     * statements terminated by ";".
     */
    private splitOracleStatements;
    placeholder(index: number): string;
    nowExpression(): string;
    limitClause(count: number): string;
    jsonCast(ph: string): string;
    dateToText(column: string): string;
    boolExpr(expr: string): string;
    upsert(table: string, conflictCols: string[], insertCols: string[], updateCols: string[], startIdx: number, extraSetClauses?: string[]): string;
    upsertOrIgnore(table: string, conflictCols: string[], insertCols: string[], startIdx: number): string;
    insertReturning<T = Record<string, unknown>>(table: string, insertCols: string[], values: unknown[], returningExpr: string, startIdx?: number, valueExprs?: string[]): Promise<QueryResult<T>>;
    upsertReturning<T = Record<string, unknown>>(opts: UpsertReturningOptions): Promise<QueryResult<T>>;
    deleteWithJoin(targetTable: string, targetAlias: string, joinTable: string, joinAlias: string, joinCondition: string, whereCondition: string): string;
    close(): Promise<void>;
}
//# sourceMappingURL=oracle.adapter.d.ts.map