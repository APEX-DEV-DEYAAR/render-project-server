const COLLECTIONS_INSERT_COLS = [
    "project_id", "year", "month",
    "budget_amount", "actual_amount", "projected_amount", "notes", "created_by",
];
const COLLECTIONS_UPDATE_COLS = [
    "budget_amount", "actual_amount", "projected_amount", "notes", "created_by",
];
const COLLECTIONS_CONFLICT_COLS = ["project_id", "year", "month"];
const COLLECTIONS_SELECT = `id,
         project_id AS "projectId",
         year,
         month,
         budget_amount AS "budgetAmount",
         actual_amount AS "actualAmount",
         projected_amount AS "projectedAmount",
         notes,
         created_by AS "createdBy",
         created_at AS "createdAt",
         updated_at AS "updatedAt"`;
export class CollectionsRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async getMonthlyCollections(projectId, year) {
        const params = [projectId];
        let yearFilter = "";
        if (typeof year === "number") {
            params.push(year);
            yearFilter = `AND year = ${this.db.placeholder(2)}`;
        }
        const { rows } = await this.db.query(`SELECT
         ${COLLECTIONS_SELECT}
       FROM project_monthly_revenue
       WHERE project_id = ${this.db.placeholder(1)}
         ${yearFilter}
       ORDER BY year, month`, params);
        return rows;
    }
    async saveMonthlyCollections(payload) {
        const result = await this.db.upsertReturning({
            table: "project_monthly_revenue",
            conflictCols: [...COLLECTIONS_CONFLICT_COLS],
            insertCols: [...COLLECTIONS_INSERT_COLS],
            updateCols: [...COLLECTIONS_UPDATE_COLS],
            values: [
                payload.projectId,
                payload.year,
                payload.month,
                payload.budgetAmount ?? null,
                payload.actualAmount ?? null,
                payload.projectedAmount ?? null,
                payload.notes ?? null,
                payload.createdBy ?? null,
            ],
            selectExpr: COLLECTIONS_SELECT,
            extraSetClauses: [`updated_at = ${this.db.nowExpression()}`],
        });
        return result.rows[0];
    }
    async bulkSaveMonthlyCollections(payloads) {
        if (payloads.length > 500) {
            throw new Error("Bulk operations are limited to 500 items");
        }
        const results = [];
        for (const payload of payloads) {
            const result = await this.saveMonthlyCollections(payload);
            results.push(result);
        }
        return results;
    }
    async deleteMonthlyCollections(projectId, year, month) {
        const { rowCount } = await this.db.query(`DELETE FROM project_monthly_revenue
       WHERE project_id = ${this.db.placeholder(1)}
         AND year = ${this.db.placeholder(2)}
         AND month = ${this.db.placeholder(3)}`, [projectId, year, month]);
        return rowCount > 0;
    }
    async clearProjectCollections(projectId) {
        const { rowCount } = await this.db.query(`DELETE FROM project_monthly_revenue WHERE project_id = ${this.db.placeholder(1)}`, [projectId]);
        return rowCount;
    }
}
//# sourceMappingURL=revenue.repository.js.map