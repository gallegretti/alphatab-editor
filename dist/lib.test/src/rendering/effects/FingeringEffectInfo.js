import { Fingers } from '@src/model/Fingers';
import { FingeringMode, NotationElement } from '@src/NotationSettings';
import { TextAlign } from '@src/platform/ICanvas';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { TextGlyph } from '@src/rendering/glyphs/TextGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { ModelUtils } from '@src/model/ModelUtils';
export class FingeringEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectFingering;
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
        if (beat.voice.index !== 0 ||
            beat.isRest ||
            (settings.notation.fingeringMode !== FingeringMode.SingleNoteEffectBand &&
                settings.notation.fingeringMode !== FingeringMode.SingleNoteEffectBandForcePiano)) {
            return false;
        }
        if (beat.notes.length !== 1) {
            return false;
        }
        return beat.notes[0].isFingering;
    }
    createNewGlyph(renderer, beat) {
        var _a;
        let finger = Fingers.Unknown;
        let isLeft = false;
        let note = beat.notes[0];
        if (note.leftHandFinger !== Fingers.Unknown) {
            finger = note.leftHandFinger;
            isLeft = true;
        }
        else if (note.rightHandFinger !== Fingers.Unknown) {
            finger = note.rightHandFinger;
        }
        let s = (_a = ModelUtils.fingerToString(renderer.settings, beat, finger, isLeft)) !== null && _a !== void 0 ? _a : "";
        return new TextGlyph(0, 0, s, renderer.resources.fingeringFont, TextAlign.Left);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=FingeringEffectInfo.js.map