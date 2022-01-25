/**
 * CRC-32 with reversed data and unreversed output
 */
export declare class Crc32 {
    private static readonly Crc32Lookup;
    private static buildCrc32Lookup;
    private static readonly CrcInit;
    /**
     * The CRC data checksum so far.
     */
    private _checkValue;
    /**
     * Returns the CRC data checksum computed so far.
     */
    get value(): number;
    /**
     * Initialise a default instance of Crc32.
     */
    constructor();
    /**
     * Update CRC data checksum based on a portion of a block of data
     * @param data The array containing the data to add
     * @param offset Range start for data (inclusive)
     * @param count The number of bytes to checksum starting from offset
     */
    update(data: Uint8Array, offset: number, count: number): void;
    /**
     * Resets the CRC data checksum as if no update was ever called.
     */
    reset(): void;
}
