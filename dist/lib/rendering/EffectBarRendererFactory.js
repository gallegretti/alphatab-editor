import { BarRendererFactory } from '@src/rendering/BarRendererFactory';
import { EffectBarRenderer } from '@src/rendering/EffectBarRenderer';
export class EffectBarRendererFactory extends BarRendererFactory {
    constructor(staffId, infos) {
        super();
        this._infos = infos;
        this._staffId = staffId;
        this.isInAccolade = false;
        this.isRelevantForBoundsLookup = false;
    }
    get staffId() {
        return this._staffId;
    }
    create(renderer, bar) {
        return new EffectBarRenderer(renderer, bar, this._infos.filter(i => renderer.settings.notation.isNotationElementVisible(i.notationElement)));
    }
}
//# sourceMappingURL=EffectBarRendererFactory.js.map