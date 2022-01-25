import { TextAlign } from '@src/platform/ICanvas';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { TextGlyph } from '@src/rendering/glyphs/TextGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class TextEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectText;
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
        return !!beat.text;
    }
    createNewGlyph(renderer, beat) {
        return new TextGlyph(0, 0, beat.text, renderer.resources.effectFont, TextAlign.Left);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=TextEffectInfo.js.map