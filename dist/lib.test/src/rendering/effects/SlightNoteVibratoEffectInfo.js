import { VibratoType } from '@src/model/VibratoType';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { NoteEffectInfoBase } from '@src/rendering/effects/NoteEffectInfoBase';
import { NoteVibratoGlyph } from '@src/rendering/glyphs/NoteVibratoGlyph';
import { NotationElement } from '@src/NotationSettings';
export class SlightNoteVibratoEffectInfo extends NoteEffectInfoBase {
    get notationElement() {
        return NotationElement.EffectSlightNoteVibrato;
    }
    shouldCreateGlyphForNote(note) {
        return (note.vibrato === VibratoType.Slight ||
            (note.isTieDestination && note.tieOrigin.vibrato === VibratoType.Slight));
    }
    get sizingMode() {
        return EffectBarGlyphSizing.GroupedOnBeatToEnd;
    }
    createNewGlyph(renderer, beat) {
        return new NoteVibratoGlyph(0, 0, VibratoType.Slight, 1.2);
    }
    constructor() {
        super();
    }
}
//# sourceMappingURL=SlightNoteVibratoEffectInfo.js.map