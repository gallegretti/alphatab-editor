import { IEventEmitter, IEventEmitterOfT } from '@src/EventEmitter';
import { Score } from '@src/model/Score';
import { Track } from '@src/model/Track';
import { ICanvas } from '@src/platform/ICanvas';
import { IScoreRenderer } from '@src/rendering/IScoreRenderer';
import { ScoreLayout } from '@src/rendering/layout/ScoreLayout';
import { RenderFinishedEventArgs } from '@src/rendering/RenderFinishedEventArgs';
import { BoundsLookup } from '@src/rendering/utils/BoundsLookup';
import { Settings } from '@src/Settings';
/**
 * This is the main wrapper of the rendering engine which
 * can render a single track of a score object into a notation sheet.
 */
export declare class ScoreRenderer implements IScoreRenderer {
    private _currentLayoutMode;
    private _currentRenderEngine;
    private _renderedTracks;
    canvas: ICanvas | null;
    score: Score | null;
    tracks: Track[] | null;
    layout: ScoreLayout | null;
    settings: Settings;
    boundsLookup: BoundsLookup | null;
    width: number;
    /**
     * Initializes a new instance of the {@link ScoreRenderer} class.
     * @param settings The settings to use for rendering.
     */
    constructor(settings: Settings);
    destroy(): void;
    private recreateCanvas;
    private recreateLayout;
    renderScore(score: Score, trackIndexes: number[]): void;
    /**
     * Initiates rendering fof the given tracks.
     * @param tracks The tracks to render.
     */
    renderTracks(tracks: Track[]): void;
    updateSettings(settings: Settings): void;
    render(): void;
    resizeRender(): void;
    private layoutAndRender;
    readonly preRender: IEventEmitterOfT<boolean>;
    readonly renderFinished: IEventEmitterOfT<RenderFinishedEventArgs>;
    readonly partialRenderFinished: IEventEmitterOfT<RenderFinishedEventArgs>;
    readonly postRenderFinished: IEventEmitter;
    readonly error: IEventEmitterOfT<Error>;
    private onRenderFinished;
}
