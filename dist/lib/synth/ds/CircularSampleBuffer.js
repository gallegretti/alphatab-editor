/**
 * Represents a fixed size circular sample buffer that can be written to and read from.
 * @csharp_public
 */
export class CircularSampleBuffer {
    /**
     * Initializes a new instance of the {@link CircularSampleBuffer} class.
     * @param size The size.
     */
    constructor(size) {
        this._writePosition = 0;
        this._readPosition = 0;
        /**
         * Gets the number of samples written to the buffer.
         */
        this.count = 0;
        this._buffer = new Float32Array(size);
    }
    /**
     * Clears all samples written to this buffer.
     */
    clear() {
        this._readPosition = 0;
        this._writePosition = 0;
        this.count = 0;
        this._buffer = new Float32Array(this._buffer.length);
    }
    /**
     * Writes the given samples to this buffer.
     * @param data The sample array to read from.
     * @param offset
     * @param count
     * @returns
     */
    write(data, offset, count) {
        let samplesWritten = 0;
        if (count > this._buffer.length - this.count) {
            count = this._buffer.length - this.count;
        }
        const writeToEnd = Math.min(this._buffer.length - this._writePosition, count);
        this._buffer.set(data.subarray(offset, offset + writeToEnd), this._writePosition);
        this._writePosition += writeToEnd;
        this._writePosition %= this._buffer.length;
        samplesWritten += writeToEnd;
        if (samplesWritten < count) {
            this._buffer.set(data.subarray(offset + samplesWritten, offset + samplesWritten + count - samplesWritten), this._writePosition);
            this._writePosition += count - samplesWritten;
            samplesWritten = count;
        }
        this.count += samplesWritten;
        return samplesWritten;
    }
    /**
     * Reads the requested amount of samples from the buffer.
     * @param data The sample array to store the read elements.
     * @param offset The offset within the destination buffer to put the items at.
     * @param count The number of items to read from this buffer.
     * @returns The number of items actually read from the buffer.
     */
    read(data, offset, count) {
        if (count > this.count) {
            count = this.count;
        }
        let samplesRead = 0;
        const readToEnd = Math.min(this._buffer.length - this._readPosition, count);
        data.set(this._buffer.subarray(this._readPosition, this._readPosition + readToEnd), offset);
        samplesRead += readToEnd;
        this._readPosition += readToEnd;
        this._readPosition %= this._buffer.length;
        if (samplesRead < count) {
            data.set(this._buffer.subarray(this._readPosition, this._readPosition + count - samplesRead), offset + samplesRead);
            this._readPosition += count - samplesRead;
            samplesRead = count;
        }
        this.count -= samplesRead;
        return samplesRead;
    }
}
//# sourceMappingURL=CircularSampleBuffer.js.map