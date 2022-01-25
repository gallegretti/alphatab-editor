import { TextAlign } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export class LyricsGlyph extends EffectGlyph {
    constructor(x, y, lines, font, textAlign = TextAlign.Center) {
        super(x, y);
        this._lines = lines;
        this.font = font;
        this.textAlign = textAlign;
    }
    doLayout() {
        super.doLayout();
        this.height = this.font.size * this._lines.length;
    }
    paint(cx, cy, canvas) {
        canvas.font = this.font;
        let old = canvas.textAlign;
        canvas.textAlign = this.textAlign;
        for (let i = 0; i < this._lines.length; i++) {
            if (this._lines[i]) {
                canvas.fillText(this._lines[i], cx + this.x, cy + this.y + i * this.font.size);
            }
        }
        canvas.textAlign = old;
    }
}
//# sourceMappingURL=LyricsGlyph.js.map