import { Beat } from '@src/model/Beat';
import { Voice } from '@src/model/Voice';
/**
 * Represents a list of beats that are grouped within the same tuplet.
 */
export declare class TupletGroup {
    private static readonly HalfTicks;
    private static readonly QuarterTicks;
    private static readonly EighthTicks;
    private static readonly SixteenthTicks;
    private static readonly ThirtySecondTicks;
    private static readonly SixtyFourthTicks;
    private static readonly OneHundredTwentyEighthTicks;
    private static readonly TwoHundredFiftySixthTicks;
    private static AllTicks;
    private _isEqualLengthTuplet;
    totalDuration: number;
    /**
     * Gets or sets the list of beats contained in this group.
     */
    beats: Beat[];
    /**
     * Gets or sets the voice this group belongs to.
     */
    voice: Voice;
    /**
     * Gets a value indicating whether the tuplet group is fully filled.
     */
    isFull: boolean;
    /**
     * Initializes a new instance of the {@link TupletGroup} class.
     * @param voice The voice this group belongs to.
     */
    constructor(voice: Voice);
    check(beat: Beat): boolean;
}
