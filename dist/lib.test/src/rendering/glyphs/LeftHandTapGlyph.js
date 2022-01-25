import { TextAlign } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export class LeftHandTapGlyph extends EffectGlyph {
    constructor() {
        super(0, 0);
    }
    doLayout() {
        super.doLayout();
        const font = this.renderer.resources.effectFont;
        this.height = font.size + LeftHandTapGlyph.Padding * this.scale;
    }
    paint(cx, cy, canvas) {
        let res = this.renderer.resources;
        canvas.font = res.effectFont;
        let old = canvas.textAlign;
        canvas.textAlign = TextAlign.Center;
        canvas.fillText('T', cx + this.x, cy + this.y + canvas.font.size / 2);
        canvas.textAlign = old;
        canvas.strokeCircle(cx + this.x, cy + this.y + canvas.font.size / 2 + (LeftHandTapGlyph.Padding - 1) * this.scale, canvas.font.size / 1.6);
    }
}
LeftHandTapGlyph.Padding = 4;
//# sourceMappingURL=LeftHandTapGlyph.js.map