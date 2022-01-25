import { Beat } from '@src/model/Beat';
import { BarBounds } from '@src/rendering/utils/BarBounds';
import { BeatBounds } from '@src/rendering/utils/BeatBounds';
import { Bounds } from '@src/rendering/utils/Bounds';
import { StaveGroupBounds } from '@src/rendering/utils/StaveGroupBounds';
/**
 * Represents the boundaries of a list of bars related to a single master bar.
 */
export declare class MasterBarBounds {
    /**
     * Gets or sets the index of this bounds relative within the parent lookup.
     */
    index: number;
    /**
     * Gets or sets a value indicating whether this bounds are the first of the line.
     */
    isFirstOfLine: boolean;
    /**
     * Gets or sets the bounds covering all visually visible elements spanning all bars of this master bar.
     */
    visualBounds: Bounds;
    /**
     * Gets or sets the actual bounds of the elements in this master bar including whitespace areas.
     */
    realBounds: Bounds;
    /**
     * Gets or sets the actual bounds which are exactly aligned with the lines of the staffs.
     */
    lineAlignedBounds: Bounds;
    /**
     * Gets or sets the list of individual bars within this lookup.
     */
    bars: BarBounds[];
    /**
     * Gets or sets a reference to the parent {@link staveGroupBounds}.
     */
    staveGroupBounds: StaveGroupBounds | null;
    /**
     * Adds a new bar to this lookup.
     * @param bounds The bar bounds to add to this lookup.
     */
    addBar(bounds: BarBounds): void;
    /**
     * Tries to find a beat at the given location.
     * @param x The absolute X position where the beat spans across.
     * @param y The absolute Y position where the beat spans across.
     * @returns The beat that spans across the given point, or null if none of the contained bars had a beat at this position.
     */
    findBeatAtPos(x: number, y: number): Beat | null;
    /**
     * Finishes the lookup object and optimizes itself for fast access.
     */
    finish(): void;
    /**
     * Adds a new beat to the lookup.
     * @param bounds The beat bounds to add.
     */
    addBeat(bounds: BeatBounds): void;
}
