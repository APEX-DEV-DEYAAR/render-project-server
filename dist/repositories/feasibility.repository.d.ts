import type { BaseAdapter } from "../db/adapters/base.adapter.js";
import type { FeasibilityRun, NormalizedPayload, FeasibilityMetrics } from "../types/index.js";
export declare class FeasibilityRepository {
    private readonly db;
    constructor(db: BaseAdapter);
    findLatestByProjectId(projectId: number): Promise<FeasibilityRun | null>;
    createDraft(projectId: number, payload: NormalizedPayload, metrics: FeasibilityMetrics): Promise<FeasibilityRun>;
    updateDraft(runId: number, payload: NormalizedPayload, metrics: FeasibilityMetrics): Promise<FeasibilityRun>;
    freeze(runId: number, version: number): Promise<FeasibilityRun>;
    deleteByRunId(runId: number): Promise<boolean>;
    findAllWithMetrics(): Promise<FeasibilityRun[]>;
    getNextVersion(projectId: number): Promise<number>;
}
//# sourceMappingURL=feasibility.repository.d.ts.map