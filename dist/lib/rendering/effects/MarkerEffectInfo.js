import { TextAlign } from '@src/platform/ICanvas';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { TextGlyph } from '@src/rendering/glyphs/TextGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class MarkerEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectMarker;
    }
    get hideOnMultiTrack() {
        return true;
    }
    get canShareBand() {
        return true;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.SinglePreBeat;
    }
    shouldCreateGlyph(settings, beat) {
        return (beat.voice.bar.staff.index === 0 &&
            beat.voice.index === 0 &&
            beat.index === 0 &&
            beat.voice.bar.masterBar.isSectionStart);
    }
    createNewGlyph(renderer, beat) {
        return new TextGlyph(0, 0, !beat.voice.bar.masterBar.section.marker
            ? beat.voice.bar.masterBar.section.text
            : '[' + beat.voice.bar.masterBar.section.marker + '] ' + beat.voice.bar.masterBar.section.text, renderer.resources.markerFont, TextAlign.Left);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=MarkerEffectInfo.js.map