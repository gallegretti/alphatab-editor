import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { NotationElement } from '@src/NotationSettings';
import { NoteEffectInfoBase } from './NoteEffectInfoBase';
import { LeftHandTapGlyph } from '@src/rendering/glyphs/LeftHandTapGlyph';
export class LeftHandTapEffectInfo extends NoteEffectInfoBase {
    get notationElement() {
        return NotationElement.EffectTap;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.SingleOnBeat;
    }
    shouldCreateGlyphForNote(note) {
        return note.isLeftHandTapped;
    }
    createNewGlyph(renderer, beat) {
        return new LeftHandTapGlyph();
    }
}
//# sourceMappingURL=LeftHandTapEffectInfo.js.map