import { ByteBuffer } from '@src/io/ByteBuffer';
import { AlphaTabError, AlphaTabErrorType } from '@src/AlphaTabError';
export class EndOfReaderError extends AlphaTabError {
    constructor() {
        super(AlphaTabErrorType.Format, 'Unexpected end of data within reader');
        Object.setPrototypeOf(this, EndOfReaderError.prototype);
    }
}
/**
 * This utility public class allows bitwise reading of a stream
 */
export class BitReader {
    constructor(source) {
        this._currentByte = 0;
        this._position = BitReader.ByteSize;
        this._source = source;
    }
    readByte() {
        return this.readBits(8);
    }
    readBytes(count) {
        const bytes = new Uint8Array(count);
        for (let i = 0; i < count; i++) {
            bytes[i] = this.readByte() & 0xff;
        }
        return bytes;
    }
    readBits(count) {
        let bits = 0;
        let i = count - 1;
        while (i >= 0) {
            bits = bits | (this.readBit() << i);
            i--;
        }
        return bits;
    }
    readBitsReversed(count) {
        let bits = 0;
        for (let i = 0; i < count; i++) {
            bits = bits | (this.readBit() << i);
        }
        return bits;
    }
    readBit() {
        // need a new byte?
        if (this._position >= 8) {
            this._currentByte = this._source.readByte();
            if (this._currentByte === -1) {
                throw new EndOfReaderError();
            }
            this._position = 0;
        }
        // shift the desired byte to the least significant bit and
        // get the value using masking
        const value = (this._currentByte >> (BitReader.ByteSize - this._position - 1)) & 0x01;
        this._position++;
        return value;
    }
    readAll() {
        let all = ByteBuffer.empty();
        try {
            while (true) {
                all.writeByte(this.readByte() & 0xff);
            }
        }
        catch (e) {
            if (!(e instanceof EndOfReaderError)) {
                throw e;
            }
        }
        return all.toArray();
    }
}
BitReader.ByteSize = 8;
//# sourceMappingURL=BitReader.js.map