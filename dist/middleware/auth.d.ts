import type { Request, Response, NextFunction } from "express";
import type { AuthService } from "../services/auth.service.js";
import type { AuthPayload, UserRole } from "../types/index.js";
declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}
/**
 * Middleware that verifies the JWT from cookie or Authorization header.
 * Attaches `req.user` on success, returns 401 otherwise.
 */
export declare function authMiddleware(authService: AuthService): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware that checks if the authenticated user has one of the allowed roles.
 */
export declare function requireRole(...roles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
/**
 * CSRF guard: require X-Requested-With header on state-changing requests.
 * Blocks cross-origin form submissions that cannot set custom headers.
 */
export declare function csrfGuard(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map