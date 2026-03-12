import { Router } from "express";
import { createHealthController } from "../controllers/health.controller.js";
export function healthRoutes() {
    const router = Router();
    const controller = createHealthController();
    router.get("/health", controller.check);
    return router;
}
//# sourceMappingURL=health.routes.js.map