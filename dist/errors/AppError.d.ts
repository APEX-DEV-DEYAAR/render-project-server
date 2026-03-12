export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational = true;
    constructor(message: string, statusCode?: number);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class ValidationError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=AppError.d.ts.map