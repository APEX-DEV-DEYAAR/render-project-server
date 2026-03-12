const UPSERT_COLUMNS = [
    "project_id",
    "customer_name",
    "unit_ref",
    "building_name",
    "location_code",
    "installment_label",
    "due_date",
    "forecast_amount",
    "collected_amount",
    "collection_date",
    "status",
    "probability_pct",
    "risk_category",
    "exposure_bucket",
    "expected_forfeiture",
    "unit_forecast",
    "over_due_pct",
    "installments_over_due",
    "source_status",
    "payment_plan_name",
    "property_type",
    "spa_signed_date",
    "spa_sign_status",
    "tsv_amount",
    "total_cleared",
    "waived_amount",
    "total_over_due",
    "cleared_pct",
    "paid_pct",
    "is_unit_over_due",
    "installments_over_due_bucket",
    "over_due_pct_bucket",
    "registered_sale_type",
    "latest_construction_progress",
    "can_claim_total",
    "can_claim_additional",
    "eligible_for_dld_termination",
    "project_completion_date",
    "notes",
    "created_by",
];
const CONFLICT_COLS = ["project_id", "unit_ref", "installment_label", "due_date"];
export class CollectionsForecastRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    /** Build the SELECT expression for installment queries (needs db.dateToText) */
    installmentSelect(prefix = "") {
        const p = prefix ? `${prefix}.` : "";
        return `${p}id,
   ${p}project_id AS "projectId",
   ${p}customer_name AS "customerName",
   ${p}unit_ref AS "unitRef",
   ${p}building_name AS "buildingName",
   ${p}location_code AS "locationCode",
   ${p}installment_label AS "installmentLabel",
   ${this.db.dateToText(`${p}due_date`)} AS "dueDate",
   ${p}forecast_amount AS "forecastAmount",
   ${p}collected_amount AS "collectedAmount",
   GREATEST(${p}forecast_amount - ${p}collected_amount, 0) AS "outstandingAmount",
   ${this.db.dateToText(`${p}collection_date`)} AS "collectionDate",
   ${p}status,
   ${p}probability_pct AS "probabilityPct",
   ${p}risk_category AS "riskCategory",
   ${p}exposure_bucket AS "exposureBucket",
   ${p}expected_forfeiture AS "expectedForfeiture",
   ${p}unit_forecast AS "unitForecast",
   ${p}over_due_pct AS "overDuePct",
   ${p}installments_over_due AS "installmentsOverDue",
   ${p}source_status AS "sourceStatus",
   ${p}payment_plan_name AS "paymentPlanName",
   ${p}property_type AS "propertyType",
   ${this.db.dateToText(`${p}spa_signed_date`)} AS "spaSignedDate",
   ${p}spa_sign_status AS "spaSignStatus",
   ${p}tsv_amount AS "tsvAmount",
   ${p}total_cleared AS "totalCleared",
   ${p}waived_amount AS "waivedAmount",
   ${p}total_over_due AS "totalOverDue",
   ${p}cleared_pct AS "clearedPct",
   ${p}paid_pct AS "paidPct",
   ${p}is_unit_over_due AS "isUnitOverDue",
   ${p}installments_over_due_bucket AS "installmentsOverDueBucket",
   ${p}over_due_pct_bucket AS "overDuePctBucket",
   ${p}registered_sale_type AS "registeredSaleType",
   ${p}latest_construction_progress AS "latestConstructionProgress",
   ${p}can_claim_total AS "canClaimTotal",
   ${p}can_claim_additional AS "canClaimAdditional",
   ${p}eligible_for_dld_termination AS "eligibleForDldTermination",
   ${this.db.dateToText(`${p}project_completion_date`)} AS "projectCompletionDate",
   ${p}notes,
   ${p}created_by AS "createdBy",
   ${p}created_at AS "createdAt",
   ${p}updated_at AS "updatedAt"`;
    }
    async getInstallments(projectId) {
        const { rows } = await this.db.query(`SELECT ${this.installmentSelect()}
       FROM project_collections_installments
       WHERE project_id = ${this.db.placeholder(1)}
       ORDER BY due_date, unit_ref, installment_label`, [projectId]);
        return rows;
    }
    async saveInstallment(payload) {
        const status = this.normalizeStatus(payload);
        const values = [
            payload.projectId,
            payload.customerName,
            payload.unitRef,
            payload.buildingName ?? null,
            payload.locationCode ?? null,
            payload.installmentLabel,
            payload.dueDate,
            payload.forecastAmount,
            payload.collectedAmount ?? 0,
            payload.collectionDate ?? null,
            status,
            payload.probabilityPct ?? 100,
            payload.riskCategory ?? null,
            payload.exposureBucket ?? null,
            payload.expectedForfeiture ?? null,
            payload.unitForecast ?? null,
            payload.overDuePct ?? null,
            payload.installmentsOverDue ?? null,
            payload.sourceStatus ?? null,
            payload.paymentPlanName ?? null,
            payload.propertyType ?? null,
            payload.spaSignedDate ?? null,
            payload.spaSignStatus ?? null,
            payload.tsvAmount ?? null,
            payload.totalCleared ?? null,
            payload.waivedAmount ?? null,
            payload.totalOverDue ?? null,
            payload.clearedPct ?? null,
            payload.paidPct ?? null,
            payload.isUnitOverDue ?? null,
            payload.installmentsOverDueBucket ?? null,
            payload.overDuePctBucket ?? null,
            payload.registeredSaleType ?? null,
            payload.latestConstructionProgress ?? null,
            payload.canClaimTotal ?? null,
            payload.canClaimAdditional ?? null,
            payload.eligibleForDldTermination ?? null,
            payload.projectCompletionDate ?? null,
            payload.notes ?? null,
            payload.createdBy ?? null,
        ];
        const updateCols = [...UPSERT_COLUMNS].filter((c) => ![...CONFLICT_COLS].includes(c));
        const result = await this.db.upsertReturning({
            table: "project_collections_installments",
            conflictCols: [...CONFLICT_COLS],
            insertCols: [...UPSERT_COLUMNS],
            updateCols,
            values,
            selectExpr: this.installmentSelect(),
            extraSetClauses: [`updated_at = ${this.db.nowExpression()}`],
        });
        return result.rows[0];
    }
    async bulkSaveInstallments(payloads) {
        if (payloads.length > 500) {
            throw new Error("Bulk operations are limited to 500 items");
        }
        const results = [];
        for (const payload of payloads) {
            results.push(await this.saveInstallment(payload));
        }
        return results;
    }
    async getAllInstallments() {
        const { rows } = await this.db.query(`SELECT
         ${this.installmentSelect("pci")},
         p.name AS "projectName"
       FROM project_collections_installments pci
       JOIN projects p ON p.id = pci.project_id
       ORDER BY p.name, pci.due_date, pci.unit_ref`);
        return rows;
    }
    normalizeStatus(payload) {
        const forecast = payload.forecastAmount ?? 0;
        const collected = payload.collectedAmount ?? 0;
        const explicit = payload.status;
        if (explicit) {
            return explicit;
        }
        if (collected >= forecast && forecast > 0) {
            return "collected";
        }
        if (collected > 0) {
            return "partially_collected";
        }
        return "forecast";
    }
}
//# sourceMappingURL=collections-forecast.repository.js.map