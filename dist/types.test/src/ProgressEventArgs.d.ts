/**
 * Represents the progress of any data being loaded.
 */
export declare class ProgressEventArgs {
    /**
     * Gets the currently loaded bytes.
     */
    readonly loaded: number;
    /**
     * Gets the total number of bytes to load.
     */
    readonly total: number;
    /**
     * Initializes a new instance of the {@link ProgressEventArgs} class.
     * @param loaded
     * @param total
     */
    constructor(loaded: number, total: number);
}
