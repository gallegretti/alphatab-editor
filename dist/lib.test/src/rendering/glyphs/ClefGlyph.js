import { Clef } from '@src/model/Clef';
import { Ottavia } from '@src/model/Ottavia';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class ClefGlyph extends MusicFontGlyph {
    constructor(x, y, clef, clefOttava) {
        super(x, y, 1, ClefGlyph.getSymbol(clef));
        this._clef = clef;
        this._clefOttava = clefOttava;
    }
    doLayout() {
        switch (this._clef) {
            case Clef.Neutral:
                this.width = 15 * this.scale;
                break;
            case Clef.C3:
            case Clef.C4:
            case Clef.F4:
            case Clef.G2:
                this.width = 28 * this.scale;
                break;
        }
    }
    static getSymbol(clef) {
        switch (clef) {
            case Clef.Neutral:
                return MusicFontSymbol.UnpitchedPercussionClef1;
            case Clef.C3:
                return MusicFontSymbol.CClef;
            case Clef.C4:
                return MusicFontSymbol.CClef;
            case Clef.F4:
                return MusicFontSymbol.FClef;
            case Clef.G2:
                return MusicFontSymbol.GClef;
            default:
                return MusicFontSymbol.None;
        }
    }
    paint(cx, cy, canvas) {
        super.paint(cx, cy, canvas);
        let numberGlyph;
        let top = false;
        switch (this._clefOttava) {
            case Ottavia._15ma:
                numberGlyph = new MusicFontGlyph(-4 * this.scale, 0, 0.5, MusicFontSymbol.Quindicesima);
                top = true;
                break;
            case Ottavia._8va:
                numberGlyph = new MusicFontGlyph(-2 * this.scale, 0, 0.5, MusicFontSymbol.Ottava);
                top = true;
                break;
            case Ottavia._8vb:
                numberGlyph = new MusicFontGlyph(-6 * this.scale, 0, 0.5, MusicFontSymbol.Ottava);
                break;
            case Ottavia._15mb:
                numberGlyph = new MusicFontGlyph(-8 * this.scale, 0, 0.5, MusicFontSymbol.Quindicesima);
                break;
            default:
                return;
        }
        let offsetY = 0;
        let offsetX = 0;
        switch (this._clef) {
            case Clef.Neutral:
                offsetY = top ? -12 : 15;
                offsetX = 0;
                break;
            case Clef.C3:
                offsetY = top ? -19 : 27;
                offsetX = 0;
                break;
            case Clef.C4:
                offsetY = top ? -19 : 27;
                offsetX = 0;
                break;
            case Clef.F4:
                offsetY = top ? -9 : 27;
                offsetX = -4;
                break;
            case Clef.G2:
                offsetY = top ? -37 : 30;
                offsetX = 0;
                break;
            default:
                return;
        }
        numberGlyph.renderer = this.renderer;
        numberGlyph.doLayout();
        let x = this.width / 2;
        numberGlyph.paint(cx + this.x + x + offsetX * this.scale, cy + this.y + offsetY * this.scale, canvas);
    }
}
//# sourceMappingURL=ClefGlyph.js.map