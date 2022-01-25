export declare enum AlphaTabErrorType {
    General = 0,
    Format = 1,
    AlphaTex = 2
}
export declare class AlphaTabError extends Error {
    inner: Error | null;
    type: AlphaTabErrorType;
    constructor(type: AlphaTabErrorType, message?: string, inner?: Error);
}
