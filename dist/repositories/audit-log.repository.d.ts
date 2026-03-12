import type { BaseAdapter } from "../db/adapters/base.adapter.js";
export interface AuditEntry {
    username: string;
    role: string;
    method: string;
    path: string;
    statusCode: number;
    durationMs: number;
}
export declare class AuditLogRepository {
    private readonly db;
    constructor(db: BaseAdapter);
    insert(entry: AuditEntry): Promise<void>;
}
//# sourceMappingURL=audit-log.repository.d.ts.map