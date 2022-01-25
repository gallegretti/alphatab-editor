import { Logger } from '@src/Logger';
import { ZipEntry } from '@src/zip/ZipEntry';
import { ScoreExporter } from './ScoreExporter';
import { IOHelper } from '@src/io/IOHelper';
import { BinaryStylesheet } from '@src/importer/BinaryStylesheet';
import { PartConfiguration } from '@src/importer/PartConfiguration';
import { GpifWriter } from './GpifWriter';
import { ZipWriter } from '@src/zip/ZipWriter';
/**
 * This ScoreExporter can write Guitar Pro 7 (gp) files.
 */
export class Gp7Exporter extends ScoreExporter {
    get name() {
        return 'Guitar Pro 7';
    }
    constructor() {
        super();
    }
    writeScore(score) {
        Logger.debug(this.name, 'Writing data entries');
        const gpifWriter = new GpifWriter();
        const gpifXml = gpifWriter.writeXml(score);
        const binaryStylesheet = BinaryStylesheet.writeForScore(score);
        const partConfiguration = PartConfiguration.writeForScore(score);
        Logger.debug(this.name, 'Writing ZIP entries');
        let fileSystem = new ZipWriter(this.data);
        fileSystem.writeEntry(new ZipEntry('VERSION', IOHelper.stringToBytes('7.0')));
        fileSystem.writeEntry(new ZipEntry('Content/', new Uint8Array(0)));
        fileSystem.writeEntry(new ZipEntry('Content/BinaryStylesheet', binaryStylesheet));
        fileSystem.writeEntry(new ZipEntry('Content/PartConfiguration', partConfiguration));
        fileSystem.writeEntry(new ZipEntry('Content/score.gpif', IOHelper.stringToBytes(gpifXml)));
        fileSystem.end();
    }
}
//# sourceMappingURL=Gp7Exporter.js.map