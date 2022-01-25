import { ScoreImporter } from '@src/importer/ScoreImporter';
import { Score } from '@src/model/Score';
/**
 * This ScoreImporter can read Capella (cap/capx) files.
 */
export declare class CapellaImporter extends ScoreImporter {
    get name(): string;
    constructor();
    readScore(): Score;
}
