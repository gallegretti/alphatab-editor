import { EventEmitter } from '@src/EventEmitter';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { ScoreNoteGlyphInfo } from '@src/rendering/glyphs/ScoreNoteGlyphInfo';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export class ScoreNoteChordGlyphBase extends Glyph {
    constructor() {
        super(0, 0);
        this._infos = [];
        this._noteHeadPadding = 0;
        this.minNote = null;
        this.maxNote = null;
        this.spacingChanged = new EventEmitter();
        this.upLineX = 0;
        this.downLineX = 0;
        this.displacedX = 0;
        this.noteStartX = 0;
    }
    add(noteGlyph, noteLine) {
        let info = new ScoreNoteGlyphInfo(noteGlyph, noteLine);
        this._infos.push(info);
        if (!this.minNote || this.minNote.line > info.line) {
            this.minNote = info;
        }
        if (!this.maxNote || this.maxNote.line < info.line) {
            this.maxNote = info;
        }
    }
    get hasTopOverflow() {
        return !!this.minNote && this.minNote.line <= 0;
    }
    get hasBottomOverflow() {
        return !!this.maxNote && this.maxNote.line > 8;
    }
    doLayout() {
        this._infos.sort((a, b) => {
            return b.line - a.line;
        });
        let displacedX = 0;
        let lastDisplaced = false;
        let lastLine = 0;
        let anyDisplaced = false;
        let direction = this.direction;
        let w = 0;
        for (let i = 0, j = this._infos.length; i < j; i++) {
            let g = this._infos[i].glyph;
            g.renderer = this.renderer;
            g.doLayout();
            let displace = false;
            if (i === 0) {
                displacedX = g.width;
            }
            else {
                // check if note needs to be repositioned
                if (Math.abs(lastLine - this._infos[i].line) <= 1) {
                    // reposition if needed
                    if (!lastDisplaced) {
                        displace = true;
                        g.x = displacedX;
                        anyDisplaced = true;
                        lastDisplaced = true; // let next iteration know we are displace now
                    }
                    else {
                        lastDisplaced = false; // let next iteration know that we weren't displaced now
                    }
                }
                else {
                    lastDisplaced = false;
                }
            }
            // for beat direction down we invert the displacement.
            // this means: displaced is on the left side of the stem and not displaced is right
            if (direction === BeamDirection.Down) {
                g.x = displace ? 0 : displacedX;
            }
            else {
                g.x = displace ? displacedX : 0;
            }
            g.x += this.noteStartX;
            lastLine = this._infos[i].line;
            w = Math.max(w, g.x + g.width);
        }
        if (anyDisplaced) {
            this._noteHeadPadding = 0;
            this.upLineX = displacedX;
            this.downLineX = displacedX;
        }
        else {
            this._noteHeadPadding = direction === BeamDirection.Down ? -displacedX : 0;
            w += this._noteHeadPadding;
            this.upLineX = w;
            this.downLineX = 0;
        }
        this.displacedX = displacedX;
        this.width = w;
    }
    paint(cx, cy, canvas) {
        cx += this.x;
        cy += this.y;
        // TODO: this method seems to be quite heavy according to the profiler, why?
        let scoreRenderer = this.renderer;
        // TODO: Take care of beateffects in overflow
        let linePadding = 3 * this.scale;
        let lineWidth = this.width - this.noteStartX + linePadding * 2;
        if (this.hasTopOverflow) {
            let color = canvas.color;
            canvas.color = scoreRenderer.resources.staffLineColor;
            let l = -2;
            while (l >= this.minNote.line) {
                // + 1 Because we want to place the line in the center of the note, not at the top
                let lY = cy + scoreRenderer.getScoreY(l);
                canvas.fillRect(cx - linePadding + this.noteStartX, lY, lineWidth, this.scale);
                l -= 2;
            }
            canvas.color = color;
        }
        if (this.hasBottomOverflow) {
            let color = canvas.color;
            canvas.color = scoreRenderer.resources.staffLineColor;
            let l = 10;
            while (l <= this.maxNote.line) {
                let lY = cy + scoreRenderer.getScoreY(l);
                canvas.fillRect(cx - linePadding + this.noteStartX, lY, lineWidth, this.scale);
                l += 2;
            }
            canvas.color = color;
        }
        let infos = this._infos;
        let x = cx + this._noteHeadPadding;
        for (let g of infos) {
            g.glyph.renderer = this.renderer;
            g.glyph.paint(x, cy, canvas);
        }
    }
}
//# sourceMappingURL=ScoreNoteChordGlyphBase.js.map