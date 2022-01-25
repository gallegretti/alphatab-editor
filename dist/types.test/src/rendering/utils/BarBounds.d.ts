import { Bar } from '@src/model/Bar';
import { BeatBounds } from '@src/rendering/utils/BeatBounds';
import { Bounds } from '@src/rendering/utils/Bounds';
import { MasterBarBounds } from '@src/rendering/utils/MasterBarBounds';
/**
 * Represents the boundaries of a single bar.
 */
export declare class BarBounds {
    /**
     * Gets or sets the reference to the related {@link MasterBarBounds}
     */
    masterBarBounds: MasterBarBounds;
    /**
     * Gets or sets the bounds covering all visually visible elements spanning this bar.
     */
    visualBounds: Bounds;
    /**
     * Gets or sets the actual bounds of the elements in this bar including whitespace areas.
     */
    realBounds: Bounds;
    /**
     * Gets or sets the bar related to this boundaries.
     */
    bar: Bar;
    /**
     * Gets or sets a list of the beats contained in this lookup.
     */
    beats: BeatBounds[];
    /**
     * Adds a new beat to this lookup.
     * @param bounds The beat bounds to add.
     */
    addBeat(bounds: BeatBounds): void;
    /**
     * Tries to find the beat at the given X-position.
     * @param x The X-position of the beat to find.
     * @returns The beat at the given X-position or null if none was found.
     */
    findBeatAtPos(x: number): BeatBounds | null;
}
