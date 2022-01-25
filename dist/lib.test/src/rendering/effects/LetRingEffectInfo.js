import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { LineRangedGlyph } from '@src/rendering/glyphs/LineRangedGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class LetRingEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectLetRing;
    }
    get canShareBand() {
        return false;
    }
    get hideOnMultiTrack() {
        return false;
    }
    shouldCreateGlyph(settings, beat) {
        return beat.isLetRing;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.GroupedOnBeat;
    }
    createNewGlyph(renderer, beat) {
        return new LineRangedGlyph('LetRing');
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=LetRingEffectInfo.js.map