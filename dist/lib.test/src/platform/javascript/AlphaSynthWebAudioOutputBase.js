import { AlphaTabError, AlphaTabErrorType } from '@src/AlphaTabError';
import { Environment } from '@src/Environment';
import { EventEmitter, EventEmitterOfT } from '@src/EventEmitter';
import { Logger } from '@src/Logger';
/**
 * @target web
 */
export class AlphaSynthWebAudioOutputBase {
    constructor() {
        this._context = null;
        this._buffer = null;
        this._source = null;
        this.ready = new EventEmitter();
        this.samplesPlayed = new EventEmitterOfT();
        this.sampleRequest = new EventEmitter();
    }
    get sampleRate() {
        return this._context ? this._context.sampleRate : AlphaSynthWebAudioOutputBase.PreferredSampleRate;
    }
    activate() {
        if (!this._context) {
            this._context = this.createAudioContext();
        }
        if (this._context.state === 'suspended' || this._context.state === 'interrupted') {
            Logger.debug('WebAudio', 'Audio Context is suspended, trying resume');
            this._context.resume().then(() => {
                var _a, _b;
                Logger.debug('WebAudio', `Audio Context resume success: state=${(_a = this._context) === null || _a === void 0 ? void 0 : _a.state}, sampleRate:${(_b = this._context) === null || _b === void 0 ? void 0 : _b.sampleRate}`);
            }, reason => {
                var _a, _b;
                Logger.debug('WebAudio', `Audio Context resume failed: state=${(_a = this._context) === null || _a === void 0 ? void 0 : _a.state}, sampleRate:${(_b = this._context) === null || _b === void 0 ? void 0 : _b.sampleRate}, reason=${reason}`);
            });
        }
    }
    patchIosSampleRate() {
        let ua = navigator.userAgent;
        if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== 0) {
            let context = this.createAudioContext();
            let buffer = context.createBuffer(1, 1, AlphaSynthWebAudioOutputBase.PreferredSampleRate);
            let dummy = context.createBufferSource();
            dummy.buffer = buffer;
            dummy.connect(context.destination);
            dummy.start(0);
            dummy.disconnect(0);
            // tslint:disable-next-line: no-floating-promises
            context.close();
        }
    }
    createAudioContext() {
        if ('AudioContext' in Environment.globalThis) {
            return new AudioContext();
        }
        else if ('webkitAudioContext' in Environment.globalThis) {
            return new webkitAudioContext();
        }
        throw new AlphaTabError(AlphaTabErrorType.General, 'AudioContext not found');
    }
    open() {
        this.patchIosSampleRate();
        this._context = this.createAudioContext();
        // possible fix for Web Audio in iOS 9 (issue #4)
        let ctx = this._context;
        if (ctx.state === 'suspended') {
            let resume = () => {
                ctx.resume();
                Environment.globalThis.setTimeout(() => {
                    if (ctx.state === 'running') {
                        document.body.removeEventListener('touchend', resume, false);
                        document.body.removeEventListener('click', resume, false);
                    }
                }, 0);
            };
            document.body.addEventListener('touchend', resume, false);
            document.body.addEventListener('click', resume, false);
        }
    }
    play() {
        let ctx = this._context;
        this.activate();
        // create an empty buffer source (silence)
        this._buffer = ctx.createBuffer(2, AlphaSynthWebAudioOutputBase.BufferSize, ctx.sampleRate);
        this._source = ctx.createBufferSource();
        this._source.buffer = this._buffer;
        this._source.loop = true;
    }
    pause() {
        if (this._source) {
            this._source.stop(0);
            this._source.disconnect();
        }
        this._source = null;
    }
    destroy() {
        var _a;
        this.pause();
        (_a = this._context) === null || _a === void 0 ? void 0 : _a.close();
    }
    onSamplesPlayed(numberOfSamples) {
        this.samplesPlayed.trigger(numberOfSamples);
    }
    onSampleRequest() {
        this.sampleRequest.trigger();
    }
    onReady() {
        this.ready.trigger();
    }
}
AlphaSynthWebAudioOutputBase.BufferSize = 4096;
AlphaSynthWebAudioOutputBase.PreferredSampleRate = 44100;
AlphaSynthWebAudioOutputBase.TotalBufferTimeInMilliseconds = 5000;
//# sourceMappingURL=AlphaSynthWebAudioOutputBase.js.map