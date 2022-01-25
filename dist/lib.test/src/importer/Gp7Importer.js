import { BinaryStylesheet } from '@src/importer/BinaryStylesheet';
import { GpifParser } from '@src/importer/GpifParser';
import { PartConfiguration } from '@src/importer/PartConfiguration';
import { ScoreImporter } from '@src/importer/ScoreImporter';
import { UnsupportedFormatError } from '@src/importer/UnsupportedFormatError';
import { Logger } from '@src/Logger';
import { ZipReader } from '@src/zip/ZipReader';
import { IOHelper } from '@src/io/IOHelper';
/**
 * This ScoreImporter can read Guitar Pro 7 (gp) files.
 */
export class Gp7Importer extends ScoreImporter {
    get name() {
        return 'Guitar Pro 7';
    }
    constructor() {
        super();
    }
    readScore() {
        // at first we need to load the binary file system
        // from the GPX container
        Logger.debug(this.name, 'Loading ZIP entries');
        let fileSystem = new ZipReader(this.data);
        let entries;
        try {
            entries = fileSystem.read();
        }
        catch (e) {
            throw new UnsupportedFormatError('No Zip archive', e);
        }
        Logger.debug(this.name, 'Zip entries loaded');
        let xml = null;
        let binaryStylesheetData = null;
        let partConfigurationData = null;
        for (let entry of entries) {
            switch (entry.fileName) {
                case 'score.gpif':
                    xml = IOHelper.toString(entry.data, this.settings.importer.encoding);
                    break;
                case 'BinaryStylesheet':
                    binaryStylesheetData = entry.data;
                    break;
                case 'PartConfiguration':
                    partConfigurationData = entry.data;
                    break;
            }
        }
        if (!xml) {
            throw new UnsupportedFormatError('No score.gpif found in zip archive');
        }
        // the score.gpif file within this filesystem stores
        // the score information as XML we need to parse.
        Logger.debug(this.name, 'Start Parsing score.gpif');
        let gpifParser = new GpifParser();
        gpifParser.parseXml(xml, this.settings);
        Logger.debug(this.name, 'score.gpif parsed');
        let score = gpifParser.score;
        if (binaryStylesheetData) {
            Logger.debug(this.name, 'Start Parsing BinaryStylesheet');
            let stylesheet = new BinaryStylesheet(binaryStylesheetData);
            stylesheet.apply(score);
            Logger.debug(this.name, 'BinaryStylesheet parsed');
        }
        if (partConfigurationData) {
            Logger.debug(this.name, 'Start Parsing Part Configuration');
            let partConfigurationParser = new PartConfiguration(partConfigurationData);
            partConfigurationParser.apply(score);
            Logger.debug(this.name, 'Part Configuration parsed');
        }
        return score;
    }
}
//# sourceMappingURL=Gp7Importer.js.map