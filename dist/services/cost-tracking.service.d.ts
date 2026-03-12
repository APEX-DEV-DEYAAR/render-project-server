import { CostTrackingRepository } from "../repositories/cost-tracking.repository.js";
import { CollectionsRepository } from "../repositories/revenue.repository.js";
import type { CostCategory, ProjectMonthlyCost, MonthlyCostRow, CostSummaryItem, CostAnnualSummaryItem, SaveMonthlyCostPayload, TeamCode, BudgetVsActualsResponse } from "../types/index.js";
export declare class CostTrackingService {
    private readonly repo;
    private readonly collectionsRepo?;
    constructor(repo: CostTrackingRepository, collectionsRepo?: CollectionsRepository | undefined);
    getCategories(team?: TeamCode): Promise<CostCategory[]>;
    getMonthlyCosts(projectId: number, year?: number, team?: TeamCode): Promise<MonthlyCostRow[]>;
    getMonthlyCostsForAllProjects(year: number): Promise<ProjectMonthlyCost[]>;
    saveMonthlyCost(payload: SaveMonthlyCostPayload): Promise<ProjectMonthlyCost>;
    bulkSaveMonthlyCosts(payloads: SaveMonthlyCostPayload[]): Promise<ProjectMonthlyCost[]>;
    deleteMonthlyCost(projectId: number, categoryId: number, year: number, month: number): Promise<boolean>;
    getCostSummary(projectId: number, year?: number): Promise<CostSummaryItem[]>;
    getAnnualSummary(projectId: number, year?: number): Promise<CostAnnualSummaryItem[]>;
    initializeYear(projectId: number, year: number, defaultProjectedAmount?: number, createdBy?: string, team?: TeamCode): Promise<ProjectMonthlyCost[]>;
    copyFromPreviousYear(projectId: number, sourceYear: number, targetYear: number, createdBy?: string): Promise<ProjectMonthlyCost[]>;
    clearProjectData(projectId: number, team?: TeamCode): Promise<number>;
    getBudgetVsActuals(projectId: number, year: number): Promise<BudgetVsActualsResponse>;
}
//# sourceMappingURL=cost-tracking.service.d.ts.map