import { AccentuationType } from '@src/model/AccentuationType';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class AccentuationGlyph extends MusicFontGlyph {
    constructor(x, y, accentuation) {
        super(x, y, 1, AccentuationGlyph.getSymbol(accentuation));
    }
    static getSymbol(accentuation) {
        switch (accentuation) {
            case AccentuationType.None:
                return MusicFontSymbol.None;
            case AccentuationType.Normal:
                return MusicFontSymbol.ArticAccentAbove;
            case AccentuationType.Heavy:
                return MusicFontSymbol.ArticMarcatoAbove;
            default:
                return MusicFontSymbol.None;
        }
    }
    doLayout() {
        this.width = 9 * this.scale;
        this.height = 9 * this.scale;
    }
    paint(cx, cy, canvas) {
        super.paint(cx - 2 * this.scale, cy + this.height, canvas);
    }
}
//# sourceMappingURL=AccentuationGlyph.js.map