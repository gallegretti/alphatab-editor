import { NoteYPosition, NoteXPosition } from '@src/rendering/BarRendererBase';
import { TieGlyph } from '@src/rendering/glyphs/TieGlyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export class TabTieGlyph extends TieGlyph {
    constructor(startNote, endNote, forEnd = false) {
        super(startNote.beat, endNote.beat, forEnd);
        this.startNote = startNote;
        this.endNote = endNote;
    }
    getTieHeight(startX, startY, endX, endY) {
        if (this.startNote === this.endNote) {
            return 15;
        }
        return super.getTieHeight(startX, startY, endX, endY);
    }
    getBeamDirection(beat, noteRenderer) {
        if (this.startNote === this.endNote) {
            return BeamDirection.Up;
        }
        return TabTieGlyph.getBeamDirectionForNote(this.startNote);
    }
    static getBeamDirectionForNote(note) {
        return note.string > 3 ? BeamDirection.Up : BeamDirection.Down;
    }
    getStartY() {
        if (this.startNote === this.endNote) {
            return this.startNoteRenderer.getNoteY(this.startNote, NoteYPosition.Center);
        }
        if (this.tieDirection === BeamDirection.Up) {
            return this.startNoteRenderer.getNoteY(this.startNote, NoteYPosition.Top);
        }
        return this.startNoteRenderer.getNoteY(this.startNote, NoteYPosition.Bottom);
    }
    getEndY() {
        return this.getStartY();
    }
    getStartX() {
        if (this.startNote === this.endNote) {
            return this.getEndX() - 20 * this.scale;
        }
        return this.startNoteRenderer.getNoteX(this.startNote, NoteXPosition.Center);
    }
    getEndX() {
        if (this.startNote === this.endNote) {
            return this.endNoteRenderer.getNoteX(this.endNote, NoteXPosition.Left);
        }
        return this.endNoteRenderer.getNoteX(this.endNote, NoteXPosition.Center);
    }
}
//# sourceMappingURL=TabTieGlyph.js.map