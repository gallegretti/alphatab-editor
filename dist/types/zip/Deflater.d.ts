/**
 * This is the Deflater class.  The deflater class compresses input
 * with the deflate algorithm described in RFC 1951.  It has several
 * compression levels and three different strategies described below.
 *
 * This class is <i>not</i> thread safe.  This is inherent in the API, due
 * to the split of deflate and setInput.
 *
 * author of the original java version : Jochen Hoenicke
 */
export declare class Deflater {
    private static readonly IsFlushing;
    private static readonly IsFinishing;
    private static readonly BusyState;
    private static readonly FlushingState;
    private static readonly FinishingState;
    private static readonly FinishedState;
    private _state;
    private _pending;
    private _engine;
    get inputCrc(): number;
    /**
     * Creates a new deflater with given compression level
     * @param level the compression level, a value between NO_COMPRESSION and BEST_COMPRESSION.
     * beginning and the adler checksum at the end of the output.  This is
     * useful for the GZIP/PKZIP formats.
     */
    constructor();
    /**
     * Returns true, if the input buffer is empty.
     * You should then call setInput().
     * NOTE: This method can also return true when the stream
     * was finished.
     */
    get isNeedingInput(): boolean;
    /**
     * Returns true if the stream was finished and no more output bytes
     * are available.
     */
    get isFinished(): boolean;
    /**
     * Resets the deflater. The deflater acts afterwards as if it was
     * just created with the same compression level and strategy as it
     * had before.
     */
    reset(): void;
    /**
     * Sets the data which should be compressed next.  This should be
     * only called when needsInput indicates that more input is needed.
     * The given byte array should not be changed, before needsInput() returns
     * true again.
     * @param input the buffer containing the input data.
     * @param offset the start of the data.
     * @param count the number of data bytes of input.
     */
    setInput(input: Uint8Array, offset: number, count: number): void;
    /**
     * Deflates the current input block to the given array.
     * @param output Buffer to store the compressed data.
     * @param offset Offset into the output array.
     * @param length The maximum number of bytes that may be stored.
     * @returns The number of compressed bytes added to the output, or 0 if either
     * needsInput() or finished() returns true or length is zero.
     */
    deflate(output: Uint8Array, offset: number, length: number): number;
    /**
     * Finishes the deflater with the current input block.  It is an error
     * to give more input after this method was called.  This method must
     * be called to force all bytes to be flushed.
     */
    finish(): void;
}
