/**
 * This public enum lists all different types of finger slide-ins on a string.
 */
export var SlideInType;
(function (SlideInType) {
    /**
     * No slide.
     */
    SlideInType[SlideInType["None"] = 0] = "None";
    /**
     * Slide into the note from below on the same string.
     */
    SlideInType[SlideInType["IntoFromBelow"] = 1] = "IntoFromBelow";
    /**
     * Slide into the note from above on the same string.
     */
    SlideInType[SlideInType["IntoFromAbove"] = 2] = "IntoFromAbove";
})(SlideInType || (SlideInType = {}));
//# sourceMappingURL=SlideInType.js.map