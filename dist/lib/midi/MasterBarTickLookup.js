/**
 * Represents the time period, for which all bars of a {@link MasterBar} are played.
 */
export class MasterBarTickLookup {
    constructor() {
        /**
         * Gets or sets the start time in midi ticks at which the MasterBar is played.
         */
        this.start = 0;
        /**
         * Gets or sets the end time in midi ticks at which the MasterBar is played.
         */
        this.end = 0;
        /**
         * Gets or sets the current tempo when the MasterBar is played.
         */
        this.tempo = 0;
        /**
         * Gets or sets the list of {@link BeatTickLookup} object which define the durations
         * for all {@link Beats} played within the period of this MasterBar.
         */
        this.beats = [];
        /**
         * Gets or sets the {@link MasterBarTickLookup} of the next masterbar in the {@link Score}
         */
        this.nextMasterBar = null;
    }
    /**
     * Performs the neccessary finalization steps after all information was written.
     */
    finish() {
        this.beats.sort((a, b) => {
            return a.start - b.start;
        });
    }
    /**
     * Adds a new {@link BeatTickLookup} to the list of played beats during this MasterBar period.
     * @param beat
     */
    addBeat(beat) {
        beat.masterBar = this;
        beat.index = this.beats.length;
        this.beats.push(beat);
    }
}
//# sourceMappingURL=MasterBarTickLookup.js.map