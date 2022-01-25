import { TextBaseline } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { NoteXPosition, NoteYPosition } from '../BarRendererBase';
export class TabNoteChordGlyph extends Glyph {
    constructor(x, y, isGrace) {
        super(x, y);
        this._notes = [];
        this.minStringNote = null;
        this.beatEffects = new Map();
        this.notesPerString = new Map();
        this.noteStringWidth = 0;
        this._isGrace = isGrace;
    }
    buildBoundingsLookup(beatBounds, cx, cy) {
        for (const note of this._notes) {
            note.buildBoundingsLookup(beatBounds, cx + this.x, cy + this.y);
        }
    }
    getNoteX(note, requestedPosition) {
        if (this.notesPerString.has(note.string)) {
            let n = this.notesPerString.get(note.string);
            let pos = this.x + n.x;
            switch (requestedPosition) {
                case NoteXPosition.Left:
                    break;
                case NoteXPosition.Center:
                    pos += n.noteStringWidth / 2;
                    break;
                case NoteXPosition.Right:
                    pos += n.width;
                    break;
            }
            return pos;
        }
        return 0;
    }
    getNoteY(note, requestedPosition) {
        if (this.notesPerString.has(note.string)) {
            const n = this.notesPerString.get(note.string);
            let pos = this.y + n.y;
            switch (requestedPosition) {
                case NoteYPosition.Top:
                case NoteYPosition.TopWithStem:
                    pos -= n.height / 2 + 2 * this.scale;
                    break;
                case NoteYPosition.Center:
                    break;
                case NoteYPosition.Bottom:
                case NoteYPosition.BottomWithStem:
                    pos += n.height / 2;
                    break;
            }
            return pos;
        }
        return 0;
    }
    doLayout() {
        let w = 0;
        let noteStringWidth = 0;
        for (let i = 0, j = this._notes.length; i < j; i++) {
            let g = this._notes[i];
            g.renderer = this.renderer;
            g.doLayout();
            if (g.width > w) {
                w = g.width;
            }
            if (g.noteStringWidth > noteStringWidth) {
                noteStringWidth = g.noteStringWidth;
            }
        }
        this.noteStringWidth = noteStringWidth;
        let tabHeight = this.renderer.resources.tablatureFont.size;
        let effectY = this.getNoteY(this.minStringNote, NoteYPosition.Center) + tabHeight / 2;
        // TODO: take care of actual glyph height
        let effectSpacing = 7 * this.scale;
        for (const g of this.beatEffects.values()) {
            g.y += effectY;
            g.x += this.width / 2;
            g.renderer = this.renderer;
            effectY += effectSpacing;
            g.doLayout();
        }
        this.width = w;
    }
    addNoteGlyph(noteGlyph, note) {
        this._notes.push(noteGlyph);
        this.notesPerString.set(note.string, noteGlyph);
        if (!this.minStringNote || note.string < this.minStringNote.string) {
            this.minStringNote = note;
        }
    }
    paint(cx, cy, canvas) {
        cx += this.x;
        cy += this.y;
        let res = this.renderer.resources;
        let oldBaseLine = canvas.textBaseline;
        canvas.textBaseline = TextBaseline.Middle;
        canvas.font = this._isGrace ? res.graceFont : res.tablatureFont;
        let notes = this._notes;
        let w = this.width;
        for (let g of notes) {
            g.renderer = this.renderer;
            g.width = w;
            g.paint(cx, cy, canvas);
        }
        canvas.textBaseline = oldBaseLine;
        for (const g of this.beatEffects.values()) {
            g.paint(cx, cy, canvas);
        }
    }
    updateBeamingHelper(cx) {
        if (this.beamingHelper && this.beamingHelper.isPositionFrom('tab', this.beat)) {
            this.beamingHelper.registerBeatLineX('tab', this.beat, cx + this.x + this.width / 2, cx + this.x + this.width / 2);
        }
    }
}
//# sourceMappingURL=TabNoteChordGlyph.js.map