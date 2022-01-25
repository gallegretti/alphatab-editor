import { TripletFeel } from '@src/model/TripletFeel';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { TripletFeelGlyph } from '@src/rendering/glyphs/TripletFeelGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class TripletFeelEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectTripletFeel;
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
        return (beat.index === 0 &&
            ((beat.voice.bar.masterBar.index === 0 &&
                beat.voice.bar.masterBar.tripletFeel !== TripletFeel.NoTripletFeel) ||
                (beat.voice.bar.masterBar.index > 0 &&
                    beat.voice.bar.masterBar.tripletFeel !== beat.voice.bar.masterBar.previousMasterBar.tripletFeel)));
    }
    createNewGlyph(renderer, beat) {
        return new TripletFeelGlyph(beat.voice.bar.masterBar.tripletFeel);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=TripletFeelEffectInfo.js.map