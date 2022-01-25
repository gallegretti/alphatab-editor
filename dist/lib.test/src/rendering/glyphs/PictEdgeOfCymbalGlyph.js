import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class PictEdgeOfCymbalGlyph extends MusicFontGlyph {
    constructor(x, y) {
        super(x, y, 0.5, MusicFontSymbol.PictEdgeOfCymbal);
    }
    doLayout() {
        this.width = 22 * this.scale;
        this.height = 15 * this.scale;
    }
    paint(cx, cy, canvas) {
        super.paint(cx - 3 * this.scale, cy + this.height, canvas);
    }
}
//# sourceMappingURL=PictEdgeOfCymbalGlyph.js.map