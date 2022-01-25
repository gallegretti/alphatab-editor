/**
 * Lists the different bend styles
 */
export var BendStyle;
(function (BendStyle) {
    /**
     * The bends are as described by the bend points
     */
    BendStyle[BendStyle["Default"] = 0] = "Default";
    /**
     * The bends are gradual over the beat duration.
     */
    BendStyle[BendStyle["Gradual"] = 1] = "Gradual";
    /**
     * The bends are done fast before the next note.
     */
    BendStyle[BendStyle["Fast"] = 2] = "Fast";
})(BendStyle || (BendStyle = {}));
//# sourceMappingURL=BendStyle.js.map