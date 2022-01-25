import { VibratoType } from '@src/model/VibratoType';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { BeatVibratoGlyph } from '@src/rendering/glyphs/BeatVibratoGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class WideBeatVibratoEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectWideBeatVibrato;
    }
    get hideOnMultiTrack() {
        return false;
    }
    get canShareBand() {
        return true;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.GroupedOnBeatToEnd;
    }
    shouldCreateGlyph(settings, beat) {
        return beat.vibrato === VibratoType.Wide;
    }
    createNewGlyph(renderer, beat) {
        return new BeatVibratoGlyph(VibratoType.Wide);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=WideBeatVibratoEffectInfo.js.map