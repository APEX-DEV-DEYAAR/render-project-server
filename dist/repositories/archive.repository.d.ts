import type { BaseAdapter } from "../db/adapters/base.adapter.js";
import type { ArchivedRun, FeasibilityRun } from "../types/index.js";
export declare class ArchiveRepository {
    private readonly db;
    constructor(db: BaseAdapter);
    archiveRun(run: FeasibilityRun): Promise<ArchivedRun>;
    findByProjectId(projectId: number): Promise<ArchivedRun[]>;
}
//# sourceMappingURL=archive.repository.d.ts.map