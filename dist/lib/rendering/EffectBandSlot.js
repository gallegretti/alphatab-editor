export class EffectBandSlotShared {
    constructor() {
        this.uniqueEffectId = null;
        this.y = 0;
        this.height = 0;
        this.firstBeat = null;
        this.lastBeat = null;
    }
}
export class EffectBandSlot {
    constructor() {
        this.bands = [];
        this.shared = new EffectBandSlotShared();
    }
    update(effectBand) {
        // lock band to particular effect if needed
        if (!effectBand.info.canShareBand) {
            this.shared.uniqueEffectId = effectBand.info.effectId;
        }
        effectBand.slot = this;
        this.bands.push(effectBand);
        if (effectBand.height > this.shared.height) {
            this.shared.height = effectBand.height;
        }
        if (!this.shared.firstBeat || effectBand.firstBeat.isBefore(this.shared.firstBeat)) {
            this.shared.firstBeat = effectBand.firstBeat;
        }
        if (!this.shared.lastBeat || effectBand.lastBeat.isAfter(this.shared.lastBeat)) {
            this.shared.lastBeat = effectBand.lastBeat;
        }
    }
    canBeUsed(band) {
        return (((!this.shared.uniqueEffectId && band.info.canShareBand) ||
            band.info.effectId === this.shared.uniqueEffectId) &&
            (!this.shared.firstBeat ||
                this.shared.lastBeat.isBefore(band.firstBeat) ||
                this.shared.lastBeat.isBefore(this.shared.firstBeat)));
    }
}
//# sourceMappingURL=EffectBandSlot.js.map