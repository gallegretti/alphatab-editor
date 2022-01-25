import { DynamicValue } from '@src/model/DynamicValue';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class DynamicsGlyph extends MusicFontGlyph {
    constructor(x, y, dynamics) {
        super(x, y, 0.6, DynamicsGlyph.getSymbol(dynamics));
    }
    doLayout() {
        super.doLayout();
        this.height = 17 * this.scale;
        this.y += this.height / 2;
    }
    static getSymbol(dynamics) {
        switch (dynamics) {
            case DynamicValue.PPP:
                return MusicFontSymbol.DynamicPPP;
            case DynamicValue.PP:
                return MusicFontSymbol.DynamicPP;
            case DynamicValue.P:
                return MusicFontSymbol.DynamicPiano;
            case DynamicValue.MP:
                return MusicFontSymbol.DynamicMP;
            case DynamicValue.MF:
                return MusicFontSymbol.DynamicMF;
            case DynamicValue.F:
                return MusicFontSymbol.DynamicForte;
            case DynamicValue.FF:
                return MusicFontSymbol.DynamicFF;
            case DynamicValue.FFF:
                return MusicFontSymbol.DynamicFFF;
            default:
                return MusicFontSymbol.None;
        }
    }
}
//# sourceMappingURL=DynamicsGlyph.js.map