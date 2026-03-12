import type { BaseAdapter } from "../db/adapters/base.adapter.js";
import type { ArchivedRun, FeasibilityRun } from "../types/index.js";
export declare class FeasibilityRelationalRepository {
    private readonly db;
    constructor(db: BaseAdapter);
    backfillFromJson(): Promise<void>;
    syncRun(run: FeasibilityRun): Promise<void>;
    deleteRun(runId: number): Promise<void>;
    syncArchive(archive: ArchivedRun): Promise<void>;
    private replaceRunPartners;
    private replaceArchivePartners;
    private static readonly ALLOWED_PARTNER_TABLES;
    private static readonly ALLOWED_OWNER_COLUMNS;
    private insertPartners;
    private buildSnapshot;
    private inputValues;
    private metricValues;
}
//# sourceMappingURL=feasibility-relational.repository.d.ts.map