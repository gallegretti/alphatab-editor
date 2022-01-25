import { TextAlign } from '@src/platform/ICanvas';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { TextGlyph } from '@src/rendering/glyphs/TextGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class ChordsEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectChordNames;
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
        return beat.hasChord;
    }
    createNewGlyph(renderer, beat) {
        return new TextGlyph(0, 0, beat.chord.name, renderer.resources.effectFont, TextAlign.Center);
    }
    canExpand(from, to) {
        return false;
    }
}
//# sourceMappingURL=ChordsEffectInfo.js.map