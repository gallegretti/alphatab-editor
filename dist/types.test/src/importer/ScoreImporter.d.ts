import { IReadable } from '@src/io/IReadable';
import { Score } from '@src/model/Score';
import { Settings } from '@src/Settings';
/**
 * This is the base public class for creating new song importers which
 * enable reading scores from any binary datasource
 */
export declare abstract class ScoreImporter {
    protected data: IReadable;
    protected settings: Settings;
    /**
     * Initializes the importer with the given data and settings.
     */
    init(data: IReadable, settings: Settings): void;
    abstract get name(): string;
    /**
     * Reads the {@link Score} contained in the data.
     * @returns The score that was contained in the data.
     */
    abstract readScore(): Score;
}
