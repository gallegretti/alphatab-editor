/**
 * Lists all types of how to brush multiple notes on a beat.
 */
export var BrushType;
(function (BrushType) {
    /**
     * No brush.
     */
    BrushType[BrushType["None"] = 0] = "None";
    /**
     * Normal brush up.
     */
    BrushType[BrushType["BrushUp"] = 1] = "BrushUp";
    /**
     * Normal brush down.
     */
    BrushType[BrushType["BrushDown"] = 2] = "BrushDown";
    /**
     * Arpeggio up.
     */
    BrushType[BrushType["ArpeggioUp"] = 3] = "ArpeggioUp";
    /**
     * Arpeggio down.
     */
    BrushType[BrushType["ArpeggioDown"] = 4] = "ArpeggioDown";
})(BrushType || (BrushType = {}));
//# sourceMappingURL=BrushType.js.map