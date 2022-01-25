import { Bar } from '@src/model/Bar';
import { Staff } from '@src/model/Staff';
import { ICanvas } from '@src/platform/ICanvas';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { BarRendererFactory } from '@src/rendering/BarRendererFactory';
import { BarLayoutingInfo } from '@src/rendering/staves/BarLayoutingInfo';
import { StaveGroup } from '@src/rendering/staves/StaveGroup';
import { StaveTrackGroup } from '@src/rendering/staves/StaveTrackGroup';
/**
 * A Staff represents a single line within a StaveGroup.
 * It stores BarRenderer instances created from a given factory.
 */
export declare class RenderStaff {
    private _factory;
    private _sharedLayoutData;
    staveTrackGroup: StaveTrackGroup;
    staveGroup: StaveGroup;
    barRenderers: BarRendererBase[];
    x: number;
    y: number;
    height: number;
    index: number;
    staffIndex: number;
    /**
     * This is the index of the track being rendered. This is not the index of the track within the model,
     * but the n-th track being rendered. It is the index of the {@link ScoreRenderer.tracks} array defining
     * which tracks should be rendered.
     * For single-track rendering this will always be zero.
     */
    trackIndex: number;
    modelStaff: Staff;
    get staveId(): string;
    /**
     * This is the visual offset from top where the
     * Staff contents actually start. Used for grouping
     * using a accolade
     */
    staveTop: number;
    topSpacing: number;
    bottomSpacing: number;
    /**
     * This is the visual offset from top where the
     * Staff contents actually ends. Used for grouping
     * using a accolade
     */
    staveBottom: number;
    isFirstInAccolade: boolean;
    isLastInAccolade: boolean;
    constructor(trackIndex: number, staff: Staff, factory: BarRendererFactory);
    getSharedLayoutData<T>(key: string, def: T): T;
    setSharedLayoutData<T>(key: string, def: T): void;
    get isInAccolade(): boolean;
    get isRelevantForBoundsLookup(): boolean;
    registerStaffTop(offset: number): void;
    registerStaffBottom(offset: number): void;
    addBarRenderer(renderer: BarRendererBase): void;
    addBar(bar: Bar, layoutingInfo: BarLayoutingInfo): void;
    revertLastBar(): BarRendererBase;
    scaleToWidth(width: number): void;
    get topOverflow(): number;
    get bottomOverflow(): number;
    finalizeStaff(): void;
    paint(cx: number, cy: number, canvas: ICanvas, startIndex: number, count: number): void;
}
