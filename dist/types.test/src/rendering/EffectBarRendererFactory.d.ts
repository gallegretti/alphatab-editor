import { Bar } from '@src/model/Bar';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { BarRendererFactory } from '@src/rendering/BarRendererFactory';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
export declare class EffectBarRendererFactory extends BarRendererFactory {
    private _infos;
    private _staffId;
    get staffId(): string;
    constructor(staffId: string, infos: EffectBarRendererInfo[]);
    create(renderer: ScoreRenderer, bar: Bar): BarRendererBase;
}
