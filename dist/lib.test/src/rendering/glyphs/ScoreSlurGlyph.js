import { ScoreLegatoGlyph } from './ScoreLegatoGlyph';
import { NoteYPosition, NoteXPosition } from '../BarRendererBase';
import { BeamDirection } from '../utils/BeamDirection';
import { GraceType } from '@src/model/GraceType';
import { BeatXPosition } from '../BeatXPosition';
export class ScoreSlurGlyph extends ScoreLegatoGlyph {
    constructor(startNote, endNote, forEnd = false) {
        super(startNote.beat, endNote.beat, forEnd);
        this._startNote = startNote;
        this._endNote = endNote;
    }
    getTieHeight(startX, startY, endX, endY) {
        return Math.log2(endX - startX + 1) * this.renderer.settings.notation.slurHeight;
    }
    getStartY() {
        if (this.isStartCentered()) {
            switch (this.tieDirection) {
                case BeamDirection.Up:
                    // below lowest note
                    return this.startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Top);
                default:
                    return this.startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Bottom);
            }
        }
        return this.startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center);
    }
    getEndY() {
        if (this.isEndCentered()) {
            if (this.isEndOnStem()) {
                switch (this.tieDirection) {
                    case BeamDirection.Up:
                        return this.endNoteRenderer.getNoteY(this._endNote, NoteYPosition.TopWithStem);
                    default:
                        return this.endNoteRenderer.getNoteY(this._endNote, NoteYPosition.BottomWithStem);
                }
            }
            else {
                switch (this.tieDirection) {
                    case BeamDirection.Up:
                        return this.endNoteRenderer.getNoteY(this._endNote, NoteYPosition.Top);
                    default:
                        return this.endNoteRenderer.getNoteY(this._endNote, NoteYPosition.Bottom);
                }
            }
        }
        else {
            return this.endNoteRenderer.getNoteY(this._endNote, NoteYPosition.Center);
        }
    }
    isStartCentered() {
        return ((this._startNote === this._startNote.beat.maxNote && this.tieDirection === BeamDirection.Up) ||
            (this._startNote === this._startNote.beat.minNote && this.tieDirection === BeamDirection.Down));
    }
    isEndCentered() {
        return this._startNote.beat.graceType === GraceType.None && ((this._endNote === this._endNote.beat.maxNote && this.tieDirection === BeamDirection.Up) ||
            (this._endNote === this._endNote.beat.minNote && this.tieDirection === BeamDirection.Down));
    }
    isEndOnStem() {
        const endNoteScoreRenderer = this.endNoteRenderer;
        const startBeamDirection = this.startNoteRenderer.getBeatDirection(this.startBeat);
        const endBeamDirection = endNoteScoreRenderer.getBeatDirection(this.endBeat);
        return startBeamDirection !== endBeamDirection && this.startBeat.graceType === GraceType.None;
    }
    getStartX() {
        return this.isStartCentered()
            ? this.startNoteRenderer.getBeatX(this._startNote.beat, BeatXPosition.MiddleNotes)
            : this.startNoteRenderer.getNoteX(this._startNote, NoteXPosition.Right);
    }
    getEndX() {
        if (this.isEndCentered()) {
            if (this.isEndOnStem()) {
                return this.endNoteRenderer.getBeatX(this._endNote.beat, BeatXPosition.Stem);
            }
            else {
                return this.endNoteRenderer.getNoteX(this._endNote, NoteXPosition.Center);
            }
        }
        else {
            return this.endNoteRenderer.getBeatX(this._endNote.beat, BeatXPosition.PreNotes);
        }
    }
}
//# sourceMappingURL=ScoreSlurGlyph.js.map