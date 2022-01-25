import { Beat } from '@src/model/Beat';
import { EffectBand } from '@src/rendering/EffectBand';
export declare class EffectBandSlotShared {
    uniqueEffectId: string | null;
    y: number;
    height: number;
    firstBeat: Beat | null;
    lastBeat: Beat | null;
}
export declare class EffectBandSlot {
    bands: EffectBand[];
    shared: EffectBandSlotShared;
    constructor();
    update(effectBand: EffectBand): void;
    canBeUsed(band: EffectBand): boolean;
}
