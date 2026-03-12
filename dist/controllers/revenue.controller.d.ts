import type { Request, Response, NextFunction } from "express";
import { CollectionsService } from "../services/revenue.service.js";
export declare class CollectionsController {
    private readonly service;
    constructor(service: CollectionsService);
    getMonthlyCollections: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    saveMonthlyCollections: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    bulkSaveMonthlyCollections: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteMonthlyCollections: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    clearProjectCollections: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=revenue.controller.d.ts.map