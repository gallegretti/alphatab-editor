import { ByteBuffer } from '@src/io/ByteBuffer';
import { IOHelper } from '@src/io/IOHelper';
import { Inflate } from '@src/zip/Inflate';
import { ZipEntry } from './ZipEntry';
export class ZipReader {
    constructor(readable) {
        this._readable = readable;
    }
    read() {
        let entries = [];
        while (true) {
            let e = this.readEntry();
            if (!e) {
                break;
            }
            entries.push(e);
        }
        return entries;
    }
    readEntry() {
        let readable = this._readable;
        let h = IOHelper.readInt32LE(readable);
        if (h !== ZipEntry.LocalFileHeaderSignature) {
            return null;
        }
        // 4.3.7 local file header
        IOHelper.readUInt16LE(readable); // version
        let flags = IOHelper.readUInt16LE(readable);
        let compressionMethod = IOHelper.readUInt16LE(readable);
        let compressed = compressionMethod !== 0;
        if (compressed && compressionMethod !== ZipEntry.CompressionMethodDeflate) {
            return null;
        }
        IOHelper.readInt16LE(this._readable); // last mod file time
        IOHelper.readInt16LE(this._readable); // last mod file date
        IOHelper.readInt32LE(readable); // crc-32
        IOHelper.readInt32LE(readable); // compressed size
        let uncompressedSize = IOHelper.readInt32LE(readable);
        let fileNameLength = IOHelper.readInt16LE(readable);
        let extraFieldLength = IOHelper.readInt16LE(readable);
        let fname = IOHelper.toString(IOHelper.readByteArray(readable, fileNameLength), 'utf-8');
        readable.skip(extraFieldLength);
        // 4.3.8 File Data
        let data;
        if (compressed) {
            let target = ByteBuffer.empty();
            let z = new Inflate(this._readable);
            let buffer = new Uint8Array(65536);
            while (true) {
                let bytes = z.readBytes(buffer, 0, buffer.length);
                target.write(buffer, 0, bytes);
                if (bytes < buffer.length) {
                    break;
                }
            }
            data = target.toArray();
        }
        else {
            data = IOHelper.readByteArray(this._readable, uncompressedSize);
        }
        // 4.3.9 Data Descriptor
        // 4.3.9.1
        if ((flags & 8) !== 0) {
            let crc32 = IOHelper.readInt32LE(this._readable);
            // 4.3.9.3
            if (crc32 === ZipEntry.OptionalDataDescriptorSignature) {
                IOHelper.readInt32LE(this._readable); // real crc
            }
            IOHelper.readInt32LE(this._readable); // compressed size
            IOHelper.readInt32LE(this._readable); // uncompressed size
        }
        return new ZipEntry(fname, data);
    }
}
//# sourceMappingURL=ZipReader.js.map