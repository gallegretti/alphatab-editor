// The SoundFont loading and Audio Synthesis is based on TinySoundFont, licensed under MIT,
// developed by Bernhard Schelling (https://github.com/schellingb/TinySoundFont)
// TypeScript port for alphaTab: (C) 2020 by Daniel Kuschny
// Licensed under: MPL-2.0
/**
 * Supported output modes by the render methods
 */
export var OutputMode;
(function (OutputMode) {
    /**
     * Two channels with single left/right samples one after another
     */
    OutputMode[OutputMode["StereoInterleaved"] = 0] = "StereoInterleaved";
    /**
     * Two channels with all samples for the left channel first then right
     */
    OutputMode[OutputMode["StereoUnweaved"] = 1] = "StereoUnweaved";
    /**
     * A single channel (stereo instruments are mixed into center)
     */
    OutputMode[OutputMode["Mono"] = 2] = "Mono";
})(OutputMode || (OutputMode = {}));
//# sourceMappingURL=OutputMode.js.map