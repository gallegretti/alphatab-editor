import { Bar } from '@src/model/Bar';
import { Voice } from '@src/model/Voice';
import { ICanvas } from '@src/platform/ICanvas';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { EffectBand } from '@src/rendering/EffectBand';
import { EffectBandSizingInfo } from '@src/rendering/EffectBandSizingInfo';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
/**
 * This renderer is responsible for displaying effects above or below the other staves
 * like the vibrato.
 */
export declare class EffectBarRenderer extends BarRendererBase {
    private _infos;
    private _bands;
    private _bandLookup;
    sizingInfo: EffectBandSizingInfo | null;
    constructor(renderer: ScoreRenderer, bar: Bar, infos: EffectBarRendererInfo[]);
    protected updateSizes(): void;
    finalizeRenderer(): void;
    private updateHeight;
    applyLayoutingInfo(): boolean;
    scaleToWidth(width: number): void;
    protected createBeatGlyphs(): void;
    protected createVoiceGlyphs(v: Voice): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    getBand(voice: Voice, effectId: string): EffectBand | null;
}
