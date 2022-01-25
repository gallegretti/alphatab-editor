import { Bar } from '@src/model/Bar';
import { Staff } from '@src/model/Staff';
import { Track } from '@src/model/Track';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { BarRendererFactory } from '@src/rendering/BarRendererFactory';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
/**
 * This Factory produces TabBarRenderer instances
 */
export declare class TabBarRendererFactory extends BarRendererFactory {
    private _showTimeSignature;
    private _showRests;
    private _showTiedNotes;
    get staffId(): string;
    constructor(showTimeSignature: boolean, showRests: boolean, showTiedNotes: boolean);
    canCreate(track: Track, staff: Staff): boolean;
    create(renderer: ScoreRenderer, bar: Bar): BarRendererBase;
}
