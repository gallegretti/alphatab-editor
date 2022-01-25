/**
 * Lists the different modes on how rhythm notation is shown on the tab staff.
 */
export var TabRhythmMode;
(function (TabRhythmMode) {
    /**
     * Rhythm notation is hidden.
     */
    TabRhythmMode[TabRhythmMode["Hidden"] = 0] = "Hidden";
    /**
     * Rhythm notation is shown with individual beams per beat.
     */
    TabRhythmMode[TabRhythmMode["ShowWithBeams"] = 1] = "ShowWithBeams";
    /**
     * Rhythm notation is shown and behaves like normal score notation with connected bars.
     */
    TabRhythmMode[TabRhythmMode["ShowWithBars"] = 2] = "ShowWithBars";
})(TabRhythmMode || (TabRhythmMode = {}));
/**
 * Lists all modes on how fingerings should be displayed.
 */
export var FingeringMode;
(function (FingeringMode) {
    /**
     * Fingerings will be shown in the standard notation staff.
     */
    FingeringMode[FingeringMode["ScoreDefault"] = 0] = "ScoreDefault";
    /**
     * Fingerings will be shown in the standard notation staff. Piano finger style is enforced, where
     * fingers are rendered as 1-5 instead of p,i,m,a,c and T,1,2,3,4.
     */
    FingeringMode[FingeringMode["ScoreForcePiano"] = 1] = "ScoreForcePiano";
    /**
     * Fingerings will be shown in a effect band above the tabs in case
     * they have only a single note on the beat.
     */
    FingeringMode[FingeringMode["SingleNoteEffectBand"] = 2] = "SingleNoteEffectBand";
    /**
     * Fingerings will be shown in a effect band above the tabs in case
     * they have only a single note on the beat. Piano finger style is enforced, where
     * fingers are rendered as 1-5 instead of p,i,m,a,c and T,1,2,3,4.
     */
    FingeringMode[FingeringMode["SingleNoteEffectBandForcePiano"] = 3] = "SingleNoteEffectBandForcePiano";
})(FingeringMode || (FingeringMode = {}));
/**
 * Lists all modes on how alphaTab can handle the display and playback of music notation.
 */
export var NotationMode;
(function (NotationMode) {
    /**
     * Music elements will be displayed and played as in Guitar Pro.
     */
    NotationMode[NotationMode["GuitarPro"] = 0] = "GuitarPro";
    /**
     * Music elements will be displayed and played as in traditional songbooks.
     * Changes:
     * 1. Bends
     *   For bends additional grace beats are introduced.
     *   Bends are categorized into gradual and fast bends.
     *   - Gradual bends are indicated by beat text "grad" or "grad.". Bend will sound along the beat duration.
     *   - Fast bends are done right before the next note. If the next note is tied even on-beat of the next note.
     * 2. Whammy Bars
     *   Dips are shown as simple annotation over the beats
     *   Whammy Bars are categorized into gradual and fast.
     *   - Gradual whammys are indicated by beat text "grad" or "grad.". Whammys will sound along the beat duration.
     *   - Fast whammys are done right the beat.
     * 3. Let Ring
     *   Tied notes with let ring are not shown in standard notation
     *   Let ring does not cause a longer playback, duration is defined via tied notes.
     */
    NotationMode[NotationMode["SongBook"] = 1] = "SongBook";
})(NotationMode || (NotationMode = {}));
/**
 * Lists all major music notation elements that are part
 * of the music sheet and can be dynamically controlled to be shown
 * or hidden.
 */
export var NotationElement;
(function (NotationElement) {
    /**
     * The score title shown at the start of the music sheet.
     */
    NotationElement[NotationElement["ScoreTitle"] = 0] = "ScoreTitle";
    /**
     * The score subtitle shown at the start of the music sheet.
     */
    NotationElement[NotationElement["ScoreSubTitle"] = 1] = "ScoreSubTitle";
    /**
     * The score artist shown at the start of the music sheet.
     */
    NotationElement[NotationElement["ScoreArtist"] = 2] = "ScoreArtist";
    /**
     * The score album shown at the start of the music sheet.
     */
    NotationElement[NotationElement["ScoreAlbum"] = 3] = "ScoreAlbum";
    /**
     * The score words author shown at the start of the music sheet.
     */
    NotationElement[NotationElement["ScoreWords"] = 4] = "ScoreWords";
    /**
     * The score music author shown at the start of the music sheet.
     */
    NotationElement[NotationElement["ScoreMusic"] = 5] = "ScoreMusic";
    /**
     * The score words&music author shown at the start of the music sheet.
     */
    NotationElement[NotationElement["ScoreWordsAndMusic"] = 6] = "ScoreWordsAndMusic";
    /**
     * The score copyright owner shown at the start of the music sheet.
     */
    NotationElement[NotationElement["ScoreCopyright"] = 7] = "ScoreCopyright";
    /**
     * The tuning information of the guitar shown
     * above the staves.
     */
    NotationElement[NotationElement["GuitarTuning"] = 8] = "GuitarTuning";
    /**
     * The track names which are shown in the accolade.
     */
    NotationElement[NotationElement["TrackNames"] = 9] = "TrackNames";
    /**
     * The chord diagrams for guitars. Usually shown
     * below the score info.
     */
    NotationElement[NotationElement["ChordDiagrams"] = 10] = "ChordDiagrams";
    /**
     * Parenthesis that are shown for tied bends
     * if they are preceeded by bends.
     */
    NotationElement[NotationElement["ParenthesisOnTiedBends"] = 11] = "ParenthesisOnTiedBends";
    /**
     * The tab number for tied notes if the
     * bend of a note is increased at that point.
     */
    NotationElement[NotationElement["TabNotesOnTiedBends"] = 12] = "TabNotesOnTiedBends";
    /**
     * Zero tab numbers on "dive whammys".
     */
    NotationElement[NotationElement["ZerosOnDiveWhammys"] = 13] = "ZerosOnDiveWhammys";
    /**
     * The alternate endings information on repeats shown above the staff.
     */
    NotationElement[NotationElement["EffectAlternateEndings"] = 14] = "EffectAlternateEndings";
    /**
     * The information about the fret on which the capo is placed shown above the staff.
     */
    NotationElement[NotationElement["EffectCapo"] = 15] = "EffectCapo";
    /**
     * The chord names shown above beats shown above the staff.
     */
    NotationElement[NotationElement["EffectChordNames"] = 16] = "EffectChordNames";
    /**
     * The crescendo/decrescendo angle  shown above the staff.
     */
    NotationElement[NotationElement["EffectCrescendo"] = 17] = "EffectCrescendo";
    /**
     * The beat dynamics  shown above the staff.
     */
    NotationElement[NotationElement["EffectDynamics"] = 18] = "EffectDynamics";
    /**
     * The curved angle for fade in/out effects  shown above the staff.
     */
    NotationElement[NotationElement["EffectFadeIn"] = 19] = "EffectFadeIn";
    /**
     * The fermata symbol shown above the staff.
     */
    NotationElement[NotationElement["EffectFermata"] = 20] = "EffectFermata";
    /**
     * The fingering information.
     */
    NotationElement[NotationElement["EffectFingering"] = 21] = "EffectFingering";
    /**
     * The harmonics names shown above the staff.
     * (does not represent the harmonic note heads)
     */
    NotationElement[NotationElement["EffectHarmonics"] = 22] = "EffectHarmonics";
    /**
     * The let ring name and line above the staff.
     */
    NotationElement[NotationElement["EffectLetRing"] = 23] = "EffectLetRing";
    /**
     * The lyrics of the track shown above the staff.
     */
    NotationElement[NotationElement["EffectLyrics"] = 24] = "EffectLyrics";
    /**
     * The section markers shown above the staff.
     */
    NotationElement[NotationElement["EffectMarker"] = 25] = "EffectMarker";
    /**
     * The ottava symbol and lines shown above the staff.
     */
    NotationElement[NotationElement["EffectOttavia"] = 26] = "EffectOttavia";
    /**
     * The palm mute name and line shown above the staff.
     */
    NotationElement[NotationElement["EffectPalmMute"] = 27] = "EffectPalmMute";
    /**
     * The pick slide information shown above the staff.
     * (does not control the pick slide lines)
     */
    NotationElement[NotationElement["EffectPickSlide"] = 28] = "EffectPickSlide";
    /**
     * The pick stroke symbols shown above the staff.
     */
    NotationElement[NotationElement["EffectPickStroke"] = 29] = "EffectPickStroke";
    /**
     * The slight beat vibrato waves shown above the staff.
     */
    NotationElement[NotationElement["EffectSlightBeatVibrato"] = 30] = "EffectSlightBeatVibrato";
    /**
     * The slight note vibrato waves shown above the staff.
     */
    NotationElement[NotationElement["EffectSlightNoteVibrato"] = 31] = "EffectSlightNoteVibrato";
    /**
     * The tap/slap/pop effect names shown above the staff.
     */
    NotationElement[NotationElement["EffectTap"] = 32] = "EffectTap";
    /**
     * The tempo information shown above the staff.
     */
    NotationElement[NotationElement["EffectTempo"] = 33] = "EffectTempo";
    /**
     * The additional beat text shown above the staff.
     */
    NotationElement[NotationElement["EffectText"] = 34] = "EffectText";
    /**
     * The trill name and waves shown above the staff.
     */
    NotationElement[NotationElement["EffectTrill"] = 35] = "EffectTrill";
    /**
     * The triplet feel symbol shown above the staff.
     */
    NotationElement[NotationElement["EffectTripletFeel"] = 36] = "EffectTripletFeel";
    /**
     * The whammy bar information shown above the staff.
     * (does not control the whammy lines shown within the staff)
     */
    NotationElement[NotationElement["EffectWhammyBar"] = 37] = "EffectWhammyBar";
    /**
     * The wide beat vibrato waves shown above the staff.
     */
    NotationElement[NotationElement["EffectWideBeatVibrato"] = 38] = "EffectWideBeatVibrato";
    /**
     * The wide note vibrato waves shown above the staff.
     */
    NotationElement[NotationElement["EffectWideNoteVibrato"] = 39] = "EffectWideNoteVibrato";
    /**
     * The left hand tap symbol shown above the staff.
     */
    NotationElement[NotationElement["EffectLeftHandTap"] = 40] = "EffectLeftHandTap";
})(NotationElement || (NotationElement = {}));
/**
 * The notation settings control how various music notation elements are shown and behaving
 * @json
 */
export class NotationSettings {
    constructor() {
        /**
         * Gets or sets the mode to use for display and play music notation elements.
         */
        this.notationMode = NotationMode.GuitarPro;
        /**
         * Gets or sets the fingering mode to use.
         */
        this.fingeringMode = FingeringMode.ScoreDefault;
        /**
         * Gets or sets the configuration on whether music notation elements are visible or not.
         * If notation elements are not specified, the default configuration will be applied.
         */
        this.elements = new Map();
        /**
         * Whether to show rhythm notation in the guitar tablature.
         */
        this.rhythmMode = TabRhythmMode.Hidden;
        /**
         * The height of the rythm bars.
         */
        this.rhythmHeight = 15;
        /**
         * The transposition pitch offsets for the individual tracks.
         * They apply to rendering and playback.
         */
        this.transpositionPitches = [];
        /**
         * The transposition pitch offsets for the individual tracks.
         * They apply to rendering only.
         */
        this.displayTranspositionPitches = [];
        /**
         * If set to true the guitar tabs on grace beats are rendered smaller.
         */
        this.smallGraceTabNotes = true;
        /**
         * If set to true bend arrows expand to the end of the last tied note
         * of the string. Otherwise they end on the next beat.
         */
        this.extendBendArrowsOnTiedNotes = true;
        /**
         * If set to true, line effects (like w/bar, let-ring etc)
         * are drawn until the end of the beat instead of the start.
         */
        this.extendLineEffectsToBeatEnd = false;
        /**
         * Gets or sets the height for slurs. The factor is multiplied with the a logarithmic distance
         * between slur start and end.
         */
        this.slurHeight = 5.0;
    }
    /**
     * Gets whether the given music notation element should be shown
     * @param element the element to check
     * @returns true if the element should be shown, otherwise false.
     */
    isNotationElementVisible(element) {
        if (this.elements.has(element)) {
            return this.elements.get(element);
        }
        if (NotationSettings.defaultElements.has(element)) {
            return NotationSettings.defaultElements.get(element);
        }
        return true;
    }
}
/**
 * Gets the default configuration of the {@see notationElements} setting. Do not modify
 * this map as it might not result in the expected side effects.
 * If items are not listed explicitly in this list, they are considered visible.
 */
NotationSettings.defaultElements = new Map([
    [NotationElement.ZerosOnDiveWhammys, false]
]);
//# sourceMappingURL=NotationSettings.js.map