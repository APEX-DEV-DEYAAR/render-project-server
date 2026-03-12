import type { BaseAdapter } from "../db/adapters/base.adapter.js";
import type { CollectionsAgingLookup, CollectionsCompletionLookup, SaveCollectionsAgingLookupPayload, SaveCollectionsCompletionLookupPayload } from "../types/index.js";
export declare class CollectionsLookupRepository {
    private readonly db;
    constructor(db: BaseAdapter);
    private buildInClause;
    private completionSelect;
    bulkSaveCompletionLookups(payloads: SaveCollectionsCompletionLookupPayload[]): Promise<CollectionsCompletionLookup[]>;
    bulkSaveAgingLookups(payloads: SaveCollectionsAgingLookupPayload[]): Promise<CollectionsAgingLookup[]>;
    getCompletionLookup(buildingName: string): Promise<CollectionsCompletionLookup | null>;
    getCompletionLookups(buildingNames: string[]): Promise<Map<string, CollectionsCompletionLookup>>;
    getAgingLookup(locationCode: string): Promise<CollectionsAgingLookup | null>;
    getAgingLookups(locationCodes: string[]): Promise<Map<string, CollectionsAgingLookup>>;
}
//# sourceMappingURL=collections-lookup.repository.d.ts.map