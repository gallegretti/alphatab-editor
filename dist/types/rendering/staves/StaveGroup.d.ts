import { Track } from '@src/model/Track';
import { ICanvas } from '@src/platform/ICanvas';
import { ScoreLayout } from '@src/rendering/layout/ScoreLayout';
import { MasterBarsRenderers } from '@src/rendering/staves/MasterBarsRenderers';
import { RenderStaff } from '@src/rendering/staves/RenderStaff';
import { StaveTrackGroup } from '@src/rendering/staves/StaveTrackGroup';
/**
 * A Staff consists of a list of different staves and groups
 * them using an accolade.
 */
export declare class StaveGroup {
    private static readonly AccoladeLabelSpacing;
    private _allStaves;
    private _firstStaffInAccolade;
    private _lastStaffInAccolade;
    private _accoladeSpacingCalculated;
    x: number;
    y: number;
    index: number;
    accoladeSpacing: number;
    /**
     * Indicates whether this line is full or not. If the line is full the
     * bars can be aligned to the maximum width. If the line is not full
     * the bars will not get stretched.
     */
    isFull: boolean;
    /**
     * The width that the content bars actually need
     */
    width: number;
    isLast: boolean;
    masterBarsRenderers: MasterBarsRenderers[];
    staves: StaveTrackGroup[];
    layout: ScoreLayout;
    get firstBarIndex(): number;
    get lastBarIndex(): number;
    addMasterBarRenderers(tracks: Track[], renderers: MasterBarsRenderers): MasterBarsRenderers | null;
    addBars(tracks: Track[], barIndex: number): MasterBarsRenderers | null;
    revertLastBar(): MasterBarsRenderers | null;
    updateWidth(): number;
    private calculateAccoladeSpacing;
    private getStaveTrackGroup;
    addStaff(track: Track, staff: RenderStaff): void;
    get height(): number;
    scaleToWidth(width: number): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    paintPartial(cx: number, cy: number, canvas: ICanvas, startIndex: number, count: number): void;
    finalizeGroup(): void;
    private buildBoundingsLookup;
    getBarX(index: number): number;
}
