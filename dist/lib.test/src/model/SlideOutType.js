/**
 * This public enum lists all different types of finger slide-outs on a string.
 */
export var SlideOutType;
(function (SlideOutType) {
    /**
     * No slide.
     */
    SlideOutType[SlideOutType["None"] = 0] = "None";
    /**
     * Shift slide to next note on same string
     */
    SlideOutType[SlideOutType["Shift"] = 1] = "Shift";
    /**
     * Legato slide to next note on same string.
     */
    SlideOutType[SlideOutType["Legato"] = 2] = "Legato";
    /**
     * Slide out from the note from upwards on the same string.
     */
    SlideOutType[SlideOutType["OutUp"] = 3] = "OutUp";
    /**
     * Slide out from the note from downwards on the same string.
     */
    SlideOutType[SlideOutType["OutDown"] = 4] = "OutDown";
    /**
     * Pickslide down on this note
     */
    SlideOutType[SlideOutType["PickSlideDown"] = 5] = "PickSlideDown";
    /**
     * Pickslide up on this note
     */
    SlideOutType[SlideOutType["PickSlideUp"] = 6] = "PickSlideUp";
})(SlideOutType || (SlideOutType = {}));
//# sourceMappingURL=SlideOutType.js.map