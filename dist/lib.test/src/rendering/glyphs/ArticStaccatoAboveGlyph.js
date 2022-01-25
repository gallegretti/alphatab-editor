import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { NoteHeadGlyph } from '@src/rendering/glyphs/NoteHeadGlyph';
export class ArticStaccatoAboveGlyph extends MusicFontGlyph {
    constructor(x, y) {
        super(x, y, NoteHeadGlyph.GraceScale, MusicFontSymbol.ArticStaccatoAbove);
    }
    doLayout() {
        this.width = NoteHeadGlyph.QuarterNoteHeadWidth * this.scale;
        this.height = 7 * this.scale;
    }
    paint(cx, cy, canvas) {
        super.paint(cx + 3 * this.scale, cy + 5 * this.scale, canvas);
    }
}
//# sourceMappingURL=ArticStaccatoAboveGlyph.js.map