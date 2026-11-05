export class AIRichError extends Error {
    constructor(message: any, code?: string, meta?: {});
    code: string;
    unwrap(): unknown;
    toJSON(): {
        cause?: unknown;
        name: string;
        code: string;
        message: string;
    } & Omit<this, "name" | "message" | "cause" | "code" | "stack" | "unwrap" | "toJSON">;
}
export class ItemNotFoundError extends AIRichError {
    constructor(message: any, meta?: {});
}
export class DuplicateIdError extends AIRichError {
    constructor(message: any, meta?: {});
}
export class InvalidTargetError extends AIRichError {
    constructor(message: any, meta?: {});
}
export class ContentValidationError extends AIRichError {
    constructor(message: any, meta?: {});
}
