import { Beat } from '@src/model/Beat';
import { ICanvas } from '@src/platform/ICanvas';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export declare abstract class GroupedEffectGlyph extends EffectGlyph {
    protected endPosition: BeatXPosition;
    protected forceGroupedRendering: boolean;
    protected endOnBarLine: boolean;
    protected constructor(endPosition: BeatXPosition);
    get isLinkedWithPrevious(): boolean;
    get isLinkedWithNext(): boolean;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    protected calculateEndX(endBeatRenderer: BarRendererBase, endBeat: Beat | null, cx: number, endPosition: BeatXPosition): number;
    protected paintNonGrouped(cx: number, cy: number, canvas: ICanvas): void;
    protected abstract paintGrouped(cx: number, cy: number, endX: number, canvas: ICanvas): void;
}
