import { HarmonicType } from '@src/model/HarmonicType';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { NoteEffectInfoBase } from '@src/rendering/effects/NoteEffectInfoBase';
import { LineRangedGlyph } from '@src/rendering/glyphs/LineRangedGlyph';
import { NotationElement } from '@src/NotationSettings';
export class HarmonicsEffectInfo extends NoteEffectInfoBase {
    constructor(harmonicType) {
        super();
        this._beat = null;
        this._harmonicType = harmonicType;
        switch (harmonicType) {
            case HarmonicType.None:
                this._effectId = 'harmonics-none';
                break;
            case HarmonicType.Natural:
                this._effectId = 'harmonics-natural';
                break;
            case HarmonicType.Artificial:
                this._effectId = 'harmonics-artificial';
                break;
            case HarmonicType.Pinch:
                this._effectId = 'harmonics-pinch';
                break;
            case HarmonicType.Tap:
                this._effectId = 'harmonics-tap';
                break;
            case HarmonicType.Semi:
                this._effectId = 'harmonics-semi';
                break;
            case HarmonicType.Feedback:
                this._effectId = 'harmonics-feedback';
                break;
            default:
                this._effectId = '';
                break;
        }
    }
    get effectId() {
        return this._effectId;
    }
    get notationElement() {
        return NotationElement.EffectHarmonics;
    }
    shouldCreateGlyphForNote(note) {
        if (!note.isHarmonic || note.harmonicType !== this._harmonicType) {
            return false;
        }
        if (note.beat !== this._beat) {
            this._beat = note.beat;
        }
        return true;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.GroupedOnBeat;
    }
    createNewGlyph(renderer, beat) {
        return new LineRangedGlyph(HarmonicsEffectInfo.harmonicToString(this._harmonicType));
    }
    static harmonicToString(type) {
        switch (type) {
            case HarmonicType.Natural:
                return 'N.H.';
            case HarmonicType.Artificial:
                return 'A.H.';
            case HarmonicType.Pinch:
                return 'P.H.';
            case HarmonicType.Tap:
                return 'T.H.';
            case HarmonicType.Semi:
                return 'S.H.';
            case HarmonicType.Feedback:
                return 'Fdbk.';
        }
        return '';
    }
}
//# sourceMappingURL=HarmonicsEffectInfo.js.map