import { Bar } from '@src/model/Bar';
import { Voice } from '@src/model/Voice';
import { ICanvas } from '@src/platform/ICanvas';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
/**
 * This BarRenderer renders a bar using guitar tablature notation
 */
export declare class TabBarRenderer extends BarRendererBase {
    static readonly StaffId: string;
    static readonly TabLineSpacing: number;
    private _firstLineY;
    private _tupletSize;
    showTimeSignature: boolean;
    showRests: boolean;
    showTiedNotes: boolean;
    constructor(renderer: ScoreRenderer, bar: Bar);
    get lineOffset(): number;
    protected updateSizes(): void;
    private updateFirstLineY;
    doLayout(): void;
    protected createPreBeatGlyphs(): void;
    private _startSpacing;
    private createStartSpacing;
    private createTimeSignatureGlyphs;
    protected createVoiceGlyphs(v: Voice): void;
    protected createPostBeatGlyphs(): void;
    /**
     * Gets the relative y position of the given steps relative to first line.
     * @param line the line of the particular string where 0 is the most top line
     * @param correction
     * @returns
     */
    getTabY(line: number): number;
    getTabHeight(line: number): number;
    get middleYPosition(): number;
    protected paintBackground(cx: number, cy: number, canvas: ICanvas): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    private paintBeams;
    private paintTuplets;
    private paintBeamHelper;
    private paintBar;
    private paintTupletHelper;
    private static paintSingleBar;
    private paintBeamingStem;
    private paintFooter;
}
