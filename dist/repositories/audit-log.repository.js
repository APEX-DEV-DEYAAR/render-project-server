export class AuditLogRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async insert(entry) {
        await this.db.query(`INSERT INTO audit_log (username, role, method, path, status_code, duration_ms)
       VALUES (${this.db.placeholder(1)}, ${this.db.placeholder(2)}, ${this.db.placeholder(3)}, ${this.db.placeholder(4)}, ${this.db.placeholder(5)}, ${this.db.placeholder(6)})`, [entry.username, entry.role, entry.method, entry.path, entry.statusCode, entry.durationMs]);
    }
}
//# sourceMappingURL=audit-log.repository.js.map