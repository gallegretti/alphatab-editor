/**
 * Lists all types of bends
 */
export var BendType;
(function (BendType) {
    /**
     * No bend at all
     */
    BendType[BendType["None"] = 0] = "None";
    /**
     * Individual points define the bends in a flexible manner.
     * This system was mainly used in Guitar Pro 3-5
     */
    BendType[BendType["Custom"] = 1] = "Custom";
    /**
     * Simple Bend from an unbended string to a higher note.
     */
    BendType[BendType["Bend"] = 2] = "Bend";
    /**
     * Release of a bend that was started on an earlier note.
     */
    BendType[BendType["Release"] = 3] = "Release";
    /**
     * A bend that starts from an unbended string,
     * and also releases the bend after some time.
     */
    BendType[BendType["BendRelease"] = 4] = "BendRelease";
    /**
     * Holds a bend that was started on an earlier note
     */
    BendType[BendType["Hold"] = 5] = "Hold";
    /**
     * A bend that is already started before the note is played then it is held until the end.
     */
    BendType[BendType["Prebend"] = 6] = "Prebend";
    /**
     * A bend that is already started before the note is played and
     * bends even further, then it is held until the end.
     */
    BendType[BendType["PrebendBend"] = 7] = "PrebendBend";
    /**
     * A bend that is already started before the note is played and
     * then releases the bend to a lower note where it is held until the end.
     */
    BendType[BendType["PrebendRelease"] = 8] = "PrebendRelease";
})(BendType || (BendType = {}));
//# sourceMappingURL=BendType.js.map