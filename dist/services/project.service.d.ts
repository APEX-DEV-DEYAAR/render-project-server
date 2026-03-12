import type { ProjectRepository } from "../repositories/project.repository.js";
import type { Project, ProjectSummary } from "../types/index.js";
export declare class ProjectService {
    private readonly repository;
    constructor(repository: ProjectRepository);
    listProjects(): Promise<ProjectSummary[]>;
    getById(id: number): Promise<Project>;
    create(name: string): Promise<Project>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=project.service.d.ts.map