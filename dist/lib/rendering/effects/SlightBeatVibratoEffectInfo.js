import { VibratoType } from '@src/model/VibratoType';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { BeatVibratoGlyph } from '@src/rendering/glyphs/BeatVibratoGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class SlightBeatVibratoEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectSlightBeatVibrato;
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
        return beat.vibrato === VibratoType.Slight;
    }
    createNewGlyph(renderer, beat) {
        return new BeatVibratoGlyph(VibratoType.Slight);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=SlightBeatVibratoEffectInfo.js.map