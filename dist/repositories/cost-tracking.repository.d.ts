import type { BaseAdapter } from "../db/adapters/base.adapter.js";
import type { CostCategory, ProjectMonthlyCost, CostSummaryItem, CostAnnualSummaryItem, SaveMonthlyCostPayload, TeamCode } from "../types/index.js";
export declare class CostTrackingRepository {
    private readonly db;
    constructor(db: BaseAdapter);
    getCategories(team?: TeamCode): Promise<CostCategory[]>;
    getMonthlyCosts(projectId: number, year?: number, team?: TeamCode): Promise<ProjectMonthlyCost[]>;
    getMonthlyCostsForAllProjects(year: number): Promise<ProjectMonthlyCost[]>;
    saveMonthlyCost(payload: SaveMonthlyCostPayload): Promise<ProjectMonthlyCost>;
    bulkSaveMonthlyCosts(payloads: SaveMonthlyCostPayload[]): Promise<ProjectMonthlyCost[]>;
    deleteMonthlyCost(projectId: number, categoryId: number, year: number, month: number): Promise<boolean>;
    getCostSummary(projectId: number, year?: number): Promise<CostSummaryItem[]>;
    getAnnualSummary(projectId: number, year?: number): Promise<CostAnnualSummaryItem[]>;
    initializeYear(projectId: number, year: number, defaultProjectedAmount?: number, createdBy?: string, team?: TeamCode): Promise<ProjectMonthlyCost[]>;
    getTeamLastActivity(projectId: number, year: number): Promise<Record<string, string | null>>;
    clearAllData(): Promise<number>;
    clearProjectData(projectId: number, team?: TeamCode): Promise<number>;
}
//# sourceMappingURL=cost-tracking.repository.d.ts.map