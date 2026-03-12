import type { Request, Response, NextFunction } from "express";
import type { ProjectService } from "../services/project.service.js";
export declare function createProjectController(service: ProjectService): {
    list(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    remove(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=project.controller.d.ts.map