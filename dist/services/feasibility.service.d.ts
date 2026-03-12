import type { FeasibilityRepository } from "../repositories/feasibility.repository.js";
import type { ArchiveRepository } from "../repositories/archive.repository.js";
import type { FeasibilityRelationalRepository } from "../repositories/feasibility-relational.repository.js";
import type { ProjectRepository } from "../repositories/project.repository.js";
import type { ReportingRepository } from "../repositories/reporting.repository.js";
import type { FeasibilityRun, ArchivedRun } from "../types/index.js";
export declare class FeasibilityService {
    private readonly feasibilityRepo;
    private readonly archiveRepo;
    private readonly relationalRepo;
    private readonly projectRepo;
    private readonly reportingRepo;
    constructor(feasibilityRepo: FeasibilityRepository, archiveRepo: ArchiveRepository, relationalRepo: FeasibilityRelationalRepository, projectRepo: ProjectRepository, reportingRepo: ReportingRepository);
    getPortfolio(): Promise<FeasibilityRun[]>;
    getLatest(projectId: number): Promise<FeasibilityRun | null>;
    saveDraft(projectId: number, body: Record<string, unknown>): Promise<FeasibilityRun>;
    freeze(projectId: number): Promise<FeasibilityRun>;
    editFrozen(projectId: number): Promise<FeasibilityRun>;
    getArchive(projectId: number): Promise<ArchivedRun[]>;
    private ensureProjectExists;
}
//# sourceMappingURL=feasibility.service.d.ts.map