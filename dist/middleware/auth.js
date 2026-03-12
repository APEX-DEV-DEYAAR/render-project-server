/**
 * Middleware that verifies the JWT from cookie or Authorization header.
 * Attaches `req.user` on success, returns 401 otherwise.
 */
export function authMiddleware(authService) {
    return (req, res, next) => {
        // Try httpOnly cookie first, fall back to Authorization header
        const cookieToken = req.cookies?.token;
        const header = req.headers.authorization;
        const token = cookieToken || (header?.startsWith("Bearer ") ? header.slice(7) : null);
        if (!token) {
            res.status(401).json({ message: "Missing authentication" });
            return;
        }
        try {
            req.user = authService.verifyToken(token);
            next();
        }
        catch {
            res.status(401).json({ message: "Invalid or expired token" });
        }
    };
}
/**
 * Middleware that checks if the authenticated user has one of the allowed roles.
 */
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: "Insufficient permissions" });
            return;
        }
        next();
    };
}
/**
 * CSRF guard: require X-Requested-With header on state-changing requests.
 * Blocks cross-origin form submissions that cannot set custom headers.
 */
export function csrfGuard(req, res, next) {
    if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
        if (req.headers["x-requested-with"] !== "XMLHttpRequest") {
            res.status(403).json({ message: "Missing CSRF header" });
            return;
        }
    }
    next();
}
//# sourceMappingURL=auth.js.map