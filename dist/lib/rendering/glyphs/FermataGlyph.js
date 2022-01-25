import { FermataType } from '@src/model/Fermata';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class FermataGlyph extends MusicFontGlyph {
    constructor(x, y, fermata) {
        super(x, y, 1, FermataGlyph.getSymbol(fermata));
    }
    static getSymbol(accentuation) {
        switch (accentuation) {
            case FermataType.Short:
                return MusicFontSymbol.FermataShortAbove;
            case FermataType.Medium:
                return MusicFontSymbol.FermataAbove;
            case FermataType.Long:
                return MusicFontSymbol.FermataLongAbove;
            default:
                return MusicFontSymbol.None;
        }
    }
    doLayout() {
        this.width = 23 * this.scale;
        this.height = 12 * this.scale;
    }
    paint(cx, cy, canvas) {
        super.paint(cx - this.width / 2, cy + this.height, canvas);
    }
}
//# sourceMappingURL=FermataGlyph.js.map