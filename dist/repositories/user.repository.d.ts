import type { BaseAdapter } from "../db/adapters/base.adapter.js";
import type { AppUser } from "../types/index.js";
export declare class UserRepository {
    private readonly db;
    constructor(db: BaseAdapter);
    findByUsername(username: string): Promise<AppUser | null>;
    findById(id: number): Promise<AppUser | null>;
    create(username: string, passwordHash: string, role: string): Promise<AppUser>;
    listAll(): Promise<Omit<AppUser, "passwordHash">[]>;
    updatePassword(id: number, passwordHash: string): Promise<void>;
    count(): Promise<number>;
}
//# sourceMappingURL=user.repository.d.ts.map