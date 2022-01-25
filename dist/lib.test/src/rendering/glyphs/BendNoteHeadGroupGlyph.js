import { AccidentalType } from '@src/model/AccidentalType';
import { Duration } from '@src/model/Duration';
import { AccidentalGlyph } from '@src/rendering/glyphs/AccidentalGlyph';
import { AccidentalGroupGlyph } from '@src/rendering/glyphs/AccidentalGroupGlyph';
import { GhostNoteContainerGlyph } from '@src/rendering/glyphs/GhostNoteContainerGlyph';
import { NoteHeadGlyph } from '@src/rendering/glyphs/NoteHeadGlyph';
import { ScoreNoteChordGlyphBase } from '@src/rendering/glyphs/ScoreNoteChordGlyphBase';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export class BendNoteHeadGroupGlyph extends ScoreNoteChordGlyphBase {
    constructor(beat, showParenthesis = false) {
        super();
        this._showParenthesis = false;
        this._noteValueLookup = new Map();
        this._accidentals = new AccidentalGroupGlyph();
        this._preNoteParenthesis = null;
        this._postNoteParenthesis = null;
        this.isEmpty = true;
        this.noteHeadOffset = 0;
        this._beat = beat;
        this._showParenthesis = showParenthesis;
        if (showParenthesis) {
            this._preNoteParenthesis = new GhostNoteContainerGlyph(true);
            this._postNoteParenthesis = new GhostNoteContainerGlyph(false);
        }
    }
    get direction() {
        return BeamDirection.Up;
    }
    containsNoteValue(noteValue) {
        return this._noteValueLookup.has(noteValue);
    }
    getNoteValueY(noteValue) {
        if (this._noteValueLookup.has(noteValue)) {
            return this.y + this._noteValueLookup.get(noteValue).y;
        }
        return 0;
    }
    addGlyph(noteValue, quarterBend = false) {
        let sr = this.renderer;
        let noteHeadGlyph = new NoteHeadGlyph(0, 0, Duration.Quarter, true);
        let accidental = sr.accidentalHelper.applyAccidentalForValue(this._beat, noteValue, quarterBend, true);
        let line = sr.accidentalHelper.getNoteLineForValue(noteValue, false);
        noteHeadGlyph.y = sr.getScoreY(line);
        if (this._showParenthesis) {
            this._preNoteParenthesis.renderer = this.renderer;
            this._postNoteParenthesis.renderer = this.renderer;
            this._preNoteParenthesis.addParenthesisOnLine(line, true);
            this._postNoteParenthesis.addParenthesisOnLine(line, true);
        }
        if (accidental !== AccidentalType.None) {
            let g = new AccidentalGlyph(0, noteHeadGlyph.y, accidental, true);
            g.renderer = this.renderer;
            this._accidentals.renderer = this.renderer;
            this._accidentals.addGlyph(g);
        }
        this._noteValueLookup.set(noteValue, noteHeadGlyph);
        this.add(noteHeadGlyph, line);
        this.isEmpty = false;
    }
    doLayout() {
        let x = 0;
        if (this._showParenthesis) {
            this._preNoteParenthesis.x = x;
            this._preNoteParenthesis.renderer = this.renderer;
            this._preNoteParenthesis.doLayout();
            x += this._preNoteParenthesis.width + BendNoteHeadGroupGlyph.ElementPadding * this.scale;
        }
        if (!this._accidentals.isEmpty) {
            x += this._accidentals.width + BendNoteHeadGroupGlyph.ElementPadding * this.scale;
            this._accidentals.x = x;
            this._accidentals.renderer = this.renderer;
            this._accidentals.doLayout();
            x += this._accidentals.width + BendNoteHeadGroupGlyph.ElementPadding * this.scale;
        }
        this.noteStartX = x;
        super.doLayout();
        this.noteHeadOffset = this.noteStartX + (this.width - this.noteStartX) / 2;
        if (this._showParenthesis) {
            this._postNoteParenthesis.x = this.width + BendNoteHeadGroupGlyph.ElementPadding * this.scale;
            this._postNoteParenthesis.renderer = this.renderer;
            this._postNoteParenthesis.doLayout();
            this.width += this._postNoteParenthesis.width + BendNoteHeadGroupGlyph.ElementPadding * this.scale;
        }
    }
    paint(cx, cy, canvas) {
        // canvas.Color = Color.Random();
        // canvas.FillRect(cx + X, cy + Y, Width, 10);
        // canvas.Color = Renderer.Resources.MainGlyphColor;
        if (!this._accidentals.isEmpty) {
            this._accidentals.paint(cx + this.x, cy + this.y, canvas);
        }
        if (this._showParenthesis) {
            this._preNoteParenthesis.paint(cx + this.x, cy + this.y, canvas);
            this._postNoteParenthesis.paint(cx + this.x, cy + this.y, canvas);
        }
        super.paint(cx, cy, canvas);
    }
}
BendNoteHeadGroupGlyph.ElementPadding = 2;
//# sourceMappingURL=BendNoteHeadGroupGlyph.js.map