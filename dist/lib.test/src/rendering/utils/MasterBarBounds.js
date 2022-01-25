/**
 * Represents the boundaries of a list of bars related to a single master bar.
 */
export class MasterBarBounds {
    constructor() {
        /**
         * Gets or sets the index of this bounds relative within the parent lookup.
         */
        this.index = 0;
        /**
         * Gets or sets a value indicating whether this bounds are the first of the line.
         */
        this.isFirstOfLine = false;
        /**
         * Gets or sets the list of individual bars within this lookup.
         */
        this.bars = [];
        /**
         * Gets or sets a reference to the parent {@link staveGroupBounds}.
         */
        this.staveGroupBounds = null;
    }
    /**
     * Adds a new bar to this lookup.
     * @param bounds The bar bounds to add to this lookup.
     */
    addBar(bounds) {
        bounds.masterBarBounds = this;
        this.bars.push(bounds);
    }
    /**
     * Tries to find a beat at the given location.
     * @param x The absolute X position where the beat spans across.
     * @param y The absolute Y position where the beat spans across.
     * @returns The beat that spans across the given point, or null if none of the contained bars had a beat at this position.
     */
    findBeatAtPos(x, y) {
        let beat = null;
        for (let bar of this.bars) {
            let b = bar.findBeatAtPos(x);
            if (b && (!beat || beat.realBounds.x < b.realBounds.x)) {
                beat = b;
            }
        }
        return !beat ? null : beat.beat;
    }
    /**
     * Finishes the lookup object and optimizes itself for fast access.
     */
    finish() {
        this.bars.sort((a, b) => {
            if (a.realBounds.y < b.realBounds.y) {
                return -1;
            }
            if (a.realBounds.y > b.realBounds.y) {
                return 1;
            }
            if (a.realBounds.x < b.realBounds.x) {
                return -1;
            }
            if (a.realBounds.x > b.realBounds.x) {
                return 1;
            }
            return 0;
        });
    }
    /**
     * Adds a new beat to the lookup.
     * @param bounds The beat bounds to add.
     */
    addBeat(bounds) {
        this.staveGroupBounds.boundsLookup.addBeat(bounds);
    }
}
//# sourceMappingURL=MasterBarBounds.js.map