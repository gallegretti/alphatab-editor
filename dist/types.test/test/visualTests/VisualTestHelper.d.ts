import { Score } from '@src/model/Score';
import { Settings } from '@src/Settings';
import { RenderFinishedEventArgs } from '@src/rendering/RenderFinishedEventArgs';
/**
 * @partial
 */
export declare class VisualTestHelper {
    /**
     * @target web
     * @partial
     */
    static runVisualTest(inputFile: string, settings?: Settings, tracks?: number[], message?: string, tolerancePercent?: number, triggerResize?: boolean): Promise<void>;
    /**
     * @target web
     * @partial
     */
    static runVisualTestTex(tex: string, referenceFileName: string, settings?: Settings, tracks?: number[], message?: string, tolerancePercent?: number): Promise<void>;
    /**
     * @target web
     * @partial
     */
    private static _fontsLoaded;
    /**
     * @target web
     * @partial
     */
    private static loadFonts;
    /**
     * @target web
     * @partial
     */
    static runVisualTestScore(score: Score, referenceFileName: string, settings?: Settings, tracks?: number[], message?: string, tolerancePercent?: number, triggerResize?: boolean): Promise<void>;
    /**
     * @target web
     * @partial
     */
    private static convertPngToCanvas;
    /**
     * @target web
     * @partial
     */
    private static convertSvgToImage;
    /**
     * @target web
     * @partial
     */
    static compareVisualResult(totalWidth: number, totalHeight: number, result: RenderFinishedEventArgs[], referenceFileName: string, referenceFileData: Uint8Array, message?: string, tolerancePercent?: number): Promise<void>;
    /**
     * @target web
     * @partial
     */
    private static toEqualVisually;
    /**
     * @target web
     * @partial
     */
    private static initComparer;
    /**
     * @target web
     * @partial
     */
    static saveFiles(name: string, expected: HTMLCanvasElement, actual: HTMLCanvasElement, diff: HTMLCanvasElement): Promise<void>;
    /**
     * @target web
     */
    static toPngBlob(canvas: HTMLCanvasElement): Promise<Blob>;
    static createFileName(oldName: string, part: string): string;
}
