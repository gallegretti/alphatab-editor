import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { NoteEffectInfoBase } from '@src/rendering/effects/NoteEffectInfoBase';
import { LineRangedGlyph } from '@src/rendering/glyphs/LineRangedGlyph';
import { NotationElement } from '@src/NotationSettings';
export class PalmMuteEffectInfo extends NoteEffectInfoBase {
    get notationElement() {
        return NotationElement.EffectPalmMute;
    }
    shouldCreateGlyphForNote(note) {
        return note.isPalmMute;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.GroupedOnBeat;
    }
    createNewGlyph(renderer, beat) {
        return new LineRangedGlyph('P.M.');
    }
    constructor() {
        super();
    }
}
//# sourceMappingURL=PalmMuteEffectInfo.js.map