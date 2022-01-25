import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export class FadeInGlyph extends EffectGlyph {
    doLayout() {
        super.doLayout();
        this.height = 17 * this.scale;
    }
    paint(cx, cy, canvas) {
        let size = 6 * this.scale;
        let width = Math.max(this.width, 14 * this.scale);
        let offset = this.height / 2;
        canvas.beginPath();
        canvas.moveTo(cx + this.x, cy + this.y + offset);
        canvas.quadraticCurveTo(cx + this.x + width / 2, cy + this.y + offset, cx + this.x + width, cy + this.y + offset - size);
        canvas.moveTo(cx + this.x, cy + this.y + offset);
        canvas.quadraticCurveTo(cx + this.x + width / 2, cy + this.y + offset, cx + this.x + width, cy + this.y + offset + size);
        canvas.stroke();
    }
}
//# sourceMappingURL=FadeInGlyph.js.map