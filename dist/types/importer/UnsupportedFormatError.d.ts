import { AlphaTabError } from "@src/AlphaTabError";
/**
 * The exception thrown by a {@link ScoreImporter} in case the
 * binary data does not contain a reader compatible structure.
 */
export declare class UnsupportedFormatError extends AlphaTabError {
    inner: Error | null;
    constructor(message?: string, inner?: Error | null);
}
