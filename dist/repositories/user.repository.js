export class UserRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findByUsername(username) {
        const { rows } = await this.db.query(`SELECT id, username, password_hash AS "passwordHash", role,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM app_users
       WHERE username = ${this.db.placeholder(1)}`, [username]);
        return rows[0] ?? null;
    }
    async findById(id) {
        const { rows } = await this.db.query(`SELECT id, username, password_hash AS "passwordHash", role,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM app_users
       WHERE id = ${this.db.placeholder(1)}`, [id]);
        return rows[0] ?? null;
    }
    async create(username, passwordHash, role) {
        const result = await this.db.insertReturning("app_users", ["username", "password_hash", "role"], [username, passwordHash, role], 'id, username, password_hash AS "passwordHash", role, created_at AS "createdAt", updated_at AS "updatedAt"');
        return result.rows[0];
    }
    async listAll() {
        const { rows } = await this.db.query(`SELECT id, username, role, created_at AS "createdAt", updated_at AS "updatedAt"
       FROM app_users
       ORDER BY id`);
        return rows;
    }
    async updatePassword(id, passwordHash) {
        await this.db.query(`UPDATE app_users SET password_hash = ${this.db.placeholder(1)}, updated_at = ${this.db.nowExpression()} WHERE id = ${this.db.placeholder(2)}`, [passwordHash, id]);
    }
    async count() {
        const { rows } = await this.db.query(`SELECT COUNT(*) AS "cnt" FROM app_users`);
        return Number(rows[0]?.cnt ?? 0);
    }
}
//# sourceMappingURL=user.repository.js.map