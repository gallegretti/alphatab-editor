import { NoteYPosition } from '@src/rendering/BarRendererBase';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { TieGlyph } from '@src/rendering/glyphs/TieGlyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { Duration } from '@src/model/Duration';
import { GraceType } from '@src/model/GraceType';
export class ScoreLegatoGlyph extends TieGlyph {
    constructor(startBeat, endBeat, forEnd = false) {
        super(startBeat, endBeat, forEnd);
    }
    doLayout() {
        super.doLayout();
    }
    getBeamDirection(beat, noteRenderer) {
        if (beat.isRest) {
            return BeamDirection.Up;
        }
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
                return this.startNoteRenderer.getNoteY(this.startBeat.maxNote, NoteYPosition.Top);
            default:
                return this.startNoteRenderer.getNoteY(this.startBeat.minNote, NoteYPosition.Bottom);
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
        const startBeamDirection = this.startNoteRenderer.getBeatDirection(this.startBeat);
        const endBeamDirection = endNoteScoreRenderer.getBeatDirection(this.endBeat);
        if (startBeamDirection !== endBeamDirection && this.startBeat.graceType === GraceType.None) {
            if (endBeamDirection === this.tieDirection) {
                switch (this.tieDirection) {
                    case BeamDirection.Up:
                        // stem upper end
                        return endNoteScoreRenderer.getNoteY(this.endBeat.maxNote, NoteYPosition.TopWithStem);
                    default:
                        // stem lower end
                        return endNoteScoreRenderer.getNoteY(this.endBeat.minNote, NoteYPosition.BottomWithStem);
                }
            }
            else {
                switch (this.tieDirection) {
                    case BeamDirection.Up:
                        // stem upper end
                        return endNoteScoreRenderer.getNoteY(this.endBeat.maxNote, NoteYPosition.BottomWithStem);
                    default:
                        // stem lower end
                        return endNoteScoreRenderer.getNoteY(this.endBeat.minNote, NoteYPosition.TopWithStem);
                }
            }
        }
        switch (this.tieDirection) {
            case BeamDirection.Up:
                // below lowest note
                return endNoteScoreRenderer.getNoteY(this.endBeat.maxNote, NoteYPosition.Top);
            default:
                // above highest note
                return endNoteScoreRenderer.getNoteY(this.endBeat.minNote, NoteYPosition.Bottom);
        }
    }
    getStartX() {
        return this.startNoteRenderer.getBeatX(this.startBeat, BeatXPosition.MiddleNotes);
    }
    getEndX() {
        const endBeamDirection = this.endNoteRenderer.getBeatDirection(this.endBeat);
        return this.endNoteRenderer.getBeatX(this.endBeat, this.endBeat.duration > Duration.Whole &&
            endBeamDirection === this.tieDirection ? BeatXPosition.Stem : BeatXPosition.MiddleNotes);
    }
}
//# sourceMappingURL=ScoreLegatoGlyph.js.map