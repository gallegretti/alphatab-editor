import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { DynamicsGlyph } from '@src/rendering/glyphs/DynamicsGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
import { GraceType } from '@src/model/GraceType';
export class DynamicsEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectDynamics;
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
        return this.internalShouldCreateGlyph(beat);
    }
    internalShouldCreateGlyph(beat) {
        if (beat.voice.bar.staff.track.score.stylesheet.hideDynamics || beat.isEmpty || beat.voice.isEmpty || beat.isRest || beat.graceType !== GraceType.None) {
            return false;
        }
        let previousBeat = this.getPreviousDynamicsBeat(beat);
        let show = (beat.voice.index === 0 && !previousBeat) ||
            (beat.dynamics !== (previousBeat === null || previousBeat === void 0 ? void 0 : previousBeat.dynamics));
        // ensure we do not show duplicate dynamics
        if (show && beat.voice.index > 0) {
            for (let voice of beat.voice.bar.voices) {
                if (voice.index < beat.voice.index) {
                    let beatAtSamePos = voice.getBeatAtPlaybackStart(beat.playbackStart);
                    if (beatAtSamePos &&
                        beat.dynamics === beatAtSamePos.dynamics &&
                        this.internalShouldCreateGlyph(beatAtSamePos)) {
                        show = false;
                    }
                }
            }
        }
        return show;
    }
    getPreviousDynamicsBeat(beat) {
        let previousBeat = beat.previousBeat;
        while (previousBeat != null) {
            if (!previousBeat.isRest && previousBeat.graceType === GraceType.None) {
                return previousBeat;
            }
            previousBeat = previousBeat.previousBeat;
        }
        return null;
    }
    createNewGlyph(renderer, beat) {
        return new DynamicsGlyph(0, 0, beat.dynamics);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=DynamicsEffectInfo.js.map