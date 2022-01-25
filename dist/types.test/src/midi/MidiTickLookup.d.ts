import { BeatTickLookup } from '@src/midi/BeatTickLookup';
import { MasterBarTickLookup } from '@src/midi/MasterBarTickLookup';
import { Beat } from '@src/model/Beat';
import { MasterBar } from '@src/model/MasterBar';
import { Track } from '@src/model/Track';
/**
 * Represents the results of searching the currently played beat.
 * @see MidiTickLookup.FindBeat
 */
export declare class MidiTickLookupFindBeatResult {
    /**
     * Gets or sets the beat that is currently played.
     */
    get currentBeat(): Beat;
    /**
     * Gets or sets the beat that will be played next.
     */
    get nextBeat(): Beat | null;
    /**
     * Gets or sets the duration in milliseconds how long this beat is playing.
     */
    duration: number;
    /**
     * Gets or sets the beats ot highlight along the current beat.
     */
    beatsToHighlight: Beat[];
    /**
     * Gets or sets the underlying beat lookup which
     * was used for building this MidiTickLookupFindBeatResult.
     */
    currentBeatLookup: BeatTickLookup;
    /**
     * Gets or sets the beat lookup for the next beat.
     */
    nextBeatLookup: BeatTickLookup | null;
}
/**
 * This class holds all information about when {@link MasterBar}s and {@link Beat}s are played.
 */
export declare class MidiTickLookup {
    private _currentMasterBar;
    /**
     * Gets a dictionary of all master bars played. The index is the index equals to {@link MasterBar.index}.
     * This lookup only contains the first time a MasterBar is played. For a whole sequence of the song refer to {@link MasterBars}.
     */
    readonly masterBarLookup: Map<number, MasterBarTickLookup>;
    /**
     * Gets a list of all {@link MasterBarTickLookup} sorted by time.
     */
    readonly masterBars: MasterBarTickLookup[];
    /**
     * Performs the neccessary finalization steps after all information was written.
     */
    finish(): void;
    /**
     * Finds the currently played beat given a list of tracks and the current time.
     * @param tracks The tracks in which to search the played beat for.
     * @param tick The current time in midi ticks.
     * @returns The information about the current beat or null if no beat could be found.
     */
    findBeat(tracks: Track[], tick: number, currentBeatHint?: MidiTickLookupFindBeatResult | null): MidiTickLookupFindBeatResult | null;
    private findBeatFast;
    private findBeatSlow;
    private createResult;
    private findNextBeat;
    private findMasterBar;
    /**
     * Gets the {@link MasterBarTickLookup} for a given masterbar at which the masterbar is played the first time.
     * @param bar The masterbar to find the time period for.
     * @returns A {@link MasterBarTickLookup} containing the details about the first time the {@link MasterBar} is played.
     */
    getMasterBar(bar: MasterBar): MasterBarTickLookup;
    /**
     * Gets the start time in midi ticks for a given masterbar at which the masterbar is played the first time.
     * @param bar The masterbar to find the time period for.
     * @returns The time in midi ticks at which the masterbar is played the first time or 0 if the masterbar is not contained
     */
    getMasterBarStart(bar: MasterBar): number;
    /**
     * Adds a new {@link MasterBarTickLookup} to the lookup table.
     * @param masterBar The item to add.
     */
    addMasterBar(masterBar: MasterBarTickLookup): void;
    /**
     * Adds the given {@link BeatTickLookup} to the current {@link MidiTickLookup}.
     * @param beat The lookup to add.
     */
    addBeat(beat: BeatTickLookup): void;
}
