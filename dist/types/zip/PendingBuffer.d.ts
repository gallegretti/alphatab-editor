/**
 * This class is general purpose class for writing data to a buffer.
 * It allows you to write bits as well as bytes
 * Based on DeflaterPending.java
 */
export declare class PendingBuffer {
    private _buffer;
    private _start;
    private _end;
    private _bits;
    /**
     * The number of bits written to the buffer
     */
    bitCount: number;
    /**
     * Indicates if buffer has been flushed
     */
    get isFlushed(): boolean;
    /**
     * construct instance using specified buffer size
     * @param bufferSize size to use for internal buffer
     */
    constructor(bufferSize: number);
    /**
     * Clear internal state/buffers
     */
    reset(): void;
    /**
     * Write a short value to internal buffer most significant byte first
     * @param s value to write
     */
    writeShortMSB(s: number): void;
    /**
     * Write a short value to buffer LSB first
     * @param value The value to write.
     */
    writeShort(value: number): void;
    /**
     * Write a block of data to buffer
     * @param block data to write
     * @param offset offset of first byte to write
     * @param length number of bytes to write
     */
    writeBlock(block: Uint8Array, offset: number, length: number): void;
    /**
     * Flushes the pending buffer into the given output array.  If the
     * output array is to small, only a partial flush is done.
     * @param output The output array.
     * @param offset The offset into output array.
     * @param length The maximum number of bytes to store.
     * @returns The number of bytes flushed.
     */
    flush(output: Uint8Array, offset: number, length: number): number;
    /**
     * Write bits to internal buffer
     * @param b source of bits
     * @param count number of bits to write
     */
    writeBits(b: number, count: number): void;
    /**
     * Align internal buffer on a byte boundary
     */
    alignToByte(): void;
}
