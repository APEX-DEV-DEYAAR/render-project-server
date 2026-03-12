import { CollectionsForecastRepository } from "../repositories/collections-forecast.repository.js";
import { CollectionsLookupRepository } from "../repositories/collections-lookup.repository.js";
import { CollectionsProbabilityService } from "./collections-probability.service.js";
import type { CollectionsAgingLookup, CollectionsCompletionLookup, CollectionsForecastDashboard, CollectionsInstallment, CollectionsPortfolioDashboard, SaveCollectionsAgingLookupPayload, SaveCollectionsCompletionLookupPayload, SaveCollectionsInstallmentPayload } from "../types/index.js";
export declare class CollectionsForecastService {
    private readonly repo;
    private readonly lookupRepo;
    private readonly probabilityService;
    constructor(repo: CollectionsForecastRepository, lookupRepo: CollectionsLookupRepository, probabilityService?: CollectionsProbabilityService);
    getInstallments(projectId: number): Promise<CollectionsInstallment[]>;
    bulkSaveCompletionLookups(payloads: SaveCollectionsCompletionLookupPayload[]): Promise<CollectionsCompletionLookup[]>;
    bulkSaveAgingLookups(payloads: SaveCollectionsAgingLookupPayload[]): Promise<CollectionsAgingLookup[]>;
    bulkSaveInstallments(payloads: SaveCollectionsInstallmentPayload[]): Promise<CollectionsInstallment[]>;
    getDashboard(projectId: number, asOf?: string): Promise<CollectionsForecastDashboard>;
    getPortfolioDashboard(asOf?: string): Promise<CollectionsPortfolioDashboard>;
    private applyForecastFormulae;
}
//# sourceMappingURL=collections-forecast.service.d.ts.map