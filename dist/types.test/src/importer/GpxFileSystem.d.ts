import { BitReader } from '@src/io/BitReader';
import { IReadable } from '@src/io/IReadable';
/**
 * this public class represents a file within the GpxFileSystem
 */
export declare class GpxFile {
    fileName: string;
    fileSize: number;
    data: Uint8Array | null;
}
/**
 * This public class represents the file system structure
 * stored within a GPX container file.
 */
export declare class GpxFileSystem {
    static readonly HeaderBcFs: string;
    static readonly HeaderBcFz: string;
    static readonly ScoreGpif: string;
    static readonly BinaryStylesheet: string;
    static readonly PartConfiguration: string;
    /**
     * You can set a file filter method using this setter. On parsing
     * the filestructure this function can determine based on the filename
     * whether this file will be available after loading.
     * This way we can reduce the amount of memory we store.
     */
    fileFilter: (fileName: string) => boolean;
    /**
     * Gets the list of files stored in this FileSystem.
     */
    files: GpxFile[];
    /**
     * Creates a new GpxFileSystem instance
     */
    constructor();
    /**
     * Load a complete FileSystem to the memory.
     * @param s the binary source to read from.
     * @returns
     */
    load(s: IReadable): void;
    /**
     * Reads the 4 byte header as a string.
     * @param src the BitInput to read from
     * @returns a string with 4 characters representing the header.
     */
    readHeader(src: BitReader): string;
    /**
     * Decompresses the given bitinput using the GPX compression format. Only use this method
     * if you are sure the binary data is compressed using the GPX format. Otherwise unexpected
     * behavior can occure.
     * @param src the bitInput to read the data from
     * @param skipHeader true if the header should NOT be included in the result byteset, otherwise false
     * @returns the decompressed byte data. if skipHeader is set to false the BCFS header is included.
     */
    decompress(src: BitReader, skipHeader?: boolean): Uint8Array;
    /**
     * Reads a block from the given data source.
     * @param data the data source
     * @returns
     */
    private readBlock;
    /**
     * Reads an uncompressed data block into the model.
     * @param data the data store to read from.
     */
    private readUncompressedBlock;
    /**
     * Reads a zeroterminated ascii string from the given source
     * @param data the data source to read from
     * @param offset the offset to start reading from
     * @param length the max length to read
     * @returns the ascii string read from the datasource.
     */
    private getString;
    /**
     * Reads an 4 byte signed integer from the given source
     * @param data the data source to read from
     * @param offset offset the offset to start reading from
     * @returns
     */
    private getInteger;
}
