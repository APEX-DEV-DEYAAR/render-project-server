import { Router } from "express";
export function collectionsRoutes(controller) {
    const router = Router();
    router.get("/projects/:projectId/collections", controller.getMonthlyCollections);
    router.post("/collections", controller.saveMonthlyCollections);
    router.post("/collections/bulk", controller.bulkSaveMonthlyCollections);
    router.delete("/projects/:projectId/collections/:year/:month", controller.deleteMonthlyCollections);
    router.delete("/projects/:projectId/collections/clear", controller.clearProjectCollections);
    return router;
}
//# sourceMappingURL=revenue.routes.js.map