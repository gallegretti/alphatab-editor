import { AlphaTabApiBase } from '@src/AlphaTabApiBase';
import { IAlphaSynth } from '@src/synth/IAlphaSynth';
import { IEventEmitter } from '@src/EventEmitter';
import { Score } from '@src/model/Score';
import { IContainer } from '@src/platform/IContainer';
import { IScoreRenderer } from '@src/rendering/IScoreRenderer';
import { RenderFinishedEventArgs } from '@src/rendering/RenderFinishedEventArgs';
import { Bounds } from '@src/rendering/utils/Bounds';
import { IMouseEventArgs } from '@src/platform/IMouseEventArgs';
import { IUiFacade } from '@src/platform/IUiFacade';
import { Cursors } from '@src/platform/Cursors';
/**
 * @target web
 */
export declare class BrowserUiFacade implements IUiFacade<unknown> {
    private _fontCheckers;
    private _api;
    private _contents;
    private _file;
    private _totalResultCount;
    private _initialTrackIndexes;
    private _intersectionObserver;
    private _barToElementLookup;
    rootContainerBecameVisible: IEventEmitter;
    canRenderChanged: IEventEmitter;
    get resizeThrottle(): number;
    rootContainer: IContainer;
    areWorkersSupported: boolean;
    get canRender(): boolean;
    private areAllFontsLoaded;
    private onFontLoaded;
    constructor(rootElement: HTMLElement);
    private onElementVisibilityChanged;
    createWorkerRenderer(): IScoreRenderer;
    initialize(api: AlphaTabApiBase<unknown>, raw: unknown): void;
    private setupFontCheckers;
    private registerFontChecker;
    destroy(): void;
    createCanvasElement(): IContainer;
    triggerEvent(container: IContainer, name: string, details?: unknown, originalEvent?: IMouseEventArgs): void;
    load(data: unknown, success: (score: Score) => void, error: (error: Error) => void): boolean;
    loadSoundFont(data: unknown, append: boolean): boolean;
    initialRender(): void;
    private createStyleElement;
    parseTracks(tracksData: unknown): number[];
    private getDataAttributes;
    beginAppendRenderResults(renderResult: RenderFinishedEventArgs): void;
    private replacePlaceholder;
    /**
     * This method creates the player. It detects browser compatibility and
     * initializes a alphaSynth version for the client.
     */
    createWorkerPlayer(): IAlphaSynth | null;
    beginInvoke(action: () => void): void;
    private _highlightedElements;
    highlightElements(groupId: string, masterBarIndex: number): void;
    removeHighlights(): void;
    destroyCursors(): void;
    createCursors(): Cursors | null;
    getOffset(scrollContainer: IContainer | null, container: IContainer): Bounds;
    private _scrollContainer;
    getScrollContainer(): IContainer;
    createSelectionElement(): IContainer | null;
    scrollToY(element: IContainer, scrollTargetY: number, speed: number): void;
    scrollToX(element: IContainer, scrollTargetY: number, speed: number): void;
    private internalScrollToY;
    private internalScrollToX;
}
