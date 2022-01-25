import { MasterBar } from '@src/model/MasterBar';
import { ScoreLayout } from '@src/rendering/layout/ScoreLayout';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
export declare class HorizontalScreenLayoutPartialInfo {
    width: number;
    masterBars: MasterBar[];
}
/**
 * This layout arranges the bars all horizontally
 */
export declare class HorizontalScreenLayout extends ScoreLayout {
    static PagePadding: number[];
    static readonly GroupSpacing: number;
    private _group;
    private _pagePadding;
    get name(): string;
    constructor(renderer: ScoreRenderer);
    get supportsResize(): boolean;
    resize(): void;
    protected doLayoutAndRender(): void;
}
