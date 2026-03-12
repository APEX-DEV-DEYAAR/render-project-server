import type { Request, Response, NextFunction } from "express";
import type { AuditLogRepository } from "../repositories/audit-log.repository.js";
/**
 * Audit logging middleware.
 * Persists state-changing requests (POST, PUT, DELETE) to the audit_log table.
 * Falls back to console.log if the DB write fails so it never blocks the request.
 */
export declare function createAuditLog(auditRepo: AuditLogRepository): (req: Request, res: Response, next: NextFunction) => void;
export { createAuditLog as auditLog };
//# sourceMappingURL=auditLog.d.ts.map