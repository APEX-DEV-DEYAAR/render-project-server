import type { BaseAdapter } from "../db/adapters/base.adapter.js";
import type { CollectionsInstallment, SaveCollectionsInstallmentPayload } from "../types/index.js";
export declare class CollectionsForecastRepository {
    private readonly db;
    constructor(db: BaseAdapter);
    /** Build the SELECT expression for installment queries (needs db.dateToText) */
    private installmentSelect;
    getInstallments(projectId: number): Promise<CollectionsInstallment[]>;
    saveInstallment(payload: SaveCollectionsInstallmentPayload): Promise<CollectionsInstallment>;
    bulkSaveInstallments(payloads: SaveCollectionsInstallmentPayload[]): Promise<CollectionsInstallment[]>;
    getAllInstallments(): Promise<Array<CollectionsInstallment & {
        projectName: string;
    }>>;
    private normalizeStatus;
}
//# sourceMappingURL=collections-forecast.repository.d.ts.map