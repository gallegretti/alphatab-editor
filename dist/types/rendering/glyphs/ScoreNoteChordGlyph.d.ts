import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { ICanvas } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { ScoreNoteChordGlyphBase } from '@src/rendering/glyphs/ScoreNoteChordGlyphBase';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { BeamingHelper } from '@src/rendering/utils/BeamingHelper';
import { NoteXPosition, NoteYPosition } from '../BarRendererBase';
import { BeatBounds } from '../utils/BeatBounds';
export declare class ScoreNoteChordGlyph extends ScoreNoteChordGlyphBase {
    private _noteGlyphLookup;
    private _notes;
    private _tremoloPicking;
    aboveBeatEffects: Map<string, EffectGlyph>;
    belowBeatEffects: Map<string, EffectGlyph>;
    beat: Beat;
    beamingHelper: BeamingHelper;
    constructor();
    get direction(): BeamDirection;
    getNoteX(note: Note, requestedPosition: NoteXPosition): number;
    getNoteY(note: Note, requestedPosition: NoteYPosition): number;
    addNoteGlyph(noteGlyph: EffectGlyph, note: Note, noteLine: number): void;
    updateBeamingHelper(cx: number): void;
    doLayout(): void;
    buildBoundingsLookup(beatBounds: BeatBounds, cx: number, cy: number): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
