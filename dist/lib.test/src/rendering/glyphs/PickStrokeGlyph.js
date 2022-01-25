import { PickStroke } from '@src/model/PickStroke';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { NoteHeadGlyph } from '@src/rendering/glyphs/NoteHeadGlyph';
export class PickStrokeGlyph extends MusicFontGlyph {
    constructor(x, y, pickStroke) {
        super(x, y, NoteHeadGlyph.GraceScale, PickStrokeGlyph.getSymbol(pickStroke));
    }
    doLayout() {
        this.width = 9 * this.scale;
        this.height = 13 * this.scale;
    }
    paint(cx, cy, canvas) {
        super.paint(cx, cy + this.height, canvas);
    }
    static getSymbol(pickStroke) {
        switch (pickStroke) {
            case PickStroke.Up:
                return MusicFontSymbol.StringsUpBow;
            case PickStroke.Down:
                return MusicFontSymbol.StringsDownBow;
            default:
                return MusicFontSymbol.None;
        }
    }
}
//# sourceMappingURL=PickStrokeGlyph.js.map