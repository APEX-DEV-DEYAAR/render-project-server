import type { BaseAdapter } from "../db/adapters/base.adapter.js";
import type { ArchivedRun, FeasibilityRun } from "../types/index.js";
export declare class ReportingRepository {
    private readonly db;
    constructor(db: BaseAdapter);
    backfill(): Promise<void>;
    syncCurrent(run: FeasibilityRun): Promise<void>;
    deleteCurrent(runId: number): Promise<void>;
    insertArchive(archive: ArchivedRun): Promise<void>;
    private replaceCurrentPartners;
    private replaceArchivePartners;
    private static readonly ALLOWED_PARTNER_TABLES;
    private static readonly ALLOWED_OWNER_COLUMNS;
    private insertPartners;
    private buildSnapshot;
    private extractPartners;
    private snapshotValues;
}
//# sourceMappingURL=reporting.repository.d.ts.map