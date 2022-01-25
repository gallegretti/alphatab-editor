import { CrescendoType } from '@src/model/CrescendoType';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { CrescendoGlyph } from '@src/rendering/glyphs/CrescendoGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class CrescendoEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectCrescendo;
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
        return beat.crescendo !== CrescendoType.None;
    }
    createNewGlyph(renderer, beat) {
        return new CrescendoGlyph(0, 0, beat.crescendo);
    }
    canExpand(from, to) {
        return from.crescendo === to.crescendo;
    }
}
//# sourceMappingURL=CrescendoEffectInfo.js.map