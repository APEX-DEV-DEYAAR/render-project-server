import { Router } from "express";
import { healthRoutes } from "./health.routes.js";
import { authRoutes } from "./auth.routes.js";
import { projectRoutes } from "./project.routes.js";
import { feasibilityRoutes } from "./feasibility.routes.js";
import { costTrackingRoutes } from "./cost-tracking.routes.js";
import { collectionsRoutes } from "./revenue.routes.js";
import { collectionsForecastRoutes } from "./collections-forecast.routes.js";
import { authMiddleware, csrfGuard } from "../middleware/auth.js";
import { createAuditLog } from "../middleware/auditLog.js";
export function apiRoutes({ projectService, feasibilityService, costTrackingController, collectionsController, collectionsForecastController, authService, auditLogRepo, }) {
    const router = Router();
    // Public routes
    router.use(healthRoutes());
    router.use(authRoutes(authService));
    // Protected routes — require valid JWT + CSRF guard + audit logging
    router.use(csrfGuard);
    router.use(authMiddleware(authService));
    router.use(createAuditLog(auditLogRepo));
    router.use(projectRoutes(projectService));
    router.use(feasibilityRoutes(feasibilityService));
    router.use(costTrackingRoutes(costTrackingController));
    router.use(collectionsRoutes(collectionsController));
    router.use(collectionsForecastRoutes(collectionsForecastController));
    return router;
}
//# sourceMappingURL=index.js.map