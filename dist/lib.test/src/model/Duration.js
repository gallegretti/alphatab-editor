/**
 * Lists all durations of a beat.
 */
export var Duration;
(function (Duration) {
    /**
     * A quadruple whole note duration
     */
    Duration[Duration["QuadrupleWhole"] = -4] = "QuadrupleWhole";
    /**
     * A double whole note duration
     */
    Duration[Duration["DoubleWhole"] = -2] = "DoubleWhole";
    /**
     * A whole note duration
     */
    Duration[Duration["Whole"] = 1] = "Whole";
    /**
     * A 1/2 note duration
     */
    Duration[Duration["Half"] = 2] = "Half";
    /**
     * A 1/4 note duration
     */
    Duration[Duration["Quarter"] = 4] = "Quarter";
    /**
     * A 1/8 note duration
     */
    Duration[Duration["Eighth"] = 8] = "Eighth";
    /**
     * A 1/16 note duration
     */
    Duration[Duration["Sixteenth"] = 16] = "Sixteenth";
    /**
     * A 1/32 note duration
     */
    Duration[Duration["ThirtySecond"] = 32] = "ThirtySecond";
    /**
     * A 1/64 note duration
     */
    Duration[Duration["SixtyFourth"] = 64] = "SixtyFourth";
    /**
     * A 1/128 note duration
     */
    Duration[Duration["OneHundredTwentyEighth"] = 128] = "OneHundredTwentyEighth";
    /**
     * A 1/256 note duration
     */
    Duration[Duration["TwoHundredFiftySixth"] = 256] = "TwoHundredFiftySixth";
})(Duration || (Duration = {}));
//# sourceMappingURL=Duration.js.map