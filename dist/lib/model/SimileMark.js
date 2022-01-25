/**
 * Lists all simile mark types as they are assigned to bars.
 */
export var SimileMark;
(function (SimileMark) {
    /**
     * No simile mark is applied
     */
    SimileMark[SimileMark["None"] = 0] = "None";
    /**
     * A simple simile mark. The previous bar is repeated.
     */
    SimileMark[SimileMark["Simple"] = 1] = "Simple";
    /**
     * A double simile mark. This value is assigned to the first
     * bar of the 2 repeat bars.
     */
    SimileMark[SimileMark["FirstOfDouble"] = 2] = "FirstOfDouble";
    /**
     * A double simile mark. This value is assigned to the second
     * bar of the 2 repeat bars.
     */
    SimileMark[SimileMark["SecondOfDouble"] = 3] = "SecondOfDouble";
})(SimileMark || (SimileMark = {}));
//# sourceMappingURL=SimileMark.js.map