export class AppError extends Error {
    statusCode;
    isOperational = true;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}
export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}
export class ValidationError extends AppError {
    constructor(message = "Validation failed") {
        super(message, 400);
    }
}
//# sourceMappingURL=AppError.js.map