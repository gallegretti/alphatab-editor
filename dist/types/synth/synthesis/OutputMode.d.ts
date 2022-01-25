/**
 * Supported output modes by the render methods
 */
export declare enum OutputMode {
    /**
     * Two channels with single left/right samples one after another
     */
    StereoInterleaved = 0,
    /**
     * Two channels with all samples for the left channel first then right
     */
    StereoUnweaved = 1,
    /**
     * A single channel (stereo instruments are mixed into center)
     */
    Mono = 2
}
