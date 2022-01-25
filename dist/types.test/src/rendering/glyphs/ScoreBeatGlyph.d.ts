import { Note } from '@src/model/Note';
import { BeatOnNoteGlyphBase } from '@src/rendering/glyphs/BeatOnNoteGlyphBase';
import { ScoreNoteChordGlyph } from '@src/rendering/glyphs/ScoreNoteChordGlyph';
import { ScoreRestGlyph } from '@src/rendering/glyphs/ScoreRestGlyph';
import { NoteXPosition, NoteYPosition } from '../BarRendererBase';
import { BeatBounds } from '../utils/BeatBounds';
import { ICanvas } from '@src/platform/ICanvas';
export declare class ScoreBeatGlyph extends BeatOnNoteGlyphBase {
    private _collisionOffset;
    private _skipPaint;
    noteHeads: ScoreNoteChordGlyph | null;
    restGlyph: ScoreRestGlyph | null;
    getNoteX(note: Note, requestedPosition: NoteXPosition): number;
    buildBoundingsLookup(beatBounds: BeatBounds, cx: number, cy: number): void;
    getNoteY(note: Note, requestedPosition: NoteYPosition): number;
    updateBeamingHelper(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    doLayout(): void;
    private createBeatDot;
    private createNoteHeadGlyph;
    private createNoteGlyph;
}
