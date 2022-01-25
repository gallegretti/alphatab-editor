/**
 * Computes Adler32 checksum for a stream of data. An Adler32
 * checksum is not as reliable as a CRC32 checksum, but a lot faster to
 * compute.
 *
 * The specification for Adler32 may be found in RFC 1950.
 * ZLIB Compressed Data Format Specification version 3.3)
 */
export declare class Adler32 {
    /**
     * largest prime smaller than 65536
     */
    private static readonly Base;
    /**
     * Returns the Adler32 data checksum computed so far.
     */
    value: number;
    /**
     * Initialise a default instance of Adler32
     */
    constructor();
    /**
     * Resets the Adler32 data checksum as if no update was ever called.
     */
    reset(): void;
    /**
     * Update Adler32 data checksum based on a portion of a block of data
     * @param data The array containing the data to add
     * @param offset Range start for data (inclusive)
     * @param count The number of bytes to checksum starting from offset
     */
    update(data: Uint8Array, offset: number, count: number): void;
}
