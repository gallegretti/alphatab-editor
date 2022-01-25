import { IReadable } from '@src/io/IReadable';
import { AlphaTabError } from '@src/AlphaTabError';
export declare class EndOfReaderError extends AlphaTabError {
    constructor();
}
/**
 * This utility public class allows bitwise reading of a stream
 */
export declare class BitReader {
    private static readonly ByteSize;
    private _currentByte;
    private _position;
    private _source;
    constructor(source: IReadable);
    readByte(): number;
    readBytes(count: number): Uint8Array;
    readBits(count: number): number;
    readBitsReversed(count: number): number;
    readBit(): number;
    readAll(): Uint8Array;
}
