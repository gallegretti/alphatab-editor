import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { AlternateEndingsGlyph } from '@src/rendering/glyphs/AlternateEndingsGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class AlternateEndingsEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectAlternateEndings;
    }
    get hideOnMultiTrack() {
        return true;
    }
    get canShareBand() {
        return false;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.FullBar;
    }
    shouldCreateGlyph(settings, beat) {
        return beat.voice.index === 0 && beat.index === 0 && beat.voice.bar.masterBar.alternateEndings !== 0;
    }
    createNewGlyph(renderer, beat) {
        return new AlternateEndingsGlyph(0, 0, beat.voice.bar.masterBar.alternateEndings);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=AlternateEndingsEffectInfo.js.map