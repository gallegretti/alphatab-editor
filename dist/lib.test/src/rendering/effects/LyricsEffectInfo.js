import { TextAlign } from '@src/platform/ICanvas';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { LyricsGlyph } from '@src/rendering/glyphs/LyricsGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class LyricsEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectLyrics;
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
        return !!beat.lyrics;
    }
    createNewGlyph(renderer, beat) {
        return new LyricsGlyph(0, 0, beat.lyrics, renderer.resources.effectFont, TextAlign.Center);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=LyricsEffectInfo.js.map