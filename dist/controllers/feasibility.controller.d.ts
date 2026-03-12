import type { Request, Response, NextFunction } from "express";
import type { FeasibilityService } from "../services/feasibility.service.js";
export declare function createFeasibilityController(service: FeasibilityService): {
    getPortfolio(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getLatest(req: Request, res: Response, next: NextFunction): Promise<void>;
    saveDraft(req: Request, res: Response, next: NextFunction): Promise<void>;
    freeze(req: Request, res: Response, next: NextFunction): Promise<void>;
    editFrozen(req: Request, res: Response, next: NextFunction): Promise<void>;
    getArchive(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=feasibility.controller.d.ts.map