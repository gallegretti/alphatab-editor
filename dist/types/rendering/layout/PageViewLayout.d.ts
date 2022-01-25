import { ScoreLayout } from '@src/rendering/layout/ScoreLayout';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
/**
 * This layout arranges the bars into a fixed width and dynamic height region.
 */
export declare class PageViewLayout extends ScoreLayout {
    static PagePadding: number[];
    static readonly GroupSpacing: number;
    private _groups;
    private _allMasterBarRenderers;
    private _barsFromPreviousGroup;
    private _pagePadding;
    get name(): string;
    constructor(renderer: ScoreRenderer);
    protected doLayoutAndRender(): void;
    get supportsResize(): boolean;
    resize(): void;
    private layoutAndRenderTunings;
    private layoutAndRenderChordDiagrams;
    private layoutAndRenderScoreInfo;
    private resizeAndRenderScore;
    private layoutAndRenderScore;
    private paintGroup;
    /**
     * Realignes the bars in this line according to the available space
     */
    private fitGroup;
    private createStaveGroup;
    private get maxWidth();
}
