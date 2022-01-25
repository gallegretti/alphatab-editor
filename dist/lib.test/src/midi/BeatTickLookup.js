/**
 * Represents the time period, for which a {@link Beat} is played.
 */
export class BeatTickLookup {
    constructor() {
        this._highlightedBeats = new Map();
        /**
         * Gets or sets the index of the lookup within the parent MasterBarTickLookup.
         */
        this.index = 0;
        /**
         * Gets or sets the start time in midi ticks at which the given beat is played.
         */
        this.start = 0;
        /**
         * Gets or sets the end time in midi ticks at which the given beat is played.
         */
        this.end = 0;
        /**
         * Gets or sets whether the beat is the placeholder beat for an empty bar.
         */
        this.isEmptyBar = false;
        /**
         * Gets or sets a list of all beats that should be highlighted when
         * the beat of this lookup starts playing.
         */
        this.beatsToHighlight = [];
    }
    highlightBeat(beat) {
        if (!this._highlightedBeats.has(beat.id)) {
            this._highlightedBeats.set(beat.id, true);
            this.beatsToHighlight.push(beat);
        }
    }
}
//# sourceMappingURL=BeatTickLookup.js.map