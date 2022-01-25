import { EventEmitter, EventEmitterOfT } from '@src/EventEmitter';
import { Logger } from '@src/Logger';
import { Environment } from '@src/Environment';
/**
 * @target web
 */
export class AlphaSynthWorkerSynthOutput {
    constructor() {
        this.ready = new EventEmitter();
        this.samplesPlayed = new EventEmitterOfT();
        this.sampleRequest = new EventEmitter();
    }
    get sampleRate() {
        return AlphaSynthWorkerSynthOutput.preferredSampleRate;
    }
    open() {
        Logger.debug('AlphaSynth', 'Initializing webworker worker');
        this._worker = Environment.globalThis;
        this._worker.addEventListener('message', this.handleMessage.bind(this));
        this.ready.trigger();
    }
    destroy() {
        this._worker.postMessage({
            cmd: 'alphaSynth.output.destroy'
        });
    }
    handleMessage(e) {
        let data = e.data;
        let cmd = data.cmd;
        switch (cmd) {
            case AlphaSynthWorkerSynthOutput.CmdOutputSampleRequest:
                this.sampleRequest.trigger();
                break;
            case AlphaSynthWorkerSynthOutput.CmdOutputSamplesPlayed:
                this.samplesPlayed.trigger(data.samples);
                break;
        }
    }
    addSamples(samples) {
        this._worker.postMessage({
            cmd: 'alphaSynth.output.addSamples',
            samples: samples
        });
    }
    play() {
        this._worker.postMessage({
            cmd: 'alphaSynth.output.play'
        });
    }
    pause() {
        this._worker.postMessage({
            cmd: 'alphaSynth.output.pause'
        });
    }
    resetSamples() {
        this._worker.postMessage({
            cmd: 'alphaSynth.output.resetSamples'
        });
    }
    activate() {
        // nothing to do
    }
}
AlphaSynthWorkerSynthOutput.CmdOutputPrefix = 'alphaSynth.output.';
AlphaSynthWorkerSynthOutput.CmdOutputAddSamples = AlphaSynthWorkerSynthOutput.CmdOutputPrefix + 'addSamples';
AlphaSynthWorkerSynthOutput.CmdOutputPlay = AlphaSynthWorkerSynthOutput.CmdOutputPrefix + 'play';
AlphaSynthWorkerSynthOutput.CmdOutputPause = AlphaSynthWorkerSynthOutput.CmdOutputPrefix + 'pause';
AlphaSynthWorkerSynthOutput.CmdOutputResetSamples = AlphaSynthWorkerSynthOutput.CmdOutputPrefix + 'resetSamples';
AlphaSynthWorkerSynthOutput.CmdOutputSampleRequest = AlphaSynthWorkerSynthOutput.CmdOutputPrefix + 'sampleRequest';
AlphaSynthWorkerSynthOutput.CmdOutputSamplesPlayed = AlphaSynthWorkerSynthOutput.CmdOutputPrefix + 'samplesPlayed';
// this value is initialized by the alphaSynth WebWorker wrapper
// that also includes the alphaSynth library into the worker.
AlphaSynthWorkerSynthOutput.preferredSampleRate = 0;
//# sourceMappingURL=AlphaSynthWorkerSynthOutput.js.map