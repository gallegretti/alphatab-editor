import { EffectBand } from '@src/rendering/EffectBand';
import { EffectBandSlot } from '@src/rendering/EffectBandSlot';
export declare class EffectBandSizingInfo {
    private _effectSlot;
    slots: EffectBandSlot[];
    constructor();
    getOrCreateSlot(band: EffectBand): EffectBandSlot;
    register(effectBand: EffectBand): void;
}
