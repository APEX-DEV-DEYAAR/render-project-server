import type { NextFunction, Request, Response } from "express";
import { CollectionsForecastService } from "../services/collections-forecast.service.js";
export declare class CollectionsForecastController {
    private readonly service;
    constructor(service: CollectionsForecastService);
    getInstallments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    bulkSaveInstallments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    bulkSaveCompletionLookups: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    bulkSaveAgingLookups: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDashboard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPortfolioDashboard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=collections-forecast.controller.d.ts.map