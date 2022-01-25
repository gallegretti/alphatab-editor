import { ScoreImporter } from '@src/importer/ScoreImporter';
import { Score } from '@src/model/Score';
/**
 * This ScoreImporter can read Guitar Pro 7 (gp) files.
 */
export declare class Gp7Importer extends ScoreImporter {
    get name(): string;
    constructor();
    readScore(): Score;
}
