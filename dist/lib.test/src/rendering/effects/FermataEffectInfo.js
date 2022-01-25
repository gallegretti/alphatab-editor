import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { FermataGlyph } from '@src/rendering/glyphs/FermataGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class FermataEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectFermata;
    }
    get hideOnMultiTrack() {
        return false;
    }
    get canShareBand() {
        return false;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.SingleOnBeat;
    }
    shouldCreateGlyph(settings, beat) {
        return beat.voice.index === 0 && !!beat.fermata;
    }
    createNewGlyph(renderer, beat) {
        return new FermataGlyph(0, 0, beat.fermata.type);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=FermataEffectInfo.js.map