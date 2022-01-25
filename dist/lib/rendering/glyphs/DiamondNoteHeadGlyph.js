import { Duration } from '@src/model/Duration';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { NoteHeadGlyph } from '@src/rendering/glyphs/NoteHeadGlyph';
export class DiamondNoteHeadGlyph extends MusicFontGlyph {
    constructor(x, y, duration, isGrace) {
        super(x, y, isGrace ? NoteHeadGlyph.GraceScale : 1, DiamondNoteHeadGlyph.getSymbol(duration));
        this._isGrace = isGrace;
    }
    static getSymbol(duration) {
        switch (duration) {
            case Duration.QuadrupleWhole:
            case Duration.DoubleWhole:
            case Duration.Whole:
            case Duration.Half:
                return MusicFontSymbol.NoteheadDiamondWhiteWide;
            default:
                return MusicFontSymbol.NoteheadDiamondBlackWide;
        }
    }
    doLayout() {
        this.width = 9 * (this._isGrace ? NoteHeadGlyph.GraceScale : 1) * this.scale;
        this.height = NoteHeadGlyph.NoteHeadHeight * this.scale;
    }
}
//# sourceMappingURL=DiamondNoteHeadGlyph.js.map