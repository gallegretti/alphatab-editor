import { TextBaseline } from '@src/platform/ICanvas';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { NoteHeadGlyph } from './NoteHeadGlyph';
export class PercussionNoteHeadGlyph extends MusicFontGlyph {
    constructor(x, y, articulation, duration, isGrace) {
        super(x, y, isGrace ? NoteHeadGlyph.GraceScale : 1, articulation.getSymbol(duration));
        this._isGrace = isGrace;
        this._articulation = articulation;
    }
    paint(cx, cy, canvas) {
        let offset = this._isGrace ? this.scale : 0;
        canvas.fillMusicFontSymbol(cx + this.x, cy + this.y + offset, this.glyphScale * this.scale, this.symbol, false);
        if (this._articulation.techniqueSymbol !== MusicFontSymbol.None && this._articulation.techniqueSymbolPlacement === TextBaseline.Middle) {
            canvas.fillMusicFontSymbol(cx + this.x, cy + this.y + offset, this.glyphScale * this.scale, this._articulation.techniqueSymbol, false);
        }
    }
    doLayout() {
        let scale = (this._isGrace ? NoteHeadGlyph.GraceScale : 1) * this.scale;
        switch (this.symbol) {
            case MusicFontSymbol.NoteheadWhole:
                this.width = 14;
                break;
            case MusicFontSymbol.NoteheadCircleX:
            case MusicFontSymbol.NoteheadDiamondWhite:
                this.width = 9;
                break;
            case MusicFontSymbol.NoteheadHeavyXHat:
            case MusicFontSymbol.NoteheadHeavyX:
                this.width = 13;
                break;
            default:
                this.width = 10;
                break;
        }
        this.width = this.width * (this._isGrace ? NoteHeadGlyph.GraceScale : 1) * this.scale;
        this.height = NoteHeadGlyph.NoteHeadHeight * scale;
    }
}
//# sourceMappingURL=PercussionNoteHeadGlyph.js.map