import { Beat } from '@src/model/Beat';
import { ICanvas } from '@src/platform/ICanvas';
import { ScoreNoteChordGlyphBase } from '@src/rendering/glyphs/ScoreNoteChordGlyphBase';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export declare class BendNoteHeadGroupGlyph extends ScoreNoteChordGlyphBase {
    private static readonly ElementPadding;
    private _beat;
    private _showParenthesis;
    private _noteValueLookup;
    private _accidentals;
    private _preNoteParenthesis;
    private _postNoteParenthesis;
    isEmpty: boolean;
    get direction(): BeamDirection;
    noteHeadOffset: number;
    constructor(beat: Beat, showParenthesis?: boolean);
    containsNoteValue(noteValue: number): boolean;
    getNoteValueY(noteValue: number): number;
    addGlyph(noteValue: number, quarterBend?: boolean): void;
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
