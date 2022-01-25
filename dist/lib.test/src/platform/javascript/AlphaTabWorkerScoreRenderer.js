import { EventEmitter, EventEmitterOfT } from '@src/EventEmitter';
import { JsonConverter } from '@src/model/JsonConverter';
import { FontSizes } from '@src/platform/svg/FontSizes';
import { BoundsLookup } from '@src/rendering/utils/BoundsLookup';
import { Logger } from '@src/Logger';
import { Environment } from '@src/Environment';
/**
 * @target web
 */
export class AlphaTabWorkerScoreRenderer {
    constructor(api, settings) {
        this._width = 0;
        this.boundsLookup = null;
        this.preRender = new EventEmitterOfT();
        this.partialRenderFinished = new EventEmitterOfT();
        this.renderFinished = new EventEmitterOfT();
        this.postRenderFinished = new EventEmitter();
        this.error = new EventEmitterOfT();
        this._api = api;
        if (!settings.core.scriptFile) {
            Logger.error('Rendering', `Could not detect alphaTab script file, cannot initialize renderer`);
            return;
        }
        // first try blob worker
        try {
            this._worker = Environment.createAlphaTabWorker(settings.core.scriptFile);
        }
        catch (e) {
            try {
                this._worker = new Worker(settings.core.scriptFile);
            }
            catch (e2) {
                Logger.error('Rendering', `Failed to create WebWorker: ${e}`);
                return;
            }
        }
        this._worker.postMessage({
            cmd: 'alphaTab.initialize',
            settings: this.serializeSettingsForWorker(settings)
        });
        this._worker.addEventListener('message', this.handleWorkerMessage.bind(this));
    }
    destroy() {
        this._worker.terminate();
    }
    updateSettings(settings) {
        this._worker.postMessage({
            cmd: 'alphaTab.updateSettings',
            settings: this.serializeSettingsForWorker(settings)
        });
    }
    serializeSettingsForWorker(settings) {
        const jsObject = JsonConverter.settingsToJsObject(settings);
        // cut out player settings, they are only needed on UI thread side
        jsObject.delete('player');
        return jsObject;
    }
    render() {
        this._worker.postMessage({
            cmd: 'alphaTab.render'
        });
    }
    resizeRender() {
        this._worker.postMessage({
            cmd: 'alphaTab.resizeRender'
        });
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
        this._worker.postMessage({
            cmd: 'alphaTab.setWidth',
            width: value
        });
    }
    handleWorkerMessage(e) {
        let data = e.data;
        let cmd = data.cmd;
        switch (cmd) {
            case 'alphaTab.preRender':
                this.preRender.trigger(data.resize);
                break;
            case 'alphaTab.partialRenderFinished':
                this.partialRenderFinished.trigger(data.result);
                break;
            case 'alphaTab.renderFinished':
                this.renderFinished.trigger(data.result);
                break;
            case 'alphaTab.postRenderFinished':
                this.boundsLookup = BoundsLookup.fromJson(data.boundsLookup, this._api.score);
                this.postRenderFinished.trigger();
                break;
            case 'alphaTab.error':
                this.error.trigger(data.error);
                break;
        }
    }
    renderScore(score, trackIndexes) {
        let jsObject = JsonConverter.scoreToJsObject(score);
        this._worker.postMessage({
            cmd: 'alphaTab.renderScore',
            score: jsObject,
            trackIndexes: trackIndexes,
            fontSizes: FontSizes.FontSizeLookupTables
        });
    }
}
//# sourceMappingURL=AlphaTabWorkerScoreRenderer.js.map