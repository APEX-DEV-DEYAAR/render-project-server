/**
 * Audit logging middleware.
 * Persists state-changing requests (POST, PUT, DELETE) to the audit_log table.
 * Falls back to console.log if the DB write fails so it never blocks the request.
 */
export function createAuditLog(auditRepo) {
    return (req, res, next) => {
        if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
            const start = Date.now();
            res.on("finish", () => {
                const entry = {
                    username: req.user?.username ?? "anonymous",
                    role: req.user?.role ?? "unknown",
                    method: req.method,
                    path: req.originalUrl,
                    statusCode: res.statusCode,
                    durationMs: Date.now() - start,
                };
                auditRepo.insert(entry).catch(() => {
                    // Fallback: log to stdout if DB write fails
                    console.log("[AUDIT]", JSON.stringify({ ...entry, timestamp: new Date().toISOString() }));
                });
            });
        }
        next();
    };
}
// Re-export for backward compatibility during wiring
export { createAuditLog as auditLog };
//# sourceMappingURL=auditLog.js.map