import { Bar } from '@src/model/Bar';
import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { Voice } from '@src/model/Voice';
import { ICanvas } from '@src/platform/ICanvas';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { BeatContainerGlyph } from '@src/rendering/glyphs/BeatContainerGlyph';
import { BeatGlyphBase } from '@src/rendering/glyphs/BeatGlyphBase';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { VoiceContainerGlyph } from '@src/rendering/glyphs/VoiceContainerGlyph';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
import { BarLayoutingInfo } from '@src/rendering/staves/BarLayoutingInfo';
import { RenderStaff } from '@src/rendering/staves/RenderStaff';
import { BarHelpers } from '@src/rendering/utils/BarHelpers';
import { MasterBarBounds } from '@src/rendering/utils/MasterBarBounds';
import { RenderingResources } from '@src/RenderingResources';
import { Settings } from '@src/Settings';
import { BeatOnNoteGlyphBase } from './glyphs/BeatOnNoteGlyphBase';
import { BeamingHelper } from './utils/BeamingHelper';
/**
 * Lists the different position modes for {@link BarRendererBase.getNoteY}
 */
export declare enum NoteYPosition {
    /**
     * Gets the note y-position on top of the note stem or tab number.
     */
    TopWithStem = 0,
    /**
     * Gets the note y-position on top of the note head or tab number.
     */
    Top = 1,
    /**
     * Gets the note y-position on the center of the note head or tab number.
     */
    Center = 2,
    /**
     * Gets the note y-position on the bottom of the note head or tab number.
     */
    Bottom = 3,
    /**
     * Gets the note y-position on the bottom of the note stem or tab number.
     */
    BottomWithStem = 4
}
/**
 * Lists the different position modes for {@link BarRendererBase.getNoteX}
 */
export declare enum NoteXPosition {
    /**
     * Gets the note x-position on left of the note head or tab number.
     */
    Left = 0,
    /**
     * Gets the note x-position on the center of the note head or tab number.
     */
    Center = 1,
    /**
     * Gets the note x-position on the right of the note head or tab number.
     */
    Right = 2
}
/**
 * This is the base public class for creating blocks which can render bars.
 */
export declare class BarRendererBase {
    static readonly LineSpacing: number;
    static readonly StemWidth: number;
    static readonly StaffLineThickness: number;
    static readonly BeamThickness: number;
    static readonly BeamSpacing: number;
    private _preBeatGlyphs;
    private _voiceContainers;
    private _postBeatGlyphs;
    get nextRenderer(): BarRendererBase | null;
    get previousRenderer(): BarRendererBase | null;
    scoreRenderer: ScoreRenderer;
    staff: RenderStaff;
    layoutingInfo: BarLayoutingInfo;
    bar: Bar;
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
    topOverflow: number;
    bottomOverflow: number;
    helpers: BarHelpers;
    /**
     * Gets or sets whether this renderer is linked to the next one
     * by some glyphs like a vibrato effect
     */
    isLinkedToPrevious: boolean;
    /**
     * Gets or sets whether this renderer can wrap to the next line
     * or it needs to stay connected to the previous one.
     * (e.g. when having double bar repeats we must not separate the 2 bars)
     */
    canWrap: boolean;
    constructor(renderer: ScoreRenderer, bar: Bar);
    get middleYPosition(): number;
    registerOverflowTop(topOverflow: number): void;
    registerOverflowBottom(bottomOverflow: number): void;
    scaleToWidth(width: number): void;
    get resources(): RenderingResources;
    get settings(): Settings;
    get scale(): number;
    private _wasFirstOfLine;
    get isFirstOfLine(): boolean;
    get isLast(): boolean;
    registerLayoutingInfo(): void;
    private _appliedLayoutingInfo;
    applyLayoutingInfo(): boolean;
    isFinalized: boolean;
    finalizeRenderer(): void;
    /**
     * Gets the top padding for the main content of the renderer.
     * Can be used to specify where i.E. the score lines of the notation start.
     * @returns
     */
    topPadding: number;
    /**
     * Gets the bottom padding for the main content of the renderer.
     * Can be used to specify where i.E. the score lines of the notation end.
     */
    bottomPadding: number;
    doLayout(): void;
    protected hasVoiceContainer(voice: Voice): boolean;
    protected updateSizes(): void;
    protected addPreBeatGlyph(g: Glyph): void;
    protected addBeatGlyph(g: BeatContainerGlyph): void;
    protected getVoiceContainer(voice: Voice): VoiceContainerGlyph | undefined;
    getBeatContainer(beat: Beat): BeatContainerGlyph | undefined;
    getPreNotesGlyphForBeat(beat: Beat): BeatGlyphBase | undefined;
    getOnNotesGlyphForBeat(beat: Beat): BeatOnNoteGlyphBase | undefined;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    protected paintBackground(cx: number, cy: number, canvas: ICanvas): void;
    buildBoundingsLookup(masterBarBounds: MasterBarBounds, cx: number, cy: number): void;
    protected addPostBeatGlyph(g: Glyph): void;
    protected createPreBeatGlyphs(): void;
    protected createBeatGlyphs(): void;
    protected createVoiceGlyphs(v: Voice): void;
    protected createPostBeatGlyphs(): void;
    get beatGlyphsStart(): number;
    get postBeatGlyphsStart(): number;
    getBeatX(beat: Beat, requestedPosition?: BeatXPosition): number;
    getNoteX(note: Note, requestedPosition: NoteXPosition): number;
    getNoteY(note: Note, requestedPosition: NoteYPosition): number;
    reLayout(): void;
    protected paintSimileMark(cx: number, cy: number, canvas: ICanvas): void;
    completeBeamingHelper(helper: BeamingHelper): void;
}
