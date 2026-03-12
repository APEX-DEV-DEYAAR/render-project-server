export function createProjectController(service) {
    return {
        async list(_req, res, next) {
            try {
                const projects = await service.listProjects();
                res.json(projects);
            }
            catch (err) {
                next(err);
            }
        },
        async getById(req, res, next) {
            try {
                const project = await service.getById(Number(req.params.id));
                res.json(project);
            }
            catch (err) {
                next(err);
            }
        },
        async create(req, res, next) {
            try {
                const project = await service.create(req.body.name);
                res.status(201).json(project);
            }
            catch (err) {
                next(err);
            }
        },
        async remove(req, res, next) {
            try {
                await service.delete(Number(req.params.id));
                res.status(204).end();
            }
            catch (err) {
                next(err);
            }
        },
    };
}
//# sourceMappingURL=project.controller.js.map