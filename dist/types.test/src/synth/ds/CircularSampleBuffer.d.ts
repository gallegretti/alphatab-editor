/**
 * Represents a fixed size circular sample buffer that can be written to and read from.
 * @csharp_public
 */
export declare class CircularSampleBuffer {
    private _buffer;
    private _writePosition;
    private _readPosition;
    /**
     * Gets the number of samples written to the buffer.
     */
    count: number;
    /**
     * Initializes a new instance of the {@link CircularSampleBuffer} class.
     * @param size The size.
     */
    constructor(size: number);
    /**
     * Clears all samples written to this buffer.
     */
    clear(): void;
    /**
     * Writes the given samples to this buffer.
     * @param data The sample array to read from.
     * @param offset
     * @param count
     * @returns
     */
    write(data: Float32Array, offset: number, count: number): number;
    /**
     * Reads the requested amount of samples from the buffer.
     * @param data The sample array to store the read elements.
     * @param offset The offset within the destination buffer to put the items at.
     * @param count The number of items to read from this buffer.
     * @returns The number of items actually read from the buffer.
     */
    read(data: Float32Array, offset: number, count: number): number;
}
