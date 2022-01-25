import { GraceType } from '@src/model/GraceType';
/**
 * Represents a list of beats that are grouped within the same tuplet.
 */
export class TupletGroup {
    /**
     * Initializes a new instance of the {@link TupletGroup} class.
     * @param voice The voice this group belongs to.
     */
    constructor(voice) {
        this._isEqualLengthTuplet = true;
        this.totalDuration = 0;
        /**
         * Gets or sets the list of beats contained in this group.
         */
        this.beats = [];
        /**
         * Gets a value indicating whether the tuplet group is fully filled.
         */
        this.isFull = false;
        this.voice = voice;
    }
    check(beat) {
        if (this.beats.length === 0) {
            // accept first beat
            this.beats.push(beat);
            this.totalDuration += beat.playbackDuration;
            return true;
        }
        if (beat.graceType !== GraceType.None) {
            // grace notes do not break tuplet group, but also do not contribute to them.
            return true;
        }
        if (beat.voice !== this.voice ||
            this.isFull ||
            beat.tupletNumerator !== this.beats[0].tupletNumerator ||
            beat.tupletDenominator !== this.beats[0].tupletDenominator) {
            // only same tuplets are potentially accepted
            return false;
        }
        // TBH: I do not really know how the 100% tuplet grouping of Guitar Pro might work
        // it sometimes has really strange rules where notes filling 3 quarters, are considered a full 3:2 tuplet
        // in alphaTab we have now 2 rules where we consider a tuplet full:
        // 1. if all beats have the same length, the tuplet must contain N notes of an N:M tuplet
        // 2. if we have mixed beats, we check if the current set of beats, matches a N:M tuplet
        //    by checking all potential note durations.
        // this logic is very likely not 100% correct but for most cases the tuplets
        // appeared correct.
        if (beat.playbackDuration !== this.beats[0].playbackDuration) {
            this._isEqualLengthTuplet = false;
        }
        this.beats.push(beat);
        this.totalDuration += beat.playbackDuration;
        if (this._isEqualLengthTuplet) {
            if (this.beats.length === this.beats[0].tupletNumerator) {
                this.isFull = true;
            }
        }
        else {
            let factor = (this.beats[0].tupletNumerator / this.beats[0].tupletDenominator) | 0;
            for (let potentialMatch of TupletGroup.AllTicks) {
                if (this.totalDuration === potentialMatch * factor) {
                    this.isFull = true;
                    break;
                }
            }
        }
        return true;
    }
}
TupletGroup.HalfTicks = 1920;
TupletGroup.QuarterTicks = 960;
TupletGroup.EighthTicks = 480;
TupletGroup.SixteenthTicks = 240;
TupletGroup.ThirtySecondTicks = 120;
TupletGroup.SixtyFourthTicks = 60;
TupletGroup.OneHundredTwentyEighthTicks = 30;
TupletGroup.TwoHundredFiftySixthTicks = 15;
TupletGroup.AllTicks = [
    TupletGroup.HalfTicks,
    TupletGroup.QuarterTicks,
    TupletGroup.EighthTicks,
    TupletGroup.SixteenthTicks,
    TupletGroup.ThirtySecondTicks,
    TupletGroup.SixtyFourthTicks,
    TupletGroup.OneHundredTwentyEighthTicks,
    TupletGroup.TwoHundredFiftySixthTicks
];
//# sourceMappingURL=TupletGroup.js.map