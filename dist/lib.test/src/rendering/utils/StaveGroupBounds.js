/**
 * Represents the bounds of a stave group.
 */
export class StaveGroupBounds {
    constructor() {
        /**
         * Gets or sets the index of the bounds within the parent lookup.
         * This allows fast access of the next/previous groups.
         */
        this.index = 0;
        /**
         * Gets or sets the list of master bar bounds related to this stave group.
         */
        this.bars = [];
    }
    /**
     * Finished the lookup for optimized access.
     */
    finish() {
        for (let t of this.bars) {
            t.finish();
        }
    }
    /**
     * Adds a new master bar to this lookup.
     * @param bounds The master bar bounds to add.
     */
    addBar(bounds) {
        this.boundsLookup.addMasterBar(bounds);
        bounds.staveGroupBounds = this;
        this.bars.push(bounds);
    }
    /**
     * Tries to find the master bar bounds that are located at the given X-position.
     * @param x The X-position to find a master bar.
     * @returns The master bounds at the given X-position.
     */
    findBarAtPos(x) {
        let b = null;
        // move from left to right as long we find bars that start before the clicked position
        for (let bar of this.bars) {
            if (!b || bar.realBounds.x < x) {
                b = bar;
            }
            else if (x > bar.realBounds.x + bar.realBounds.w) {
                break;
            }
        }
        return b;
    }
}
//# sourceMappingURL=StaveGroupBounds.js.map