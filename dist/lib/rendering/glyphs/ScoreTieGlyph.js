import { NoteYPosition } from '@src/rendering/BarRendererBase';
import { TieGlyph } from '@src/rendering/glyphs/TieGlyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { BeatXPosition } from '../BeatXPosition';
export class ScoreTieGlyph extends TieGlyph {
    constructor(startNote, endNote, forEnd = false) {
        super(!startNote ? null : startNote.beat, !endNote ? null : endNote.beat, forEnd);
        this.startNote = startNote;
        this.endNote = endNote;
    }
    shouldDrawBendSlur() {
        return this.renderer.settings.notation.extendBendArrowsOnTiedNotes && !!this.startNote.bendOrigin && this.startNote.isTieOrigin;
    }
    doLayout() {
        super.doLayout();
    }
    getBeamDirection(beat, noteRenderer) {
        // invert direction (if stems go up, ties go down to not cross them)
        switch (noteRenderer.getBeatDirection(beat)) {
            case BeamDirection.Up:
                return BeamDirection.Down;
            default:
                return BeamDirection.Up;
        }
    }
    getStartY() {
        if (this.startBeat.isRest) {
            // below all lines
            return this.startNoteRenderer.getScoreY(9);
        }
        switch (this.tieDirection) {
            case BeamDirection.Up:
                // below lowest note
                return this.startNoteRenderer.getNoteY(this.startNote, NoteYPosition.Top);
            default:
                return this.startNoteRenderer.getNoteY(this.startNote, NoteYPosition.Bottom);
        }
    }
    getEndY() {
        const endNoteScoreRenderer = this.endNoteRenderer;
        if (this.endBeat.isRest) {
            switch (this.tieDirection) {
                case BeamDirection.Up:
                    return endNoteScoreRenderer.getScoreY(9);
                default:
                    return endNoteScoreRenderer.getScoreY(0);
            }
        }
        switch (this.tieDirection) {
            case BeamDirection.Up:
                return endNoteScoreRenderer.getNoteY(this.endNote, NoteYPosition.Top);
            default:
                return endNoteScoreRenderer.getNoteY(this.endNote, NoteYPosition.Bottom);
        }
    }
    getStartX() {
        return this.startNoteRenderer.getBeatX(this.startNote.beat, BeatXPosition.PostNotes);
    }
    getEndX() {
        return this.endNoteRenderer.getBeatX(this.endNote.beat, BeatXPosition.PreNotes);
    }
}
//# sourceMappingURL=ScoreTieGlyph.js.map