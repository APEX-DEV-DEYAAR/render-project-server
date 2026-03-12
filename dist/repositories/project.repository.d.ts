import type { BaseAdapter } from "../db/adapters/base.adapter.js";
import type { Project, ProjectSummary } from "../types/index.js";
export declare class ProjectRepository {
    private readonly db;
    constructor(db: BaseAdapter);
    findAll(): Promise<ProjectSummary[]>;
    findById(id: number): Promise<Project | null>;
    findByName(name: string): Promise<Project | null>;
    create(name: string): Promise<Project>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=project.repository.d.ts.map