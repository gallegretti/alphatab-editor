import { Duration } from '@src/model/Duration';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class TremoloPickingGlyph extends MusicFontGlyph {
    constructor(x, y, duration) {
        super(x, y, 1, TremoloPickingGlyph.getSymbol(duration));
    }
    doLayout() {
        this.width = 12 * this.scale;
    }
    static getSymbol(duration) {
        switch (duration) {
            case Duration.ThirtySecond:
                return MusicFontSymbol.Tremolo3;
            case Duration.Sixteenth:
                return MusicFontSymbol.Tremolo2;
            case Duration.Eighth:
                return MusicFontSymbol.Tremolo1;
            default:
                return MusicFontSymbol.None;
        }
    }
}
//# sourceMappingURL=TremoloPickingGlyph.js.map