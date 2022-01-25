import { TextAlign } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
export class RepeatCountGlyph extends Glyph {
    constructor(x, y, count) {
        super(x, y);
        this._count = 0;
        this._count = 0;
        this._count = count;
    }
    doLayout() {
        this.width = 0;
    }
    paint(cx, cy, canvas) {
        let res = this.renderer.resources;
        let oldAlign = canvas.textAlign;
        canvas.font = res.barNumberFont;
        canvas.textAlign = TextAlign.Right;
        let s = 'x' + this._count;
        let w = canvas.measureText(s) / 1.5;
        canvas.fillText(s, cx + this.x - w, cy + this.y);
        canvas.textAlign = oldAlign;
    }
}
//# sourceMappingURL=RepeatCountGlyph.js.map