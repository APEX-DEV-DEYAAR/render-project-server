import type { UserRepository } from "../repositories/user.repository.js";
import type { AuthPayload, UserRole } from "../types/index.js";
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtSecret;
    constructor(userRepo: UserRepository, jwtSecret: string);
    login(username: string, password: string): Promise<{
        token: string;
        user: AuthPayload;
    }>;
    verifyToken(token: string): AuthPayload;
    /** Seed a default admin user if the users table is empty. */
    seedDefaultUser(): Promise<void>;
    listUsers(): Promise<Omit<import("../types/index.js").AppUser, "passwordHash">[]>;
    private validatePassword;
    changePassword(userId: number, newPassword: string): Promise<void>;
    register(username: string, password: string, role: UserRole): Promise<AuthPayload>;
}
//# sourceMappingURL=auth.service.d.ts.map