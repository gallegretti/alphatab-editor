import { Glyph } from '@src/rendering/glyphs/Glyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class TabClefGlyph extends Glyph {
    constructor(x, y) {
        super(x, y);
    }
    doLayout() {
        this.width = 28 * this.scale;
    }
    paint(cx, cy, canvas) {
        let strings = this.renderer.bar.staff.tuning.length;
        let symbol = strings <= 4 ? MusicFontSymbol.FourStringTabClef : MusicFontSymbol.SixStringTabClef;
        let scale = strings <= 4 ? strings / 4.5 : strings / 6.5;
        canvas.fillMusicFontSymbol(cx + this.x + 5 * this.scale, cy + this.y, scale * this.scale, symbol, false);
    }
}
//# sourceMappingURL=TabClefGlyph.js.map