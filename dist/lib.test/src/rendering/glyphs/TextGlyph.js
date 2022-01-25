import { TextAlign } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export class TextGlyph extends EffectGlyph {
    constructor(x, y, text, font, textAlign = TextAlign.Left) {
        super(x, y);
        this._lines = text.split('\n');
        this.font = font;
        this.textAlign = textAlign;
    }
    doLayout() {
        super.doLayout();
        this.height = this.font.size * this._lines.length;
    }
    paint(cx, cy, canvas) {
        let color = canvas.color;
        canvas.color = color;
        canvas.font = this.font;
        let old = canvas.textAlign;
        canvas.textAlign = this.textAlign;
        let y = cy + this.y;
        for (let line of this._lines) {
            canvas.fillText(line, cx + this.x, y);
            y += this.font.size;
        }
        canvas.textAlign = old;
    }
}
//# sourceMappingURL=TextGlyph.js.map