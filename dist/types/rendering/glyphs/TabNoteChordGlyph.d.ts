import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { NoteNumberGlyph } from '@src/rendering/glyphs/NoteNumberGlyph';
import { BeamingHelper } from '@src/rendering/utils/BeamingHelper';
import { NoteXPosition, NoteYPosition } from '../BarRendererBase';
import { BeatBounds } from '../utils/BeatBounds';
export declare class TabNoteChordGlyph extends Glyph {
    private _notes;
    private _isGrace;
    beat: Beat;
    beamingHelper: BeamingHelper;
    minStringNote: Note | null;
    beatEffects: Map<string, Glyph>;
    notesPerString: Map<number, NoteNumberGlyph>;
    noteStringWidth: number;
    constructor(x: number, y: number, isGrace: boolean);
    buildBoundingsLookup(beatBounds: BeatBounds, cx: number, cy: number): void;
    getNoteX(note: Note, requestedPosition: NoteXPosition): number;
    getNoteY(note: Note, requestedPosition: NoteYPosition): number;
    doLayout(): void;
    addNoteGlyph(noteGlyph: NoteNumberGlyph, note: Note): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    updateBeamingHelper(cx: number): void;
}
