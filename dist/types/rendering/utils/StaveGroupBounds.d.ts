import { Bounds } from '@src/rendering/utils/Bounds';
import { BoundsLookup } from '@src/rendering/utils/BoundsLookup';
import { MasterBarBounds } from '@src/rendering/utils/MasterBarBounds';
/**
 * Represents the bounds of a stave group.
 */
export declare class StaveGroupBounds {
    /**
     * Gets or sets the index of the bounds within the parent lookup.
     * This allows fast access of the next/previous groups.
     */
    index: number;
    /**
     * Gets or sets the bounds covering all visually visible elements of this stave group.
     */
    visualBounds: Bounds;
    /**
     * Gets or sets the actual bounds of the elements in this stave group including whitespace areas.
     */
    realBounds: Bounds;
    /**
     * Gets or sets the list of master bar bounds related to this stave group.
     */
    bars: MasterBarBounds[];
    /**
     * Gets or sets a reference to the parent bounds lookup.
     */
    boundsLookup: BoundsLookup;
    /**
     * Finished the lookup for optimized access.
     */
    finish(): void;
    /**
     * Adds a new master bar to this lookup.
     * @param bounds The master bar bounds to add.
     */
    addBar(bounds: MasterBarBounds): void;
    /**
     * Tries to find the master bar bounds that are located at the given X-position.
     * @param x The X-position to find a master bar.
     * @returns The master bounds at the given X-position.
     */
    findBarAtPos(x: number): MasterBarBounds | null;
}
