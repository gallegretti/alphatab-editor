import { PickStroke } from '@src/model/PickStroke';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { PickStrokeGlyph } from '@src/rendering/glyphs/PickStrokeGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { NotationElement } from '@src/NotationSettings';
export class PickStrokeEffectInfo extends EffectBarRendererInfo {
    get notationElement() {
        return NotationElement.EffectPickStroke;
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
        return beat.pickStroke !== PickStroke.None;
    }
    createNewGlyph(renderer, beat) {
        return new PickStrokeGlyph(0, 0, beat.pickStroke);
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=PickStrokeEffectInfo.js.map