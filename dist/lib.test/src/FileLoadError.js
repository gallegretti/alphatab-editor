import { AlphaTabError, AlphaTabErrorType } from "./AlphaTabError";
/**
 * @target web
 */
export class FileLoadError extends AlphaTabError {
    constructor(message, xhr) {
        super(AlphaTabErrorType.General, message);
        this.xhr = xhr;
        Object.setPrototypeOf(this, FileLoadError.prototype);
    }
}
//# sourceMappingURL=FileLoadError.js.map