import { MetaEventType } from '@src/midi/MetaEvent';
import { MidiEventType } from '@src/midi/MidiEvent';
import { SynthEvent } from '@src/synth/synthesis/SynthEvent';
import { Logger } from '@src/Logger';
import { SynthConstants } from './SynthConstants';
export class MidiFileSequencerTempoChange {
    constructor(bpm, ticks, time) {
        this.bpm = bpm;
        this.ticks = ticks;
        this.time = time;
    }
}
class MidiSequencerState {
    constructor() {
        this.tempoChanges = [];
        this.firstProgramEventPerChannel = new Map();
        this.firstTimeSignatureNumerator = 0;
        this.firstTimeSignatureDenominator = 0;
        this.synthData = [];
        this.division = 0;
        this.eventIndex = 0;
        this.currentTime = 0;
        this.playbackRange = null;
        this.playbackRangeStartTime = 0;
        this.playbackRangeEndTime = 0;
        this.endTick = 0;
        this.endTime = 0;
    }
}
/**
 * This sequencer dispatches midi events to the synthesizer based on the current
 * synthesize position. The sequencer does not consider the playback speed.
 */
export class MidiFileSequencer {
    constructor(synthesizer) {
        this._oneTimeState = null;
        this._countInState = null;
        this.isLooping = false;
        /**
         * Gets or sets the playback speed.
         */
        this.playbackSpeed = 1;
        this._synthesizer = synthesizer;
        this._mainState = new MidiSequencerState();
        this._currentState = this._mainState;
    }
    get isPlayingOneTimeMidi() {
        return this._currentState == this._oneTimeState;
    }
    get isPlayingCountIn() {
        return this._currentState == this._countInState;
    }
    get playbackRange() {
        return this._currentState.playbackRange;
    }
    set playbackRange(value) {
        this._currentState.playbackRange = value;
        if (value) {
            this._currentState.playbackRangeStartTime = this.tickPositionToTimePositionWithSpeed(value.startTick, 1);
            this._currentState.playbackRangeEndTime = this.tickPositionToTimePositionWithSpeed(value.endTick, 1);
        }
    }
    get currentTime() {
        return this._currentState.currentTime;
    }
    /**
     * Gets the duration of the song in ticks.
     */
    get endTick() {
        return this._currentState.endTick;
    }
    get endTime() {
        return this._currentState.endTime / this.playbackSpeed;
    }
    seek(timePosition) {
        // map to speed=1
        timePosition *= this.playbackSpeed;
        // ensure playback range
        if (this.playbackRange) {
            if (timePosition < this._currentState.playbackRangeStartTime) {
                timePosition = this._currentState.playbackRangeStartTime;
            }
            else if (timePosition > this._currentState.playbackRangeEndTime) {
                timePosition = this._currentState.playbackRangeEndTime;
            }
        }
        if (timePosition > this._currentState.currentTime) {
            this.silentProcess(timePosition - this._currentState.currentTime);
        }
        else if (timePosition < this._currentState.currentTime) {
            // we have to restart the midi to make sure we get the right state: instruments, volume, pan, etc
            this._currentState.currentTime = 0;
            this._currentState.eventIndex = 0;
            let metronomeVolume = this._synthesizer.metronomeVolume;
            this._synthesizer.noteOffAll(true);
            this._synthesizer.resetSoft();
            this._synthesizer.setupMetronomeChannel(metronomeVolume);
            this.silentProcess(timePosition);
        }
    }
    silentProcess(milliseconds) {
        if (milliseconds <= 0) {
            return;
        }
        let start = Date.now();
        let finalTime = this._currentState.currentTime + milliseconds;
        while (this._currentState.currentTime < finalTime) {
            if (this.fillMidiEventQueueLimited(finalTime - this._currentState.currentTime)) {
                this._synthesizer.synthesizeSilent(SynthConstants.MicroBufferSize);
            }
        }
        this._currentState.currentTime = finalTime;
        let duration = Date.now() - start;
        Logger.debug('Sequencer', 'Silent seek finished in ' + duration + 'ms');
    }
    loadOneTimeMidi(midiFile) {
        this._oneTimeState = this.createStateFromFile(midiFile);
        this._currentState = this._oneTimeState;
    }
    loadMidi(midiFile) {
        this._mainState = this.createStateFromFile(midiFile);
        this._currentState = this._mainState;
    }
    createStateFromFile(midiFile) {
        const state = new MidiSequencerState();
        state.tempoChanges = [];
        state.division = midiFile.division;
        state.eventIndex = 0;
        state.currentTime = 0;
        // build synth events.
        state.synthData = [];
        // Converts midi to milliseconds for easy sequencing
        let bpm = 120;
        let absTick = 0;
        let absTime = 0.0;
        let metronomeCount = 0;
        let metronomeLengthInTicks = 0;
        let metronomeLengthInMillis = 0;
        let metronomeTick = 0;
        let metronomeTime = 0.0;
        let previousTick = 0;
        for (let mEvent of midiFile.events) {
            let synthData = new SynthEvent(state.synthData.length, mEvent);
            state.synthData.push(synthData);
            let deltaTick = mEvent.tick - previousTick;
            absTick += deltaTick;
            absTime += deltaTick * (60000.0 / (bpm * midiFile.division));
            synthData.time = absTime;
            previousTick = mEvent.tick;
            if (metronomeLengthInTicks > 0) {
                while (metronomeTick < absTick) {
                    let metronome = SynthEvent.newMetronomeEvent(state.synthData.length, metronomeTick, Math.floor(metronomeTick / metronomeLengthInTicks) % metronomeCount, metronomeLengthInTicks, metronomeLengthInMillis);
                    state.synthData.push(metronome);
                    metronome.time = metronomeTime;
                    metronomeTick += metronomeLengthInTicks;
                    metronomeTime += metronomeLengthInMillis;
                }
            }
            if (mEvent.command === MidiEventType.Meta && mEvent.data1 === MetaEventType.Tempo) {
                let meta = mEvent;
                bpm = 60000000 / meta.value;
                state.tempoChanges.push(new MidiFileSequencerTempoChange(bpm, absTick, absTime));
                metronomeLengthInMillis = metronomeLengthInTicks * (60000.0 / (bpm * midiFile.division));
            }
            else if (mEvent.command === MidiEventType.Meta && mEvent.data1 === MetaEventType.TimeSignature) {
                let meta = mEvent;
                let timeSignatureDenominator = Math.pow(2, meta.data[1]);
                metronomeCount = meta.data[0];
                metronomeLengthInTicks = (state.division * (4.0 / timeSignatureDenominator)) | 0;
                metronomeLengthInMillis = metronomeLengthInTicks * (60000.0 / (bpm * midiFile.division));
                if (state.firstTimeSignatureDenominator === 0) {
                    state.firstTimeSignatureNumerator = meta.data[0];
                    state.firstTimeSignatureDenominator = timeSignatureDenominator;
                }
            }
            else if (mEvent.command === MidiEventType.ProgramChange) {
                let channel = mEvent.channel;
                if (!state.firstProgramEventPerChannel.has(channel)) {
                    state.firstProgramEventPerChannel.set(channel, synthData);
                }
            }
        }
        state.synthData.sort((a, b) => {
            if (a.time > b.time) {
                return 1;
            }
            if (a.time < b.time) {
                return -1;
            }
            return a.eventIndex - b.eventIndex;
        });
        state.endTime = absTime;
        state.endTick = absTick;
        return state;
    }
    fillMidiEventQueue() {
        return this.fillMidiEventQueueLimited(-1);
    }
    fillMidiEventQueueLimited(maxMilliseconds) {
        let millisecondsPerBuffer = (SynthConstants.MicroBufferSize / this._synthesizer.outSampleRate) * 1000 * this.playbackSpeed;
        let endTime = this.internalEndTime;
        if (maxMilliseconds > 0) {
            // ensure that first microbuffer does not already exceed max time
            if (maxMilliseconds < millisecondsPerBuffer) {
                millisecondsPerBuffer = maxMilliseconds;
            }
            endTime = Math.min(this.internalEndTime, this._currentState.currentTime + maxMilliseconds);
        }
        let anyEventsDispatched = false;
        this._currentState.currentTime += millisecondsPerBuffer;
        while (this._currentState.eventIndex < this._currentState.synthData.length &&
            this._currentState.synthData[this._currentState.eventIndex].time < this._currentState.currentTime &&
            this._currentState.currentTime < endTime) {
            this._synthesizer.dispatchEvent(this._currentState.synthData[this._currentState.eventIndex]);
            this._currentState.eventIndex++;
            anyEventsDispatched = true;
        }
        return anyEventsDispatched;
    }
    tickPositionToTimePosition(tickPosition) {
        return this.tickPositionToTimePositionWithSpeed(tickPosition, this.playbackSpeed);
    }
    timePositionToTickPosition(timePosition) {
        return this.timePositionToTickPositionWithSpeed(timePosition, this.playbackSpeed);
    }
    tickPositionToTimePositionWithSpeed(tickPosition, playbackSpeed) {
        let timePosition = 0.0;
        let bpm = 120.0;
        let lastChange = 0;
        // find start and bpm of last tempo change before time
        for (const c of this._currentState.tempoChanges) {
            if (tickPosition < c.ticks) {
                break;
            }
            timePosition = c.time;
            bpm = c.bpm;
            lastChange = c.ticks;
        }
        // add the missing millis
        tickPosition -= lastChange;
        timePosition += tickPosition * (60000.0 / (bpm * this._currentState.division));
        return timePosition / playbackSpeed;
    }
    timePositionToTickPositionWithSpeed(timePosition, playbackSpeed) {
        timePosition *= playbackSpeed;
        let ticks = 0;
        let bpm = 120.0;
        let lastChange = 0;
        // find start and bpm of last tempo change before time
        for (const c of this._currentState.tempoChanges) {
            if (timePosition < c.time) {
                break;
            }
            ticks = c.ticks;
            bpm = c.bpm;
            lastChange = c.time;
        }
        // add the missing ticks
        timePosition -= lastChange;
        ticks += (timePosition / (60000.0 / (bpm * this._currentState.division))) | 0;
        // we add 1 for possible rounding errors.(floating point issuses)
        return ticks + 1;
    }
    get internalEndTime() {
        return !this.playbackRange ? this._currentState.endTime : this._currentState.playbackRangeEndTime;
    }
    get isFinished() {
        return this._currentState.currentTime >= this.internalEndTime;
    }
    stop() {
        if (!this.playbackRange) {
            this._currentState.currentTime = 0;
            this._currentState.eventIndex = 0;
        }
        else if (this.playbackRange) {
            this._currentState.currentTime = this.playbackRange.startTick;
            this._currentState.eventIndex = 0;
        }
    }
    resetOneTimeMidi() {
        this._oneTimeState = null;
        this._currentState = this._mainState;
    }
    resetCountIn() {
        this._countInState = null;
        this._currentState = this._mainState;
    }
    startCountIn() {
        this.generateCountInMidi();
        this._currentState = this._countInState;
        this.stop();
        this._synthesizer.noteOffAll(true);
    }
    generateCountInMidi() {
        const state = new MidiSequencerState();
        state.division = this._mainState.division;
        let bpm = 120;
        let timeSignatureNumerator = 4;
        let timeSignatureDenominator = 4;
        if (this._mainState.eventIndex === 0) {
            bpm = this._mainState.tempoChanges[0].bpm;
            timeSignatureNumerator = this._mainState.firstTimeSignatureNumerator;
            timeSignatureDenominator = this._mainState.firstTimeSignatureDenominator;
        }
        else {
            bpm = this._synthesizer.currentTempo;
            timeSignatureNumerator = this._synthesizer.timeSignatureNumerator;
            timeSignatureDenominator = this._synthesizer.timeSignatureDenominator;
        }
        state.tempoChanges.push(new MidiFileSequencerTempoChange(bpm, 0, 0));
        let metronomeLengthInTicks = (state.division * (4.0 / timeSignatureDenominator)) | 0;
        let metronomeLengthInMillis = metronomeLengthInTicks * (60000.0 / (bpm * this._mainState.division));
        let metronomeTick = 0;
        let metronomeTime = 0.0;
        for (let i = 0; i < timeSignatureNumerator; i++) {
            let metronome = SynthEvent.newMetronomeEvent(state.synthData.length, metronomeTick, i, metronomeLengthInTicks, metronomeLengthInMillis);
            state.synthData.push(metronome);
            metronome.time = metronomeTime;
            metronomeTick += metronomeLengthInTicks;
            metronomeTime += metronomeLengthInMillis;
        }
        state.synthData.sort((a, b) => {
            if (a.time > b.time) {
                return 1;
            }
            if (a.time < b.time) {
                return -1;
            }
            return a.eventIndex - b.eventIndex;
        });
        state.endTime = metronomeTime;
        state.endTick = metronomeTick;
        this._countInState = state;
    }
}
//# sourceMappingURL=MidiFileSequencer.js.map