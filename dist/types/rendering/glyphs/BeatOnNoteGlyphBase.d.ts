import { BeatGlyphBase } from '@src/rendering/glyphs/BeatGlyphBase';
import { BeamingHelper } from '@src/rendering/utils/BeamingHelper';
import { NoteXPosition, NoteYPosition } from '../BarRendererBase';
import { Note } from '@src/model/Note';
import { BeatBounds } from '../utils/BeatBounds';
export declare class BeatOnNoteGlyphBase extends BeatGlyphBase {
    beamingHelper: BeamingHelper;
    centerX: number;
    updateBeamingHelper(): void;
    buildBoundingsLookup(beatBounds: BeatBounds, cx: number, cy: number): void;
    getNoteX(note: Note, requestedPosition: NoteXPosition): number;
    getNoteY(note: Note, requestedPosition: NoteYPosition): number;
}
