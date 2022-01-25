import { VibratoType } from '@src/model/VibratoType';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { NoteEffectInfoBase } from '@src/rendering/effects/NoteEffectInfoBase';
import { NoteVibratoGlyph } from '@src/rendering/glyphs/NoteVibratoGlyph';
import { NotationElement } from '@src/NotationSettings';
export class WideNoteVibratoEffectInfo extends NoteEffectInfoBase {
    get notationElement() {
        return NotationElement.EffectWideNoteVibrato;
    }
    shouldCreateGlyphForNote(note) {
        return (note.vibrato === VibratoType.Wide || (note.isTieDestination && note.tieOrigin.vibrato === VibratoType.Wide));
    }
    get sizingMode() {
        return EffectBarGlyphSizing.GroupedOnBeatToEnd;
    }
    createNewGlyph(renderer, beat) {
        return new NoteVibratoGlyph(0, 0, VibratoType.Wide, 1.2);
    }
}
//# sourceMappingURL=WideNoteVibratoEffectInfo.js.map