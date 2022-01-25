import { Note } from '@src/model/Note';
import { BeatOnNoteGlyphBase } from '@src/rendering/glyphs/BeatOnNoteGlyphBase';
import { TabNoteChordGlyph } from '@src/rendering/glyphs/TabNoteChordGlyph';
import { TabRestGlyph } from '@src/rendering/glyphs/TabRestGlyph';
import { NoteXPosition, NoteYPosition } from '../BarRendererBase';
import { BeatBounds } from '../utils/BeatBounds';
export declare class TabBeatGlyph extends BeatOnNoteGlyphBase {
    noteNumbers: TabNoteChordGlyph | null;
    restGlyph: TabRestGlyph | null;
    getNoteX(note: Note, requestedPosition: NoteXPosition): number;
    getNoteY(note: Note, requestedPosition: NoteYPosition): number;
    buildBoundingsLookup(beatBounds: BeatBounds, cx: number, cy: number): void;
    doLayout(): void;
    updateBeamingHelper(): void;
    private createNoteGlyph;
}
