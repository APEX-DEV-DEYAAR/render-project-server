import type { BaseAdapter } from "../db/adapters/base.adapter.js";
import type { ProjectMonthlyCollections, SaveMonthlyCollectionsPayload } from "../types/index.js";
export declare class CollectionsRepository {
    private readonly db;
    constructor(db: BaseAdapter);
    getMonthlyCollections(projectId: number, year?: number): Promise<ProjectMonthlyCollections[]>;
    saveMonthlyCollections(payload: SaveMonthlyCollectionsPayload): Promise<ProjectMonthlyCollections>;
    bulkSaveMonthlyCollections(payloads: SaveMonthlyCollectionsPayload[]): Promise<ProjectMonthlyCollections[]>;
    deleteMonthlyCollections(projectId: number, year: number, month: number): Promise<boolean>;
    clearProjectCollections(projectId: number): Promise<number>;
}
//# sourceMappingURL=revenue.repository.d.ts.map