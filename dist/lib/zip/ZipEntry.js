export class ZipEntry {
    constructor(fullName, data) {
        this.fullName = fullName;
        let i = fullName.lastIndexOf('/');
        this.fileName = i === -1 || i === fullName.length - 1 ? this.fullName : fullName.substr(i + 1);
        this.data = data;
    }
}
ZipEntry.OptionalDataDescriptorSignature = 0x08074b50;
ZipEntry.CompressionMethodDeflate = 8;
ZipEntry.LocalFileHeaderSignature = 0x04034b50;
ZipEntry.CentralFileHeaderSignature = 0x02014b50;
ZipEntry.EndOfCentralDirSignature = 0x06054b50;
//# sourceMappingURL=ZipEntry.js.map