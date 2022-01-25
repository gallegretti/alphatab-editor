import { EventEmitter, EventEmitterOfT } from '@src/EventEmitter';
export class TestOutput {
    constructor() {
        this.samples = [];
        /**
         * Fired when the output has been successfully opened and is ready to play samples.
         */
        this.ready = new EventEmitter();
        /**
         * Fired when a certain number of samples have been played.
         */
        this.samplesPlayed = new EventEmitterOfT();
        /**
         * Fired when the output needs more samples to be played.
         */
        this.sampleRequest = new EventEmitter();
    }
    get sampleRate() {
        return 44100;
    }
    open() {
        this.samples = [];
        this.ready.trigger();
    }
    play() {
        // nothing to do
    }
    destroy() {
        // nothing to do
    }
    next() {
        this.sampleRequest.trigger();
    }
    pause() {
        // nothing to do
    }
    addSamples(f) {
        for (let i = 0; i < f.length; i++) {
            this.samples.push(f[i]);
        }
        this.samplesPlayed.trigger(f.length);
    }
    resetSamples() {
        // nothing to do
    }
    activate() {
        // nothing to do
    }
}
//# sourceMappingURL=TestOutput.js.map