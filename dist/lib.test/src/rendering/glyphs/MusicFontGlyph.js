import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export class MusicFontGlyph extends EffectGlyph {
    constructor(x, y, glyphScale, symbol) {
        super(x, y);
        this.glyphScale = 0;
        this.glyphScale = glyphScale;
        this.symbol = symbol;
    }
    paint(cx, cy, canvas) {
        canvas.fillMusicFontSymbol(cx + this.x, cy + this.y, this.glyphScale * this.scale, this.symbol, false);
    }
}
//# sourceMappingURL=MusicFontGlyph.js.map