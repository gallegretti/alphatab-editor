/**
 * CRC-32 with reversed data and unreversed output
 */
export class Crc32 {
    /**
     * Initialise a default instance of Crc32.
     */
    constructor() {
        /**
         * The CRC data checksum so far.
         */
        this._checkValue = Crc32.CrcInit;
        this.reset();
    }
    static buildCrc32Lookup() {
        const poly = 0xedb88320;
        const lookup = new Uint32Array(256);
        for (let i = 0; i < lookup.length; i++) {
            let crc = i;
            for (let bit = 0; bit < 8; bit++) {
                crc = (crc & 1) === 1 ? (crc >>> 1) ^ poly : crc >>> 1;
            }
            lookup[i] = crc;
        }
        return lookup;
    }
    /**
     * Returns the CRC data checksum computed so far.
     */
    get value() {
        return ~this._checkValue;
    }
    /**
     * Update CRC data checksum based on a portion of a block of data
     * @param data The array containing the data to add
     * @param offset Range start for data (inclusive)
     * @param count The number of bytes to checksum starting from offset
     */
    update(data, offset, count) {
        for (let i = 0; i < count; i++) {
            this._checkValue = Crc32.Crc32Lookup[(this._checkValue ^ data[offset + i]) & 0xff] ^ (this._checkValue >>> 8);
        }
    }
    /**
     * Resets the CRC data checksum as if no update was ever called.
     */
    reset() {
        this._checkValue = Crc32.CrcInit;
    }
}
Crc32.Crc32Lookup = Crc32.buildCrc32Lookup();
Crc32.CrcInit = 0xFFFFFFFF;
//# sourceMappingURL=Crc32.js.map