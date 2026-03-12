export function createFeasibilityController(service) {
    return {
        async getPortfolio(_req, res, next) {
            try {
                const data = await service.getPortfolio();
                res.json(data);
            }
            catch (err) {
                next(err);
            }
        },
        async getLatest(req, res, next) {
            try {
                const data = await service.getLatest(Number(req.params.id));
                res.json(data);
            }
            catch (err) {
                next(err);
            }
        },
        async saveDraft(req, res, next) {
            try {
                const data = await service.saveDraft(Number(req.params.id), req.body);
                res.status(200).json(data);
            }
            catch (err) {
                next(err);
            }
        },
        async freeze(req, res, next) {
            try {
                const data = await service.freeze(Number(req.params.id));
                res.json(data);
            }
            catch (err) {
                next(err);
            }
        },
        async editFrozen(req, res, next) {
            try {
                const data = await service.editFrozen(Number(req.params.id));
                res.json(data);
            }
            catch (err) {
                next(err);
            }
        },
        async getArchive(req, res, next) {
            try {
                const data = await service.getArchive(Number(req.params.id));
                res.json(data);
            }
            catch (err) {
                next(err);
            }
        },
    };
}
//# sourceMappingURL=feasibility.controller.js.map