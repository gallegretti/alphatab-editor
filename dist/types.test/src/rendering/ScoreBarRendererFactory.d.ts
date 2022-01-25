import { Bar } from '@src/model/Bar';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { BarRendererFactory } from '@src/rendering/BarRendererFactory';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
/**
 * This Factory procudes ScoreBarRenderer instances
 */
export declare class ScoreBarRendererFactory extends BarRendererFactory {
    get staffId(): string;
    create(renderer: ScoreRenderer, bar: Bar): BarRendererBase;
    constructor();
}
