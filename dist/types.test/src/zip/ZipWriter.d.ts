import { IWriteable } from '@src/io/IWriteable';
import { ZipEntry } from './ZipEntry';
export declare class ZipWriter {
    private _data;
    private _centralDirectoryHeaders;
    private _deflater;
    constructor(data: IWriteable);
    writeEntry(entry: ZipEntry): void;
    private compress;
    end(): void;
    private writeEndOfCentralDirectoryRecord;
    private writeCentralDirectoryHeader;
}
