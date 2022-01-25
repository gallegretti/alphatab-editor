import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { ICanvas } from '@src/platform/ICanvas';
import { ScoreHelperNotesBaseGlyph } from '@src/rendering/glyphs/ScoreHelperNotesBaseGlyph';
export declare class ScoreBendGlyph extends ScoreHelperNotesBaseGlyph {
    private _beat;
    private _notes;
    private _endNoteGlyph;
    private _middleNoteGlyph;
    constructor(beat: Beat);
    addBends(note: Note): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    private getBendNoteValue;
}
