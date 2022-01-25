import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { NoteEffectInfoBase } from '@src/rendering/effects/NoteEffectInfoBase';
import { TrillGlyph } from '@src/rendering/glyphs/TrillGlyph';
import { NotationElement } from '@src/NotationSettings';
export class TrillEffectInfo extends NoteEffectInfoBase {
    get notationElement() {
        return NotationElement.EffectTrill;
    }
    shouldCreateGlyphForNote(note) {
        return note.isTrill;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.SingleOnBeat;
    }
    createNewGlyph(renderer, beat) {
        return new TrillGlyph(0, 0);
    }
}
//# sourceMappingURL=TrillEffectInfo.js.map