import { TextAlign } from '@src/platform/ICanvas';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { TextGlyph } from '@src/rendering/glyphs/TextGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class TapEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectTap;
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
        return beat.slap || beat.pop || beat.tap;
    }
    createNewGlyph(renderer, beat) {
        let res = renderer.resources;
        if (beat.slap) {
            return new TextGlyph(0, 0, 'S', res.effectFont, TextAlign.Left);
        }
        if (beat.pop) {
            return new TextGlyph(0, 0, 'P', res.effectFont, TextAlign.Left);
        }
        return new TextGlyph(0, 0, 'T', res.effectFont, TextAlign.Left);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=TapEffectInfo.js.map