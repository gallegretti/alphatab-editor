/**
 * Represents the boundaries of a single bar.
 */
export class BarBounds {
    constructor() {
        /**
         * Gets or sets a list of the beats contained in this lookup.
         */
        this.beats = [];
    }
    /**
     * Adds a new beat to this lookup.
     * @param bounds The beat bounds to add.
     */
    addBeat(bounds) {
        bounds.barBounds = this;
        this.beats.push(bounds);
        this.masterBarBounds.addBeat(bounds);
    }
    /**
     * Tries to find the beat at the given X-position.
     * @param x The X-position of the beat to find.
     * @returns The beat at the given X-position or null if none was found.
     */
    findBeatAtPos(x) {
        let beat = null;
        for (let t of this.beats) {
            if (!beat || t.realBounds.x < x) {
                beat = t;
            }
            else if (t.realBounds.x > x) {
                break;
            }
        }
        return beat;
    }
}
//# sourceMappingURL=BarBounds.js.map