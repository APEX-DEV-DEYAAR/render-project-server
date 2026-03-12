import { Router } from "express";
export function collectionsForecastRoutes(controller) {
    const router = Router();
    router.get("/collections-forecast/portfolio-dashboard", controller.getPortfolioDashboard);
    router.post("/collections-forecast/lookups/completion/bulk", controller.bulkSaveCompletionLookups);
    router.post("/collections-forecast/lookups/aging/bulk", controller.bulkSaveAgingLookups);
    router.get("/projects/:projectId/collections-forecast/installments", controller.getInstallments);
    router.post("/collections-forecast/installments/bulk", controller.bulkSaveInstallments);
    router.get("/projects/:projectId/collections-forecast/dashboard", controller.getDashboard);
    return router;
}
//# sourceMappingURL=collections-forecast.routes.js.map