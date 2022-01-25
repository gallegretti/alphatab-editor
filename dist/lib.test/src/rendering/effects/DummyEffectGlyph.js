import { Color } from '@src/model/Color';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export class DummyEffectGlyph extends EffectGlyph {
    constructor(x, y, w = 20, h = 20) {
        super(x, y);
        this._w = w;
        this._h = h;
    }
    doLayout() {
        this.width = this._w * this.scale;
        this.height = this._h * this.scale;
    }
    paint(cx, cy, canvas) {
        let c = canvas.color;
        canvas.color = Color.random();
        canvas.fillRect(cx + this.x, cy + this.y, this.width, this.height);
        canvas.color = c;
    }
}
//# sourceMappingURL=DummyEffectGlyph.js.map