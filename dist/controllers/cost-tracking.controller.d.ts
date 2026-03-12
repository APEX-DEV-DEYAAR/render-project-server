import type { Request, Response, NextFunction } from "express";
import { CostTrackingService } from "../services/cost-tracking.service.js";
export declare class CostTrackingController {
    private readonly service;
    constructor(service: CostTrackingService);
    getCategories: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMonthlyCosts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMonthlyCostsForAllProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    saveMonthlyCost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    bulkSaveMonthlyCosts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteMonthlyCost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCostSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAnnualSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    initializeYear: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    copyFromPreviousYear: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    clearProjectData: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBudgetVsActuals: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=cost-tracking.controller.d.ts.map