import { Router } from "express";
import { createProjectController } from "../controllers/project.controller.js";
export function projectRoutes(service) {
    const router = Router();
    const controller = createProjectController(service);
    router.get("/projects", controller.list);
    router.get("/projects/:id", controller.getById);
    router.post("/projects", controller.create);
    router.delete("/projects/:id", controller.remove);
    return router;
}
//# sourceMappingURL=project.routes.js.map