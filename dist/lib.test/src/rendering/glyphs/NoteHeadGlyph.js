import { Duration } from '@src/model/Duration';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class NoteHeadGlyph extends MusicFontGlyph {
    constructor(x, y, duration, isGrace) {
        super(x, y, isGrace ? NoteHeadGlyph.GraceScale : 1, NoteHeadGlyph.getSymbol(duration));
        this._isGrace = isGrace;
        this._duration = duration;
    }
    paint(cx, cy, canvas) {
        let offset = this._isGrace ? this.scale : 0;
        canvas.fillMusicFontSymbol(cx + this.x, cy + this.y + offset, this.glyphScale * this.scale, this.symbol, false);
    }
    doLayout() {
        let scale = (this._isGrace ? NoteHeadGlyph.GraceScale : 1) * this.scale;
        switch (this._duration) {
            case Duration.QuadrupleWhole:
                this.width = 14 * scale;
                break;
            case Duration.DoubleWhole:
                this.width = 14 * (this._isGrace ? NoteHeadGlyph.GraceScale : 1) * this.scale;
                break;
            case Duration.Whole:
                this.width = 14 * (this._isGrace ? NoteHeadGlyph.GraceScale : 1) * this.scale;
                break;
            default:
                this.width = NoteHeadGlyph.QuarterNoteHeadWidth * (this._isGrace ? NoteHeadGlyph.GraceScale : 1) * this.scale;
                break;
        }
        this.height = NoteHeadGlyph.NoteHeadHeight * scale;
    }
    static getSymbol(duration) {
        switch (duration) {
            case Duration.QuadrupleWhole:
                return MusicFontSymbol.NoteheadDoubleWholeSquare;
            case Duration.DoubleWhole:
                return MusicFontSymbol.NoteheadDoubleWhole;
            case Duration.Whole:
                return MusicFontSymbol.NoteheadWhole;
            case Duration.Half:
                return MusicFontSymbol.NoteheadHalf;
            default:
                return MusicFontSymbol.NoteheadBlack;
        }
    }
}
NoteHeadGlyph.GraceScale = 0.75;
NoteHeadGlyph.NoteHeadHeight = 8;
NoteHeadGlyph.QuarterNoteHeadWidth = 9;
//# sourceMappingURL=NoteHeadGlyph.js.map