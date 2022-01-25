import { EffectBandSlot } from '@src/rendering/EffectBandSlot';
export class EffectBandSizingInfo {
    constructor() {
        this.slots = [];
        this._effectSlot = new Map();
    }
    getOrCreateSlot(band) {
        // first check preferrable slot depending on type
        if (this._effectSlot.has(band.info.effectId)) {
            let slot = this._effectSlot.get(band.info.effectId);
            if (slot.canBeUsed(band)) {
                return slot;
            }
        }
        // find any slot that can be used
        for (let slot of this.slots) {
            if (slot.canBeUsed(band)) {
                return slot;
            }
        }
        // create a new slot if required
        let newSlot = new EffectBandSlot();
        this.slots.push(newSlot);
        return newSlot;
    }
    register(effectBand) {
        let freeSlot = this.getOrCreateSlot(effectBand);
        freeSlot.update(effectBand);
        this._effectSlot.set(effectBand.info.effectId, freeSlot);
    }
}
//# sourceMappingURL=EffectBandSizingInfo.js.map