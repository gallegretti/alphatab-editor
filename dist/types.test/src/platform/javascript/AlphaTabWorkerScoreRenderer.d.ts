import { AlphaTabApiBase } from '@src/AlphaTabApiBase';
import { IEventEmitterOfT, IEventEmitter } from '@src/EventEmitter';
import { Score } from '@src/model/Score';
import { IScoreRenderer } from '@src/rendering/IScoreRenderer';
import { RenderFinishedEventArgs } from '@src/rendering/RenderFinishedEventArgs';
import { BoundsLookup } from '@src/rendering/utils/BoundsLookup';
import { Settings } from '@src/Settings';
/**
 * @target web
 */
export declare class AlphaTabWorkerScoreRenderer<T> implements IScoreRenderer {
    private _api;
    private _worker;
    private _width;
    boundsLookup: BoundsLookup | null;
    constructor(api: AlphaTabApiBase<T>, settings: Settings);
    destroy(): void;
    updateSettings(settings: Settings): void;
    private serializeSettingsForWorker;
    render(): void;
    resizeRender(): void;
    get width(): number;
    set width(value: number);
    private handleWorkerMessage;
    renderScore(score: Score, trackIndexes: number[]): void;
    preRender: IEventEmitterOfT<boolean>;
    partialRenderFinished: IEventEmitterOfT<RenderFinishedEventArgs>;
    renderFinished: IEventEmitterOfT<RenderFinishedEventArgs>;
    postRenderFinished: IEventEmitter;
    error: IEventEmitterOfT<Error>;
}
