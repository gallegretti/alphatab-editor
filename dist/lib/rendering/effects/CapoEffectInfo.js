import { TextAlign } from '@src/platform/ICanvas';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { TextGlyph } from '@src/rendering/glyphs/TextGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class CapoEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectCapo;
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
        return beat.index === 0 && beat.voice.bar.index === 0 && beat.voice.bar.staff.capo !== 0;
    }
    createNewGlyph(renderer, beat) {
        return new TextGlyph(0, 0, 'Capo. fret ' + beat.voice.bar.staff.capo, renderer.resources.effectFont, TextAlign.Left);
    }
    canExpand(from, to) {
        return false;
    }
}
//# sourceMappingURL=CapoEffectInfo.js.map