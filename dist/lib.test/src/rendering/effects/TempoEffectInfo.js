import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { TempoGlyph } from '@src/rendering/glyphs/TempoGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class TempoEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectTempo;
    }
    get hideOnMultiTrack() {
        return true;
    }
    get canShareBand() {
        return false;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.SinglePreBeat;
    }
    shouldCreateGlyph(settings, beat) {
        return (beat.voice.bar.staff.index === 0 &&
            beat.voice.index === 0 &&
            beat.index === 0 &&
            (!!beat.voice.bar.masterBar.tempoAutomation || beat.voice.bar.index === 0));
    }
    createNewGlyph(renderer, beat) {
        let tempo = 0;
        if (beat.voice.bar.masterBar.tempoAutomation) {
            tempo = beat.voice.bar.masterBar.tempoAutomation.value;
        }
        else {
            tempo = beat.voice.bar.staff.track.score.tempo;
        }
        return new TempoGlyph(0, 0, tempo);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=TempoEffectInfo.js.map