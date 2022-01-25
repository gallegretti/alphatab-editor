import { TabTieGlyph } from '@src/rendering/glyphs/TabTieGlyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export class TabSlurGlyph extends TabTieGlyph {
    constructor(startNote, endNote, forSlide, forEnd = false) {
        super(startNote, endNote, forEnd);
        this._direction = TabTieGlyph.getBeamDirectionForNote(startNote);
        this._forSlide = forSlide;
    }
    getTieHeight(startX, startY, endX, endY) {
        return Math.log(endX - startX + 1) * this.renderer.settings.notation.slurHeight;
    }
    tryExpand(startNote, endNote, forSlide, forEnd) {
        // same type required
        if (this._forSlide !== forSlide) {
            return false;
        }
        if (this.forEnd !== forEnd) {
            return false;
        }
        // same start and endbeat
        if (this.startNote.beat.id !== startNote.beat.id) {
            return false;
        }
        if (this.endNote.beat.id !== endNote.beat.id) {
            return false;
        }
        // same draw direction
        if (this._direction !== TabTieGlyph.getBeamDirectionForNote(startNote)) {
            return false;
        }
        // if we can expand, expand in correct direction
        switch (this._direction) {
            case BeamDirection.Up:
                if (startNote.realValue > this.startNote.realValue) {
                    this.startNote = startNote;
                    this.startBeat = startNote.beat;
                }
                if (endNote.realValue > this.endNote.realValue) {
                    this.endNote = endNote;
                    this.endBeat = endNote.beat;
                }
                break;
            case BeamDirection.Down:
                if (startNote.realValue < this.startNote.realValue) {
                    this.startNote = startNote;
                    this.startBeat = startNote.beat;
                }
                if (endNote.realValue < this.endNote.realValue) {
                    this.endNote = endNote;
                    this.endBeat = endNote.beat;
                }
                break;
        }
        return true;
    }
    paint(cx, cy, canvas) {
        let startNoteRenderer = this.renderer.scoreRenderer.layout.getRendererForBar(this.renderer.staff.staveId, this.startBeat.voice.bar);
        let direction = this.getBeamDirection(this.startBeat, startNoteRenderer);
        let slurId = 'tab.slur.' + this.startNote.beat.id + '.' + this.endNote.beat.id + '.' + direction;
        let renderer = this.renderer;
        let isSlurRendered = renderer.staff.getSharedLayoutData(slurId, false);
        if (!isSlurRendered) {
            renderer.staff.setSharedLayoutData(slurId, true);
            super.paint(cx, cy, canvas);
        }
    }
}
//# sourceMappingURL=TabSlurGlyph.js.map