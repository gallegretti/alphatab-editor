import { Ottavia } from '@src/model/Ottavia';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { OttavaGlyph } from '@src/rendering/glyphs/OttavaGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class OttaviaEffectInfo extends EffectBarRendererInfo {
    constructor(aboveStaff) {
        super();
        this._aboveStaff = aboveStaff;
    }
    get effectId() {
        return 'ottavia-' + (this._aboveStaff ? 'above' : 'below');
    }
    get notationElement() {
        return NotationElement.EffectOttavia;
    }
    get hideOnMultiTrack() {
        return false;
    }
    get canShareBand() {
        return true;
    }
    get sizingMode() {
        return EffectBarGlyphSizing.GroupedOnBeat;
    }
    shouldCreateGlyph(settings, beat) {
        switch (beat.ottava) {
            case Ottavia._15ma:
                return this._aboveStaff;
            case Ottavia._8va:
                return this._aboveStaff;
            case Ottavia._8vb:
                return !this._aboveStaff;
            case Ottavia._15mb:
                return !this._aboveStaff;
        }
        return false;
    }
    createNewGlyph(renderer, beat) {
        return new OttavaGlyph(beat.ottava, this._aboveStaff);
    }
    canExpand(from, to) {
        return from.ottava === to.ottava;
    }
}
//# sourceMappingURL=OttaviaEffectInfo.js.map