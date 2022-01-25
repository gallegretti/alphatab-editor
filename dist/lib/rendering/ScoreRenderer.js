import { LayoutMode } from '@src/LayoutMode';
import { Environment } from '@src/Environment';
import { EventEmitter, EventEmitterOfT } from '@src/EventEmitter';
import { RenderFinishedEventArgs } from '@src/rendering/RenderFinishedEventArgs';
import { BoundsLookup } from '@src/rendering/utils/BoundsLookup';
import { Logger } from '@src/Logger';
/**
 * This is the main wrapper of the rendering engine which
 * can render a single track of a score object into a notation sheet.
 */
export class ScoreRenderer {
    /**
     * Initializes a new instance of the {@link ScoreRenderer} class.
     * @param settings The settings to use for rendering.
     */
    constructor(settings) {
        this._currentLayoutMode = LayoutMode.Page;
        this._currentRenderEngine = null;
        this._renderedTracks = null;
        this.canvas = null;
        this.score = null;
        this.tracks = null;
        this.layout = null;
        this.boundsLookup = null;
        this.width = 0;
        this.preRender = new EventEmitterOfT();
        this.renderFinished = new EventEmitterOfT();
        this.partialRenderFinished = new EventEmitterOfT();
        this.postRenderFinished = new EventEmitter();
        this.error = new EventEmitterOfT();
        this.settings = settings;
        this.recreateCanvas();
        this.recreateLayout();
    }
    destroy() {
        this.score = null;
        this.canvas = null;
        this.layout = null;
        this.boundsLookup = null;
        this.tracks = null;
    }
    recreateCanvas() {
        if (this._currentRenderEngine !== this.settings.core.engine) {
            this.canvas = Environment.getRenderEngineFactory(this.settings.core.engine).createCanvas();
            this._currentRenderEngine = this.settings.core.engine;
            return true;
        }
        return false;
    }
    recreateLayout() {
        if (!this.layout || this._currentLayoutMode !== this.settings.display.layoutMode) {
            this.layout = Environment.getLayoutEngineFactory(this.settings.display.layoutMode).createLayout(this);
            this._currentLayoutMode = this.settings.display.layoutMode;
            return true;
        }
        return false;
    }
    renderScore(score, trackIndexes) {
        try {
            this.score = score;
            let tracks;
            if (!trackIndexes) {
                tracks = score.tracks.slice(0);
            }
            else {
                tracks = [];
                for (let track of trackIndexes) {
                    if (track >= 0 && track < score.tracks.length) {
                        tracks.push(score.tracks[track]);
                    }
                }
            }
            if (tracks.length === 0 && score.tracks.length > 0) {
                tracks.push(score.tracks[0]);
            }
            this.tracks = tracks;
            this.render();
        }
        catch (e) {
            this.error.trigger(e);
        }
    }
    /**
     * Initiates rendering fof the given tracks.
     * @param tracks The tracks to render.
     */
    renderTracks(tracks) {
        if (tracks.length === 0) {
            this.score = null;
        }
        else {
            this.score = tracks[0].score;
        }
        this.tracks = tracks;
        this.render();
    }
    updateSettings(settings) {
        this.settings = settings;
    }
    render() {
        if (this.width === 0) {
            Logger.warning('Rendering', 'AlphaTab skipped rendering because of width=0 (element invisible)', null);
            return;
        }
        this.boundsLookup = new BoundsLookup();
        if (!this.tracks || this.tracks.length === 0) {
            return;
        }
        this.recreateCanvas();
        this.canvas.lineWidth = this.settings.display.scale;
        this.canvas.settings = this.settings;
        Logger.debug('Rendering', 'Rendering ' + this.tracks.length + ' tracks');
        for (let i = 0; i < this.tracks.length; i++) {
            let track = this.tracks[i];
            Logger.debug('Rendering', 'Track ' + i + ': ' + track.name);
        }
        this.preRender.trigger(false);
        this.recreateLayout();
        this.layoutAndRender();
        Logger.debug('Rendering', 'Rendering finished');
    }
    resizeRender() {
        if (this.recreateLayout() || this.recreateCanvas() || this._renderedTracks !== this.tracks || !this.tracks) {
            Logger.debug('Rendering', 'Starting full rerendering due to layout or canvas change', null);
            this.render();
        }
        else if (this.layout.supportsResize) {
            Logger.debug('Rendering', 'Starting optimized rerendering for resize');
            this.boundsLookup = new BoundsLookup();
            this.preRender.trigger(true);
            this.canvas.settings = this.settings;
            this.layout.resize();
            this.layout.renderAnnotation();
            this.onRenderFinished();
            this.postRenderFinished.trigger();
        }
        else {
            Logger.warning('Rendering', 'Current layout does not support dynamic resizing, nothing was done', null);
        }
        Logger.debug('Rendering', 'Resize finished');
    }
    layoutAndRender() {
        Logger.debug('Rendering', 'Rendering at scale ' + this.settings.display.scale + ' with layout ' + this.layout.name, null);
        this.layout.layoutAndRender();
        this.layout.renderAnnotation();
        this._renderedTracks = this.tracks;
        this.onRenderFinished();
        this.postRenderFinished.trigger();
    }
    onRenderFinished() {
        const e = new RenderFinishedEventArgs();
        e.totalHeight = this.layout.height;
        e.totalWidth = this.layout.width;
        e.renderResult = this.canvas.onRenderFinished();
        this.renderFinished.trigger(e);
    }
}
//# sourceMappingURL=ScoreRenderer.js.map