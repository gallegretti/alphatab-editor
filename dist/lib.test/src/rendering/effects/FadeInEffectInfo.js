import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { FadeInGlyph } from '@src/rendering/glyphs/FadeInGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class FadeInEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectFadeIn;
    }
    get hideOnMultiTrack() {
        return false;
    }
    get canShareBand() {
        return true;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.SingleOnBeat;
    }
    shouldCreateGlyph(settings, beat) {
        return beat.fadeIn;
    }
    createNewGlyph(renderer, beat) {
        return new FadeInGlyph();
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=FadeInEffectInfo.js.map