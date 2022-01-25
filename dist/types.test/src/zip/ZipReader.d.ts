import { IReadable } from '@src/io/IReadable';
import { ZipEntry } from './ZipEntry';
export declare class ZipReader {
    private _readable;
    constructor(readable: IReadable);
    read(): ZipEntry[];
    private readEntry;
}
