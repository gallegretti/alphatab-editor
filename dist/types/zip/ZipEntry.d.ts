export declare class ZipEntry {
    static readonly OptionalDataDescriptorSignature: number;
    static readonly CompressionMethodDeflate: number;
    static readonly LocalFileHeaderSignature: number;
    static readonly CentralFileHeaderSignature: number;
    static readonly EndOfCentralDirSignature: number;
    readonly fullName: string;
    readonly fileName: string;
    readonly data: Uint8Array;
    constructor(fullName: string, data: Uint8Array);
}
