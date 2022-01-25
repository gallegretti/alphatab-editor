import { AlphaTabError } from "@src/AlphaTabError";
/**
 * An invalid input format was detected (e.g. invalid setting values, file formats,...)
 */
export declare class FormatError extends AlphaTabError {
    constructor(message: string);
}
