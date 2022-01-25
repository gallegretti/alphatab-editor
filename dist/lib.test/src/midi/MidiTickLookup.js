import { MasterBarTickLookup } from '@src/midi/MasterBarTickLookup';
import { MidiUtils } from '@src/midi/MidiUtils';
/**
 * Represents the results of searching the currently played beat.
 * @see MidiTickLookup.FindBeat
 */
export class MidiTickLookupFindBeatResult {
    constructor() {
        /**
         * Gets or sets the duration in milliseconds how long this beat is playing.
         */
        this.duration = 0;
        /**
         * Gets or sets the beat lookup for the next beat.
         */
        this.nextBeatLookup = null;
    }
    /**
     * Gets or sets the beat that is currently played.
     */
    get currentBeat() {
        return this.currentBeatLookup.beat;
    }
    /**
     * Gets or sets the beat that will be played next.
     */
    get nextBeat() {
        var _a, _b;
        return (_b = (_a = this.nextBeatLookup) === null || _a === void 0 ? void 0 : _a.beat) !== null && _b !== void 0 ? _b : null;
    }
}
/**
 * This class holds all information about when {@link MasterBar}s and {@link Beat}s are played.
 */
export class MidiTickLookup {
    constructor() {
        this._currentMasterBar = null;
        /**
         * Gets a dictionary of all master bars played. The index is the index equals to {@link MasterBar.index}.
         * This lookup only contains the first time a MasterBar is played. For a whole sequence of the song refer to {@link MasterBars}.
         */
        this.masterBarLookup = new Map();
        /**
         * Gets a list of all {@link MasterBarTickLookup} sorted by time.
         */
        this.masterBars = [];
    }
    /**
     * Performs the neccessary finalization steps after all information was written.
     */
    finish() {
        let previous = null;
        let activeBeats = [];
        for (let bar of this.masterBars) {
            bar.finish();
            if (previous) {
                previous.nextMasterBar = bar;
            }
            for (const beat of bar.beats) {
                // 1. calculate newly which beats are still active
                const newActiveBeats = [];
                // TODO: only create new list if current position changed
                for (let activeBeat of activeBeats) {
                    if (activeBeat.end > beat.start) {
                        newActiveBeats.push(activeBeat);
                        // 2. remember for current beat which active beats to highlight
                        beat.highlightBeat(activeBeat.beat);
                        // 3. ensure that active beat highlights current beat if they match the range
                        if (beat.start <= activeBeat.start) {
                            activeBeat.highlightBeat(beat.beat);
                        }
                    }
                }
                newActiveBeats.push(beat);
                activeBeats = newActiveBeats;
            }
            previous = bar;
        }
    }
    /**
     * Finds the currently played beat given a list of tracks and the current time.
     * @param tracks The tracks in which to search the played beat for.
     * @param tick The current time in midi ticks.
     * @returns The information about the current beat or null if no beat could be found.
     */
    findBeat(tracks, tick, currentBeatHint = null) {
        const trackLookup = new Map();
        for (const track of tracks) {
            trackLookup.set(track.index, true);
        }
        let result = null;
        if (currentBeatHint) {
            result = this.findBeatFast(trackLookup, currentBeatHint, tick);
        }
        if (!result) {
            result = this.findBeatSlow(trackLookup, tick);
        }
        return result;
    }
    findBeatFast(trackLookup, currentBeatHint, tick) {
        if (tick >= currentBeatHint.currentBeatLookup.start && tick < currentBeatHint.currentBeatLookup.end) {
            // still same beat?
            return currentBeatHint;
        }
        else if (currentBeatHint.nextBeatLookup &&
            tick >= currentBeatHint.nextBeatLookup.start &&
            tick < currentBeatHint.nextBeatLookup.end) {
            // maybe next beat?
            return this.createResult(currentBeatHint.nextBeatLookup, trackLookup);
        }
        // likely a loop or manual seek, need to fallback to slow path
        return null;
    }
    findBeatSlow(trackLookup, tick) {
        // get all beats within the masterbar
        const masterBar = this.findMasterBar(tick);
        if (!masterBar) {
            return null;
        }
        let beat = null;
        let beats = masterBar.beats;
        for (let b = 0; b < beats.length; b++) {
            // is the current beat played on the given tick?
            let currentBeat = beats[b];
            // skip non relevant beats
            if (!trackLookup.has(currentBeat.beat.voice.bar.staff.track.index)) {
                continue;
            }
            if (currentBeat.start <= tick && tick < currentBeat.end) {
                // take the latest played beat we can find. (most right)
                if (!beat || beat.start < currentBeat.start) {
                    beat = beats[b];
                }
            }
            else if (currentBeat.end > tick) {
                break;
            }
        }
        if (!beat) {
            return null;
        }
        return this.createResult(beat, trackLookup);
    }
    createResult(beat, trackLookup) {
        // search for next relevant beat in masterbar
        const nextBeat = this.findNextBeat(beat, trackLookup);
        const result = new MidiTickLookupFindBeatResult();
        result.currentBeatLookup = beat;
        result.nextBeatLookup = nextBeat;
        result.duration = !nextBeat
            ? MidiUtils.ticksToMillis(beat.end - beat.start, beat.masterBar.tempo)
            : MidiUtils.ticksToMillis(nextBeat.start - beat.start, beat.masterBar.tempo);
        result.beatsToHighlight = beat.beatsToHighlight;
        return result;
    }
    findNextBeat(beat, trackLookup) {
        const masterBar = beat.masterBar;
        let beats = masterBar.beats;
        // search for next relevant beat in masterbar
        let nextBeat = null;
        for (let b = beat.index + 1; b < beats.length; b++) {
            const currentBeat = beats[b];
            if (currentBeat.start > beat.start && trackLookup.has(currentBeat.beat.voice.bar.staff.track.index)) {
                nextBeat = currentBeat;
                break;
            }
        }
        // first relevant beat in next bar
        if (!nextBeat && masterBar.nextMasterBar) {
            beats = masterBar.nextMasterBar.beats;
            for (let b = 0; b < beats.length; b++) {
                const currentBeat = beats[b];
                if (trackLookup.has(currentBeat.beat.voice.bar.staff.track.index)) {
                    nextBeat = currentBeat;
                    break;
                }
            }
        }
        return nextBeat;
    }
    findMasterBar(tick) {
        const bars = this.masterBars;
        let bottom = 0;
        let top = bars.length - 1;
        while (bottom <= top) {
            const middle = ((top + bottom) / 2) | 0;
            const bar = bars[middle];
            // found?
            if (tick >= bar.start && tick < bar.end) {
                return bar;
            }
            // search in lower half
            if (tick < bar.start) {
                top = middle - 1;
            }
            else {
                bottom = middle + 1;
            }
        }
        return null;
    }
    /**
     * Gets the {@link MasterBarTickLookup} for a given masterbar at which the masterbar is played the first time.
     * @param bar The masterbar to find the time period for.
     * @returns A {@link MasterBarTickLookup} containing the details about the first time the {@link MasterBar} is played.
     */
    getMasterBar(bar) {
        if (!this.masterBarLookup.has(bar.index)) {
            const fallback = new MasterBarTickLookup();
            fallback.masterBar = bar;
            return fallback;
        }
        return this.masterBarLookup.get(bar.index);
    }
    /**
     * Gets the start time in midi ticks for a given masterbar at which the masterbar is played the first time.
     * @param bar The masterbar to find the time period for.
     * @returns The time in midi ticks at which the masterbar is played the first time or 0 if the masterbar is not contained
     */
    getMasterBarStart(bar) {
        if (!this.masterBarLookup.has(bar.index)) {
            return 0;
        }
        return this.masterBarLookup.get(bar.index).start;
    }
    /**
     * Adds a new {@link MasterBarTickLookup} to the lookup table.
     * @param masterBar The item to add.
     */
    addMasterBar(masterBar) {
        this.masterBars.push(masterBar);
        this._currentMasterBar = masterBar;
        if (!this.masterBarLookup.has(masterBar.masterBar.index)) {
            this.masterBarLookup.set(masterBar.masterBar.index, masterBar);
        }
    }
    /**
     * Adds the given {@link BeatTickLookup} to the current {@link MidiTickLookup}.
     * @param beat The lookup to add.
     */
    addBeat(beat) {
        var _a;
        (_a = this._currentMasterBar) === null || _a === void 0 ? void 0 : _a.addBeat(beat);
    }
}
//# sourceMappingURL=MidiTickLookup.js.map