export interface ValidationIssue {
    path: string;
    message: string;
}
export declare class ProtocolError extends Error {
    constructor(message: string, options?: {
        cause?: unknown;
    });
}
export declare class AtSyntaxError extends ProtocolError {
    readonly format: string;
    constructor(message: string, format: string);
}
export declare class ValidationError extends ProtocolError {
    readonly issues: readonly ValidationIssue[];
    constructor(issues: readonly ValidationIssue[]);
}
export declare class XrpcError extends Error {
    readonly status: number;
    readonly data: unknown;
    constructor(message: string, status: number, data: unknown);
    get errorCode(): string | undefined;
    get retryable(): boolean;
}
export declare function isXrpcError(error: unknown): error is XrpcError;
export declare function isMissingRecord(error: unknown): boolean;
