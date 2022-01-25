import { Crc32 } from "./Crc32";
import { PendingBuffer } from "./PendingBuffer";
/**
 * Low level compression engine for deflate algorithm which uses a 32K sliding window
 * with secondary compression from Huffman/Shannon-Fano codes.
 */
export declare class DeflaterEngine {
    private static readonly TooFar;
    private blockStart;
    private maxChain;
    private niceLength;
    private goodLength;
    /**
     * Hash index of string to be inserted
     */
    private insertHashIndex;
    /**
     * Points to the current character in the window.
     */
    private strstart;
    /**
     * This array contains the part of the uncompressed stream that
     * is of relevance.  The current character is indexed by strstart.
     */
    private window;
    /**
     * Hashtable, hashing three characters to an index for window, so
     * that window[index]..window[index+2] have this hash code.
     * Note that the array should really be unsigned short, so you need
     * to and the values with 0xffff.
     */
    private head;
    /**
     * <code>prev[index &amp; WMASK]</code> points to the previous index that has the
     * same hash code as the string starting at index.  This way
     * entries with the same hash code are in a linked list.
     * Note that the array should really be unsigned short, so you need
     * to and the values with 0xffff.
     */
    private prev;
    /**
     * lookahead is the number of characters starting at strstart in
     * window that are valid.
     * So window[strstart] until window[strstart+lookahead-1] are valid
     * characters.
     */
    private lookahead;
    /**
     * The input data for compression.
     */
    private inputBuf;
    /**
     * The offset into inputBuf, where input data starts.
     */
    private inputOff;
    /**
     * The end offset of the input data.
     */
    private inputEnd;
    /**
     * Set if previous match exists
     */
    private prevAvailable;
    private matchStart;
    /**
     * Length of best match
     */
    private matchLen;
    private pending;
    private huffman;
    inputCrc: Crc32;
    /**
     * Construct instance with pending buffer
     * @param pending Pending buffer to use
     * @param noAdlerCalculation Pending buffer to use
     */
    constructor(pending: PendingBuffer);
    /**
     * Reset internal state
     */
    reset(): void;
    private updateHash;
    /**
     * Determines if more input is needed.
     * @returns Return true if input is needed via setInput
     */
    needsInput(): boolean;
    /**
     * Sets input data to be deflated.  Should only be called when <code>NeedsInput()</code>
     * returns true
     * @param buffer The buffer containing input data.
     * @param offset The offset of the first byte of data.
     * @param count The number of bytes of data to use as input.
     */
    setInput(buffer: Uint8Array, offset: number, count: number): void;
    /**
     * Deflate drives actual compression of data
     * @param flush True to flush input buffers
     * @param finish Finish deflation with the current input.
     * @returns Returns true if progress has been made.
     */
    deflate(flush: boolean, finish: boolean): boolean;
    private deflateSlow;
    /**
     * Find the best (longest) string in the window matching the
     * string starting at strstart.
     * @param curMatch
     * @returns True if a match greater than the minimum length is found
     */
    private findLongestMatch;
    /**
     * Inserts the current string in the head hash and returns the previous
     * value for this hash.
     * @returns The previous hash value
     */
    private insertString;
    /**
     * Fill the window
     */
    fillWindow(): void;
    private slideWindow;
}
