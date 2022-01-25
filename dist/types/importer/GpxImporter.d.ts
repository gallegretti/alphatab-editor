import { ScoreImporter } from '@src/importer/ScoreImporter';
import { Score } from '@src/model/Score';
/**
 * This ScoreImporter can read Guitar Pro 6 (gpx) files.
 */
export declare class GpxImporter extends ScoreImporter {
    get name(): string;
    constructor();
    readScore(): Score;
}
