import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { NumberGlyph } from '@src/rendering/glyphs/NumberGlyph';
export class TimeSignatureGlyph extends GlyphGroup {
    constructor(x, y, numerator, denominator, isCommon) {
        super(x, y);
        this._numerator = 0;
        this._denominator = 0;
        this._numerator = numerator;
        this._denominator = denominator;
        this._isCommon = isCommon;
    }
    doLayout() {
        if (this._isCommon && this._numerator === 2 && this._denominator === 2) {
            let common = new MusicFontGlyph(0, 0, this.commonScale, MusicFontSymbol.TimeSigCutCommon);
            common.width = 14 * this.scale;
            this.addGlyph(common);
            super.doLayout();
        }
        else if (this._isCommon && this._numerator === 4 && this._denominator === 4) {
            let common = new MusicFontGlyph(0, 0, this.commonScale, MusicFontSymbol.TimeSigCommon);
            common.width = 14 * this.scale;
            this.addGlyph(common);
            super.doLayout();
        }
        else {
            const numberHeight = NumberGlyph.numberHeight * this.scale;
            let numerator = new NumberGlyph(0, -numberHeight / 2, this._numerator, this.numberScale);
            let denominator = new NumberGlyph(0, numberHeight / 2, this._denominator, this.numberScale);
            this.addGlyph(numerator);
            this.addGlyph(denominator);
            super.doLayout();
            for (let i = 0, j = this.glyphs.length; i < j; i++) {
                let g = this.glyphs[i];
                g.x = (this.width - g.width) / 2;
            }
        }
    }
}
//# sourceMappingURL=TimeSignatureGlyph.js.map