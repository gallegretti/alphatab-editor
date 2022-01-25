/**
 * Lists the different position modes for {@link BarRendererBase.getBeatX}
 */
export var BeatXPosition;
(function (BeatXPosition) {
    /**
     * Gets the pre-notes position which is located before the accidentals
     */
    BeatXPosition[BeatXPosition["PreNotes"] = 0] = "PreNotes";
    /**
     * Gets the on-notes position which is located after the accidentals but before the note heads.
     */
    BeatXPosition[BeatXPosition["OnNotes"] = 1] = "OnNotes";
    /**
     * Gets the middle-notes position which is located after in the middle the note heads.
     */
    BeatXPosition[BeatXPosition["MiddleNotes"] = 2] = "MiddleNotes";
    /**
     * Gets position of the stem for this beat
     */
    BeatXPosition[BeatXPosition["Stem"] = 3] = "Stem";
    /**
     * Get the post-notes position which is located at after the note heads.
     */
    BeatXPosition[BeatXPosition["PostNotes"] = 4] = "PostNotes";
    /**
     * Get the end-beat position which is located at the end of the beat. This position is almost
     * equal to the pre-notes position of the next beat.
     */
    BeatXPosition[BeatXPosition["EndBeat"] = 5] = "EndBeat";
})(BeatXPosition || (BeatXPosition = {}));
//# sourceMappingURL=BeatXPosition.js.map