import { Beat } from '@src/model/Beat';
import { Voice } from '@src/model/Voice';
import { ICanvas } from '@src/platform/ICanvas';
import { EffectBandSlot } from '@src/rendering/EffectBandSlot';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
export declare class EffectBand extends Glyph {
    private _uniqueEffectGlyphs;
    private _effectGlyphs;
    isEmpty: boolean;
    previousBand: EffectBand | null;
    isLinkedToPrevious: boolean;
    firstBeat: Beat | null;
    lastBeat: Beat | null;
    height: number;
    voice: Voice;
    info: EffectBarRendererInfo;
    slot: EffectBandSlot | null;
    constructor(voice: Voice, info: EffectBarRendererInfo);
    doLayout(): void;
    createGlyph(beat: Beat): void;
    private createOrResizeGlyph;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    alignGlyphs(): void;
    private alignGlyph;
}
