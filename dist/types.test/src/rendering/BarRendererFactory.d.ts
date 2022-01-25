import { Bar } from '@src/model/Bar';
import { Staff } from '@src/model/Staff';
import { Track } from '@src/model/Track';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
/**
 * This is the base public class for creating factories providing BarRenderers
 */
export declare abstract class BarRendererFactory {
    isInAccolade: boolean;
    isRelevantForBoundsLookup: boolean;
    hideOnMultiTrack: boolean;
    hideOnPercussionTrack: boolean;
    abstract get staffId(): string;
    canCreate(track: Track, staff: Staff): boolean;
    abstract create(renderer: ScoreRenderer, bar: Bar): BarRendererBase;
}
