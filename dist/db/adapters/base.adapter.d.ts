import type { QueryResult } from "../../types/index.js";
export interface UpsertReturningOptions {
    table: string;
    conflictCols: string[];
    insertCols: string[];
    updateCols: string[];
    values: unknown[];
    selectExpr: string;
    extraSetClauses?: string[];
    startIdx?: number;
}
/**
 * Abstract database adapter.
 * Implement this for each supported database engine (Postgres, Oracle, etc.).
 */
export declare abstract class BaseAdapter {
    abstract query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<QueryResult<T>>;
    abstract initialize(): Promise<void>;
    abstract close(): Promise<void>;
    /**
     * Return the positional placeholder token for the given 1-based index.
     * Postgres: $1   Oracle: :1
     */
    placeholder(index: number): string;
    /**
     * Database-specific expression for the current timestamp.
     */
    nowExpression(): string;
    /**
     * Database-specific single-row limiter.
     */
    limitClause(count: number): string;
    /** Cast a placeholder to JSON column type. PG: ::jsonb, Oracle: no-op */
    jsonCast(placeholder: string): string;
    /** Convert a date/timestamp column to text string. PG: ::text, Oracle: TO_CHAR */
    dateToText(column: string): string;
    /** Wrap an expression that should evaluate to a boolean value. PG: native bool, Oracle: CASE 0/1 */
    boolExpr(expr: string): string;
    /**
     * Generate an UPSERT (INSERT ... ON CONFLICT ... DO UPDATE) statement.
     * PG: INSERT ... ON CONFLICT ... DO UPDATE SET col = EXCLUDED.col
     * Oracle: MERGE INTO ... USING dual ...
     */
    upsert(table: string, conflictCols: string[], insertCols: string[], updateCols: string[], startIdx: number, extraSetClauses?: string[]): string;
    /**
     * Generate an UPSERT-or-ignore (INSERT ... ON CONFLICT ... DO NOTHING) statement.
     * PG: INSERT ... ON CONFLICT ... DO NOTHING
     * Oracle: MERGE INTO ... WHEN NOT MATCHED THEN INSERT
     */
    upsertOrIgnore(table: string, conflictCols: string[], insertCols: string[], startIdx: number): string;
    /**
     * Execute an INSERT and return the inserted row.
     * PG: appends RETURNING clause
     * Oracle: uses RETURNING id INTO + separate SELECT
     *
     * @param valueExprs  Optional custom value expressions (e.g. with jsonCast).
     *                    If omitted, plain placeholders are generated.
     */
    insertReturning<T = Record<string, unknown>>(table: string, insertCols: string[], values: unknown[], returningExpr: string, startIdx?: number, valueExprs?: string[]): Promise<QueryResult<T>>;
    /**
     * Execute an UPSERT and return the resulting row.
     * PG: appends RETURNING to the ON CONFLICT statement
     * Oracle: executes MERGE then SELECT by conflict key
     */
    upsertReturning<T = Record<string, unknown>>(opts: UpsertReturningOptions): Promise<QueryResult<T>>;
    /**
     * Generate a DELETE with JOIN.
     * PG: DELETE ... USING
     * Oracle: DELETE ... WHERE EXISTS
     */
    deleteWithJoin(targetTable: string, targetAlias: string, joinTable: string, joinAlias: string, joinCondition: string, whereCondition: string): string;
}
//# sourceMappingURL=base.adapter.d.ts.map