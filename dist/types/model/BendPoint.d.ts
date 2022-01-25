/**
 * A single point of a bending graph. Used to
 * describe WhammyBar and String Bending effects.
 * @cloneable
 * @json
 */
export declare class BendPoint {
    static readonly MaxPosition: number;
    static readonly MaxValue: number;
    /**
     * Gets or sets offset of the point relative to the note duration (0-60)
     */
    offset: number;
    /**
     * Gets or sets the 1/4 note value offsets for the bend.
     */
    value: number;
    /**
     * Initializes a new instance of the {@link BendPoint} class.
     * @param offset The offset.
     * @param value The value.
     */
    constructor(offset?: number, value?: number);
}
