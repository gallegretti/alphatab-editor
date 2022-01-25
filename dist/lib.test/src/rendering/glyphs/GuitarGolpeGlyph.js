import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { NoteHeadGlyph } from '@src/rendering/glyphs/NoteHeadGlyph';
export class GuitarGolpeGlyph extends MusicFontGlyph {
    constructor(x, y) {
        super(x, y, NoteHeadGlyph.GraceScale, MusicFontSymbol.GuitarGolpe);
    }
    doLayout() {
        this.width = 9 * this.scale;
        this.height = 10 * this.scale;
    }
    paint(cx, cy, canvas) {
        super.paint(cx, cy + this.height, canvas);
    }
}
//# sourceMappingURL=GuitarGolpeGlyph.js.map