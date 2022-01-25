import { IReadable } from '@src/io/IReadable';
import { IWriteable } from '@src/io/IWriteable';
export declare class ByteBuffer implements IWriteable, IReadable {
    private _buffer;
    private _capacity;
    length: number;
    position: number;
    get bytesWritten(): number;
    getBuffer(): Uint8Array;
    static empty(): ByteBuffer;
    static withCapacity(capacity: number): ByteBuffer;
    static fromBuffer(data: Uint8Array): ByteBuffer;
    static fromString(contents: string): ByteBuffer;
    reset(): void;
    skip(offset: number): void;
    private setCapacity;
    readByte(): number;
    read(buffer: Uint8Array, offset: number, count: number): number;
    writeByte(value: number): void;
    write(buffer: Uint8Array, offset: number, count: number): void;
    private ensureCapacity;
    readAll(): Uint8Array;
    toArray(): Uint8Array;
}
