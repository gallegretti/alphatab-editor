/**
 * A single point of a bending graph. Used to
 * describe WhammyBar and String Bending effects.
 * @cloneable
 * @json
 */
export class BendPoint {
    /**
     * Initializes a new instance of the {@link BendPoint} class.
     * @param offset The offset.
     * @param value The value.
     */
    constructor(offset = 0, value = 0) {
        this.offset = offset;
        this.value = value;
    }
}
BendPoint.MaxPosition = 60;
BendPoint.MaxValue = 12;
//# sourceMappingURL=BendPoint.js.map