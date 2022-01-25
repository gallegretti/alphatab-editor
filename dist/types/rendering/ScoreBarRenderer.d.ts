import { Bar } from '@src/model/Bar';
import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { Voice } from '@src/model/Voice';
import { ICanvas } from '@src/platform/ICanvas';
import { BarRendererBase, NoteYPosition } from '@src/rendering/BarRendererBase';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
import { AccidentalHelper } from '@src/rendering/utils/AccidentalHelper';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { BeamingHelper } from '@src/rendering/utils/BeamingHelper';
/**
 * This BarRenderer renders a bar using standard music notation.
 */
export declare class ScoreBarRenderer extends BarRendererBase {
    static readonly StaffId: string;
    private static SharpKsSteps;
    private static FlatKsSteps;
    simpleWhammyOverflow: number;
    private _firstLineY;
    accidentalHelper: AccidentalHelper;
    constructor(renderer: ScoreRenderer, bar: Bar);
    getBeatDirection(beat: Beat): BeamDirection;
    get lineOffset(): number;
    protected updateSizes(): void;
    private updateFirstLineY;
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    private paintTuplets;
    private paintBeams;
    private paintBeamHelper;
    private paintTupletHelper;
    getStemSize(helper: BeamingHelper): number;
    private getBarStemSize;
    private getFlagStemSize;
    get middleYPosition(): number;
    getNoteY(note: Note, requestedPosition: NoteYPosition): number;
    calculateBeamY(h: BeamingHelper, x: number): number;
    applyLayoutingInfo(): boolean;
    private calculateBeamYWithDirection;
    private paintBar;
    private static paintSingleBar;
    private paintFlag;
    private paintFingering;
    protected createPreBeatGlyphs(): void;
    protected createBeatGlyphs(): void;
    protected createPostBeatGlyphs(): void;
    private _startSpacing;
    private createStartSpacing;
    private createKeySignatureGlyphs;
    private createTimeSignatureGlyphs;
    protected createVoiceGlyphs(v: Voice): void;
    getNoteLine(n: Note): number;
    /**
     * Gets the relative y position of the given steps relative to first line.
     * @param steps the amount of steps while 2 steps are one line
     * @returns
     */
    getScoreY(steps: number): number;
    /**
     * Gets the height of an element that spans the given amount of steps.
     * @param steps the amount of steps while 2 steps are one line
     * @param correction
     * @returns
     */
    getScoreHeight(steps: number): number;
    protected paintBackground(cx: number, cy: number, canvas: ICanvas): void;
    completeBeamingHelper(helper: BeamingHelper): void;
}
