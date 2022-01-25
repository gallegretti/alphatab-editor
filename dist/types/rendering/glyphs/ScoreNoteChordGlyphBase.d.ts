import { IEventEmitter } from '@src/EventEmitter';
import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { ScoreNoteGlyphInfo } from '@src/rendering/glyphs/ScoreNoteGlyphInfo';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export declare abstract class ScoreNoteChordGlyphBase extends Glyph {
    private _infos;
    protected _noteHeadPadding: number;
    minNote: ScoreNoteGlyphInfo | null;
    maxNote: ScoreNoteGlyphInfo | null;
    spacingChanged: IEventEmitter;
    upLineX: number;
    downLineX: number;
    displacedX: number;
    noteStartX: number;
    constructor();
    abstract get direction(): BeamDirection;
    protected add(noteGlyph: Glyph, noteLine: number): void;
    get hasTopOverflow(): boolean;
    get hasBottomOverflow(): boolean;
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
