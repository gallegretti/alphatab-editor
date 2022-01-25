import { Note } from '@src/model/Note';
import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { BeatBounds } from '../utils/BeatBounds';
export declare class NoteNumberGlyph extends Glyph {
    private _note;
    private _noteString;
    private _trillNoteString;
    private _trillNoteStringWidth;
    isEmpty: boolean;
    noteStringWidth: number;
    constructor(x: number, y: number, note: Note);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    buildBoundingsLookup(beatBounds: BeatBounds, cx: number, cy: number): void;
}
