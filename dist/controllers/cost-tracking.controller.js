import { AppError, ValidationError } from "../errors/AppError.js";
function parseIntParam(value, name) {
    const num = parseInt(value, 10);
    if (isNaN(num))
        throw new ValidationError(`Invalid ${name}`);
    return num;
}
function validateMonth(month) {
    if (month < 1 || month > 12)
        throw new ValidationError("Month must be between 1 and 12");
}
function validateYear(year) {
    if (year < 2000 || year > 2100)
        throw new ValidationError("Year must be between 2000 and 2100");
}
function toNumberOrNull(value) {
    if (value == null)
        return null;
    const num = Number(value);
    if (!Number.isFinite(num))
        return null;
    return num;
}
function validateAndNormalizeCostPayload(payload) {
    const projectId = Number(payload.projectId);
    const categoryId = Number(payload.categoryId);
    const year = Number(payload.year);
    const month = Number(payload.month);
    if (!Number.isInteger(projectId) || projectId <= 0)
        throw new ValidationError("Valid projectId is required");
    if (!Number.isInteger(categoryId) || categoryId <= 0)
        throw new ValidationError("Valid categoryId is required");
    if (!Number.isInteger(year))
        throw new ValidationError("Year is required");
    if (!Number.isInteger(month))
        throw new ValidationError("Month is required");
    validateYear(year);
    validateMonth(month);
    const actualAmount = toNumberOrNull(payload.actualAmount);
    const projectedAmount = toNumberOrNull(payload.projectedAmount);
    const budgetAmount = toNumberOrNull(payload.budgetAmount);
    return {
        ...payload,
        projectId,
        categoryId,
        year,
        month,
        actualAmount,
        projectedAmount,
        budgetAmount,
    };
}
const MAX_BULK_SIZE = 500;
export class CostTrackingController {
    service;
    constructor(service) {
        this.service = service;
    }
    // ---- Categories ----
    getCategories = async (req, res, next) => {
        try {
            const team = req.query.team;
            const categories = await this.service.getCategories(team);
            res.json(categories);
        }
        catch (error) {
            next(error);
        }
    };
    // ---- Monthly Costs ----
    getMonthlyCosts = async (req, res, next) => {
        try {
            const projectId = parseIntParam(req.params.projectId, "project ID");
            const rawYear = req.query.year;
            const team = req.query.team;
            let year;
            if (rawYear) {
                year = parseIntParam(rawYear, "year");
                validateYear(year);
            }
            const costs = await this.service.getMonthlyCosts(projectId, year, team);
            res.json(costs);
        }
        catch (error) {
            next(error);
        }
    };
    getMonthlyCostsForAllProjects = async (req, res, next) => {
        try {
            const year = parseInt(req.query.year, 10) || new Date().getFullYear();
            validateYear(year);
            const costs = await this.service.getMonthlyCostsForAllProjects(year);
            res.json(costs);
        }
        catch (error) {
            next(error);
        }
    };
    saveMonthlyCost = async (req, res, next) => {
        try {
            const normalized = validateAndNormalizeCostPayload(req.body);
            const cost = await this.service.saveMonthlyCost(normalized);
            res.status(201).json(cost);
        }
        catch (error) {
            next(error);
        }
    };
    bulkSaveMonthlyCosts = async (req, res, next) => {
        try {
            const { costs } = req.body;
            if (!Array.isArray(costs) || costs.length === 0) {
                throw new ValidationError("Costs array is required and must not be empty");
            }
            if (costs.length > MAX_BULK_SIZE) {
                throw new ValidationError(`Bulk save limited to ${MAX_BULK_SIZE} items`);
            }
            const normalized = costs.map(validateAndNormalizeCostPayload);
            const saved = await this.service.bulkSaveMonthlyCosts(normalized);
            res.status(201).json(saved);
        }
        catch (error) {
            next(error);
        }
    };
    deleteMonthlyCost = async (req, res, next) => {
        try {
            const projectId = parseIntParam(req.params.projectId, "project ID");
            const categoryId = parseIntParam(req.params.categoryId, "category ID");
            const year = parseIntParam(req.params.year, "year");
            const month = parseIntParam(req.params.month, "month");
            validateYear(year);
            validateMonth(month);
            const deleted = await this.service.deleteMonthlyCost(projectId, categoryId, year, month);
            if (!deleted) {
                throw new AppError("Cost entry not found", 404);
            }
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
    // ---- Summaries ----
    getCostSummary = async (req, res, next) => {
        try {
            const projectId = parseIntParam(req.params.projectId, "project ID");
            const rawYear = req.query.year;
            let year;
            if (rawYear) {
                year = parseIntParam(rawYear, "year");
                validateYear(year);
            }
            const summary = await this.service.getCostSummary(projectId, year);
            res.json(summary);
        }
        catch (error) {
            next(error);
        }
    };
    getAnnualSummary = async (req, res, next) => {
        try {
            const projectId = parseIntParam(req.params.projectId, "project ID");
            const rawYear = req.query.year;
            let year;
            if (rawYear) {
                year = parseIntParam(rawYear, "year");
                validateYear(year);
            }
            const summary = await this.service.getAnnualSummary(projectId, year);
            res.json(summary);
        }
        catch (error) {
            next(error);
        }
    };
    // ---- Initialization ----
    initializeYear = async (req, res, next) => {
        try {
            const projectId = parseIntParam(req.params.projectId, "project ID");
            const year = parseInt(req.body.year, 10) || new Date().getFullYear();
            validateYear(year);
            const defaultAmount = parseFloat(req.body.defaultProjectedAmount) || 0;
            const createdBy = req.body.createdBy;
            const team = req.body.team;
            const costs = await this.service.initializeYear(projectId, year, defaultAmount, createdBy, team);
            res.status(201).json(costs);
        }
        catch (error) {
            next(error);
        }
    };
    copyFromPreviousYear = async (req, res, next) => {
        try {
            const projectId = parseIntParam(req.params.projectId, "project ID");
            const sourceYear = parseIntParam(String(req.body.sourceYear), "source year");
            const targetYear = parseIntParam(String(req.body.targetYear), "target year");
            validateYear(sourceYear);
            validateYear(targetYear);
            const createdBy = req.body.createdBy;
            const costs = await this.service.copyFromPreviousYear(projectId, sourceYear, targetYear, createdBy);
            res.status(201).json(costs);
        }
        catch (error) {
            next(error);
        }
    };
    // ---- Clear Project Data ----
    clearProjectData = async (req, res, next) => {
        try {
            const projectId = parseIntParam(req.params.projectId, "project ID");
            const team = req.query.team;
            const deletedCount = await this.service.clearProjectData(projectId, team);
            const label = team === "collections" ? "collections" : team ? `${team} cost` : "project";
            res.json({ message: `Deleted ${deletedCount} ${label} records for project ${projectId}`, deletedCount });
        }
        catch (error) {
            next(error);
        }
    };
    // ---- Budget vs Actuals ----
    getBudgetVsActuals = async (req, res, next) => {
        try {
            const projectId = parseIntParam(req.params.projectId, "project ID");
            const year = parseIntParam(req.query.year || String(new Date().getFullYear()), "year");
            validateYear(year);
            const data = await this.service.getBudgetVsActuals(projectId, year);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=cost-tracking.controller.js.map