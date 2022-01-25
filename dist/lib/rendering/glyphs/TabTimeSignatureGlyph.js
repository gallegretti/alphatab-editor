import { TimeSignatureGlyph } from '@src/rendering/glyphs/TimeSignatureGlyph';
import { NoteHeadGlyph } from '@src/rendering/glyphs/NoteHeadGlyph';
export class TabTimeSignatureGlyph extends TimeSignatureGlyph {
    get commonScale() {
        return 1;
    }
    get numberScale() {
        let renderer = this.renderer;
        if (renderer.bar.staff.tuning.length <= 4) {
            return NoteHeadGlyph.GraceScale;
        }
        return 1;
    }
}
//# sourceMappingURL=TabTimeSignatureGlyph.js.map