import { BendType } from '@src/model/BendType';
import { HarmonicType } from '@src/model/HarmonicType';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { Bounds } from '@src/rendering/utils/Bounds';
import { NoteBounds } from '@src/rendering/utils/NoteBounds';
import { ModelUtils } from '@src/model/ModelUtils';
import { NotationElement, NotationMode } from '@src/NotationSettings';
export class NoteNumberGlyph extends Glyph {
    constructor(x, y, note) {
        super(x, y);
        this._noteString = null;
        this._trillNoteString = null;
        this._trillNoteStringWidth = 0;
        this.isEmpty = false;
        this.noteStringWidth = 0;
        this._note = note;
    }
    doLayout() {
        let n = this._note;
        let fret = n.fret - n.beat.voice.bar.staff.transpositionPitch;
        if (n.harmonicType === HarmonicType.Natural && n.harmonicValue !== 0) {
            fret = n.harmonicValue - n.beat.voice.bar.staff.transpositionPitch;
        }
        if (!n.isTieDestination) {
            this._noteString = n.isDead ? 'x' : fret.toString();
            if (n.isGhost) {
                this._noteString = '(' + this._noteString + ')';
            }
            else if (n.harmonicType === HarmonicType.Natural) {
                // only first decimal char
                let i = this._noteString.indexOf(String.fromCharCode(46));
                if (i >= 0) {
                    this._noteString = this._noteString.substr(0, i + 2);
                }
                this._noteString = '<' + this._noteString + '>';
            }
        }
        else if ((n.beat.index === 0 && this.renderer.settings.notation.notationMode == NotationMode.GuitarPro) ||
            ((n.bendType === BendType.Bend || n.bendType === BendType.BendRelease) &&
                this.renderer.settings.notation.isNotationElementVisible(NotationElement.TabNotesOnTiedBends))) {
            this._noteString = '(' + (n.tieOrigin.fret - n.beat.voice.bar.staff.transpositionPitch).toString() + ')';
        }
        else {
            this._noteString = '';
        }
        if (n.isTrill) {
            this._trillNoteString = '(' + (n.trillFret - n.beat.voice.bar.staff.transpositionPitch).toString() + ')';
        }
        else if (!ModelUtils.isAlmostEqualTo(n.harmonicValue, 0)) {
            switch (n.harmonicType) {
                case HarmonicType.Artificial:
                case HarmonicType.Pinch:
                case HarmonicType.Tap:
                case HarmonicType.Semi:
                case HarmonicType.Feedback:
                    let s = (fret + n.harmonicValue).toString();
                    // only first decimal char
                    let i = s.indexOf(String.fromCharCode(46));
                    if (i >= 0) {
                        s = s.substr(0, i + 2);
                    }
                    this._trillNoteString = '<' + s + '>';
                    break;
                default:
                    this._trillNoteString = '';
                    break;
            }
        }
        else {
            this._trillNoteString = '';
        }
        this.isEmpty = !this._noteString;
        if (!this.isEmpty) {
            this.renderer.scoreRenderer.canvas.font = this.renderer.resources.tablatureFont;
            this.noteStringWidth = this.renderer.scoreRenderer.canvas.measureText(this._noteString) * this.scale;
            this.width = this.noteStringWidth;
            this.height = this.renderer.scoreRenderer.canvas.font.size;
            let hasTrill = !!this._trillNoteString;
            if (hasTrill) {
                this.renderer.scoreRenderer.canvas.font = this.renderer.resources.graceFont;
                this._trillNoteStringWidth =
                    3 * this.scale + this.renderer.scoreRenderer.canvas.measureText(this._trillNoteString);
                this.width += this._trillNoteStringWidth;
            }
        }
    }
    paint(cx, cy, canvas) {
        if (this.isEmpty) {
            return;
        }
        let textWidth = this.noteStringWidth + this._trillNoteStringWidth;
        let x = cx + this.x + (this.width - textWidth) / 2;
        let prevFont = this.renderer.scoreRenderer.canvas.font;
        this.renderer.scoreRenderer.canvas.font = this.renderer.resources.graceFont;
        canvas.fillText(this._trillNoteString, x + this.noteStringWidth + 3 * this.scale, cy + this.y);
        this.renderer.scoreRenderer.canvas.font = prevFont;
        canvas.fillText(this._noteString, x, cy + this.y);
    }
    buildBoundingsLookup(beatBounds, cx, cy) {
        let noteBounds = new NoteBounds();
        noteBounds.note = this._note;
        noteBounds.noteHeadBounds = new Bounds();
        noteBounds.noteHeadBounds.x = cx + this.x;
        noteBounds.noteHeadBounds.y = cy + this.y - this.height / 2;
        noteBounds.noteHeadBounds.w = this.width;
        noteBounds.noteHeadBounds.h = this.height;
        this.renderer.scoreRenderer.boundsLookup.addNote(noteBounds);
    }
}
//# sourceMappingURL=NoteNumberGlyph.js.map