import { SlideOutType } from '@src/model/SlideOutType';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { NoteEffectInfoBase } from '@src/rendering/effects/NoteEffectInfoBase';
import { LineRangedGlyph } from '@src/rendering/glyphs/LineRangedGlyph';
import { NotationElement } from '@src/NotationSettings';
export class PickSlideEffectInfo extends NoteEffectInfoBase {
    get notationElement() {
        return NotationElement.EffectPickSlide;
    }
    shouldCreateGlyphForNote(note) {
        return note.slideOutType === SlideOutType.PickSlideDown || note.slideOutType === SlideOutType.PickSlideUp;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.GroupedOnBeat;
    }
    createNewGlyph(renderer, beat) {
        return new LineRangedGlyph('P.S.');
    }
    constructor() {
        super();
    }
}
//# sourceMappingURL=PickSlideEffectInfo.js.map