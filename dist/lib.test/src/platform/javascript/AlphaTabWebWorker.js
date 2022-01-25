import { JsonConverter } from '@src/model/JsonConverter';
import { FontSizes } from '@src/platform/svg/FontSizes';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
import { Logger } from '@src/Logger';
import { Environment } from '@src/Environment';
import { SettingsSerializer } from '@src/generated/SettingsSerializer';
/**
 * @target web
 */
export class AlphaTabWebWorker {
    constructor(main) {
        this._main = main;
        this._main.addEventListener('message', this.handleMessage.bind(this), false);
    }
    static init() {
        Environment.globalThis.alphaTabWebWorker = new AlphaTabWebWorker(Environment.globalThis);
    }
    handleMessage(e) {
        let data = e.data;
        let cmd = data ? data.cmd : '';
        switch (cmd) {
            case 'alphaTab.initialize':
                let settings = JsonConverter.jsObjectToSettings(data.settings);
                Logger.logLevel = settings.core.logLevel;
                this._renderer = new ScoreRenderer(settings);
                this._renderer.partialRenderFinished.on(result => {
                    this._main.postMessage({
                        cmd: 'alphaTab.partialRenderFinished',
                        result: result
                    });
                });
                this._renderer.renderFinished.on(result => {
                    this._main.postMessage({
                        cmd: 'alphaTab.renderFinished',
                        result: result
                    });
                });
                this._renderer.postRenderFinished.on(() => {
                    var _a, _b;
                    this._main.postMessage({
                        cmd: 'alphaTab.postRenderFinished',
                        boundsLookup: (_b = (_a = this._renderer.boundsLookup) === null || _a === void 0 ? void 0 : _a.toJson()) !== null && _b !== void 0 ? _b : null
                    });
                });
                this._renderer.preRender.on(resize => {
                    this._main.postMessage({
                        cmd: 'alphaTab.preRender',
                        resize: resize
                    });
                });
                this._renderer.error.on(this.error.bind(this));
                break;
            case 'alphaTab.invalidate':
                this._renderer.render();
                break;
            case 'alphaTab.resizeRender':
                this._renderer.resizeRender();
                break;
            case 'alphaTab.setWidth':
                this._renderer.width = data.width;
                break;
            case 'alphaTab.renderScore':
                this.updateFontSizes(data.fontSizes);
                let score = JsonConverter.jsObjectToScore(data.score, this._renderer.settings);
                this.renderMultiple(score, data.trackIndexes);
                break;
            case 'alphaTab.updateSettings':
                this.updateSettings(data.settings);
                break;
        }
    }
    updateFontSizes(fontSizes) {
        if (fontSizes) {
            if (!FontSizes.FontSizeLookupTables) {
                FontSizes.FontSizeLookupTables = new Map();
            }
            for (let font in fontSizes) {
                FontSizes.FontSizeLookupTables.set(font, fontSizes[font]);
            }
        }
    }
    updateSettings(json) {
        SettingsSerializer.fromJson(this._renderer.settings, json);
    }
    renderMultiple(score, trackIndexes) {
        try {
            this._renderer.renderScore(score, trackIndexes);
        }
        catch (e) {
            this.error(e);
        }
    }
    error(error) {
        Logger.error('Worker', 'An unexpected error occurred in worker', error);
        this._main.postMessage({
            cmd: 'alphaTab.error',
            error: error
        });
    }
}
//# sourceMappingURL=AlphaTabWebWorker.js.map