import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class TrillGlyph extends EffectGlyph {
    constructor(x, y) {
        super(x, y);
    }
    doLayout() {
        super.doLayout();
        this.height = 20 * this.scale;
    }
    paint(cx, cy, canvas) {
        let res = this.renderer.resources;
        canvas.font = res.markerFont;
        let textw = canvas.measureText('tr');
        canvas.fillText('tr', cx + this.x, cy + this.y + canvas.font.size / 2);
        let startX = textw + 3 * this.scale;
        let endX = this.width - startX;
        let waveScale = 1.2;
        let step = 11 * this.scale * waveScale;
        let loops = Math.max(1, (endX - startX) / step);
        let loopX = startX;
        let loopY = cy + this.y + this.height;
        for (let i = 0; i < loops; i++) {
            canvas.fillMusicFontSymbol(cx + this.x + loopX, loopY, waveScale, MusicFontSymbol.WiggleTrill, false);
            loopX += step;
        }
    }
}
//# sourceMappingURL=TrillGlyph.js.map