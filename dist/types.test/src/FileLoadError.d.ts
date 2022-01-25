import { AlphaTabError } from "./AlphaTabError";
/**
 * @target web
 */
export declare class FileLoadError extends AlphaTabError {
    xhr: XMLHttpRequest;
    constructor(message: string, xhr: XMLHttpRequest);
}
