import { AlphaTabError, AlphaTabErrorType } from "@src/AlphaTabError";
/**
 * An invalid input format was detected (e.g. invalid setting values, file formats,...)
 */
export class FormatError extends AlphaTabError {
    constructor(message) {
        super(AlphaTabErrorType.Format, message);
        Object.setPrototypeOf(this, FormatError.prototype);
    }
}
//# sourceMappingURL=FormatError.js.map