import { BeatTickLookup } from '@src/midi/BeatTickLookup';
import { MasterBar } from '@src/model/MasterBar';
/**
 * Represents the time period, for which all bars of a {@link MasterBar} are played.
 */
export declare class MasterBarTickLookup {
    /**
     * Gets or sets the start time in midi ticks at which the MasterBar is played.
     */
    start: number;
    /**
     * Gets or sets the end time in midi ticks at which the MasterBar is played.
     */
    end: number;
    /**
     * Gets or sets the current tempo when the MasterBar is played.
     */
    tempo: number;
    /**
     * Gets or sets the MasterBar which is played.
     */
    masterBar: MasterBar;
    /**
     * Gets or sets the list of {@link BeatTickLookup} object which define the durations
     * for all {@link Beats} played within the period of this MasterBar.
     */
    beats: BeatTickLookup[];
    /**
     * Gets or sets the {@link MasterBarTickLookup} of the next masterbar in the {@link Score}
     */
    nextMasterBar: MasterBarTickLookup | null;
    /**
     * Performs the neccessary finalization steps after all information was written.
     */
    finish(): void;
    /**
     * Adds a new {@link BeatTickLookup} to the list of played beats during this MasterBar period.
     * @param beat
     */
    addBeat(beat: BeatTickLookup): void;
}
