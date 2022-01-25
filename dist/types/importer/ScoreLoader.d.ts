import { Score } from '@src/model/Score';
import { Settings } from '@src/Settings';
/**
 * The ScoreLoader enables you easy loading of Scores using all
 * available importers
 */
export declare class ScoreLoader {
    /**
     * Loads a score asynchronously from the given datasource
     * @param path the source path to load the binary file from
     * @param success this function is called if the Score was successfully loaded from the datasource
     * @param error this function is called if any error during the loading occured.
     * @param settings settings for the score import
     * @target web
     */
    static loadScoreAsync(path: string, success: (score: Score) => void, error: (error: any) => void, settings?: Settings): void;
    /**
     * Loads the score from the given binary data.
     * @param data The binary data containing a score in any known file format.
     * @param settings The settings to use during importing.
     * @returns The loaded score.
     */
    static loadScoreFromBytes(data: Uint8Array, settings?: Settings): Score;
}
