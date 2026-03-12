import { CollectionsRepository } from "../repositories/revenue.repository.js";
import type { ProjectMonthlyCollections, MonthlyCollectionsRow, SaveMonthlyCollectionsPayload } from "../types/index.js";
export declare class CollectionsService {
    private readonly repo;
    constructor(repo: CollectionsRepository);
    getMonthlyCollections(projectId: number, year?: number): Promise<MonthlyCollectionsRow[]>;
    saveMonthlyCollections(payload: SaveMonthlyCollectionsPayload): Promise<ProjectMonthlyCollections>;
    bulkSaveMonthlyCollections(payloads: SaveMonthlyCollectionsPayload[]): Promise<ProjectMonthlyCollections[]>;
    deleteMonthlyCollections(projectId: number, year: number, month: number): Promise<boolean>;
    clearProjectCollections(projectId: number): Promise<number>;
}
//# sourceMappingURL=revenue.service.d.ts.map