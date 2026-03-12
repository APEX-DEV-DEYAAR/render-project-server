import { NotFoundError, ValidationError } from "../errors/AppError.js";
export class ProjectService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async listProjects() {
        return this.repository.findAll();
    }
    async getById(id) {
        const project = await this.repository.findById(id);
        if (!project)
            throw new NotFoundError("Project not found");
        return project;
    }
    async create(name) {
        const trimmed = name.trim();
        if (!trimmed)
            throw new ValidationError("Project name is required");
        const existing = await this.repository.findByName(trimmed);
        if (existing)
            throw new ValidationError(`Project "${trimmed}" already exists`);
        return this.repository.create(trimmed);
    }
    async delete(id) {
        const deleted = await this.repository.delete(id);
        if (!deleted)
            throw new NotFoundError("Project not found");
    }
}
//# sourceMappingURL=project.service.js.map