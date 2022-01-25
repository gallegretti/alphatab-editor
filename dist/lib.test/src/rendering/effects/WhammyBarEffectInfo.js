import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { LineRangedGlyph } from '@src/rendering/glyphs/LineRangedGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class WhammyBarEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectWhammyBar;
    }
    get hideOnMultiTrack() {
        return false;
    }
    get canShareBand() {
        return false;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.GroupedOnBeat;
    }
    shouldCreateGlyph(settings, beat) {
        return beat.hasWhammyBar;
    }
    createNewGlyph(renderer, beat) {
        return new LineRangedGlyph('w/bar');
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=WhammyBarEffectInfo.js.map