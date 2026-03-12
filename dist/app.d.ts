import { type Express } from "express";
import type { ProjectService } from "./services/project.service.js";
import type { FeasibilityService } from "./services/feasibility.service.js";
import type { CostTrackingController } from "./controllers/cost-tracking.controller.js";
import type { CollectionsController } from "./controllers/revenue.controller.js";
import type { CollectionsForecastController } from "./controllers/collections-forecast.controller.js";
import type { AuthService } from "./services/auth.service.js";
import type { AuditLogRepository } from "./repositories/audit-log.repository.js";
interface Services {
    projectService: ProjectService;
    feasibilityService: FeasibilityService;
    costTrackingController: CostTrackingController;
    collectionsController: CollectionsController;
    collectionsForecastController: CollectionsForecastController;
    authService: AuthService;
    auditLogRepo: AuditLogRepository;
}
export declare function createApp(services: Services): Express;
export {};
//# sourceMappingURL=app.d.ts.map