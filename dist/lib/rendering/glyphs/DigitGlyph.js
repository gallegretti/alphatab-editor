import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class DigitGlyph extends MusicFontGlyph {
    constructor(x, y, digit, scale) {
        super(x, y, scale, DigitGlyph.getSymbol(digit));
        this._digit = 0;
        this._scale = 0;
        this._digit = digit;
        this._scale = scale;
    }
    doLayout() {
        this.width = this.getDigitWidth(this._digit) * this.scale * this._scale;
    }
    getDigitWidth(digit) {
        switch (digit) {
            case 0:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                return 14;
            case 1:
                return 10;
            default:
                return 0;
        }
    }
    static getSymbol(digit) {
        switch (digit) {
            case 0:
                return MusicFontSymbol.TimeSig0;
            case 1:
                return MusicFontSymbol.TimeSig1;
            case 2:
                return MusicFontSymbol.TimeSig2;
            case 3:
                return MusicFontSymbol.TimeSig3;
            case 4:
                return MusicFontSymbol.TimeSig4;
            case 5:
                return MusicFontSymbol.TimeSig5;
            case 6:
                return MusicFontSymbol.TimeSig6;
            case 7:
                return MusicFontSymbol.TimeSig7;
            case 8:
                return MusicFontSymbol.TimeSig8;
            case 9:
                return MusicFontSymbol.TimeSig9;
            default:
                return MusicFontSymbol.None;
        }
    }
}
//# sourceMappingURL=DigitGlyph.js.map