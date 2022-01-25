/**
 * Lists the different modes on how rhythm notation is shown on the tab staff.
 */
export declare enum TabRhythmMode {
    /**
     * Rhythm notation is hidden.
     */
    Hidden = 0,
    /**
     * Rhythm notation is shown with individual beams per beat.
     */
    ShowWithBeams = 1,
    /**
     * Rhythm notation is shown and behaves like normal score notation with connected bars.
     */
    ShowWithBars = 2
}
/**
 * Lists all modes on how fingerings should be displayed.
 */
export declare enum FingeringMode {
    /**
     * Fingerings will be shown in the standard notation staff.
     */
    ScoreDefault = 0,
    /**
     * Fingerings will be shown in the standard notation staff. Piano finger style is enforced, where
     * fingers are rendered as 1-5 instead of p,i,m,a,c and T,1,2,3,4.
     */
    ScoreForcePiano = 1,
    /**
     * Fingerings will be shown in a effect band above the tabs in case
     * they have only a single note on the beat.
     */
    SingleNoteEffectBand = 2,
    /**
     * Fingerings will be shown in a effect band above the tabs in case
     * they have only a single note on the beat. Piano finger style is enforced, where
     * fingers are rendered as 1-5 instead of p,i,m,a,c and T,1,2,3,4.
     */
    SingleNoteEffectBandForcePiano = 3
}
/**
 * Lists all modes on how alphaTab can handle the display and playback of music notation.
 */
export declare enum NotationMode {
    /**
     * Music elements will be displayed and played as in Guitar Pro.
     */
    GuitarPro = 0,
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
    SongBook = 1
}
/**
 * Lists all major music notation elements that are part
 * of the music sheet and can be dynamically controlled to be shown
 * or hidden.
 */
export declare enum NotationElement {
    /**
     * The score title shown at the start of the music sheet.
     */
    ScoreTitle = 0,
    /**
     * The score subtitle shown at the start of the music sheet.
     */
    ScoreSubTitle = 1,
    /**
     * The score artist shown at the start of the music sheet.
     */
    ScoreArtist = 2,
    /**
     * The score album shown at the start of the music sheet.
     */
    ScoreAlbum = 3,
    /**
     * The score words author shown at the start of the music sheet.
     */
    ScoreWords = 4,
    /**
     * The score music author shown at the start of the music sheet.
     */
    ScoreMusic = 5,
    /**
     * The score words&music author shown at the start of the music sheet.
     */
    ScoreWordsAndMusic = 6,
    /**
     * The score copyright owner shown at the start of the music sheet.
     */
    ScoreCopyright = 7,
    /**
     * The tuning information of the guitar shown
     * above the staves.
     */
    GuitarTuning = 8,
    /**
     * The track names which are shown in the accolade.
     */
    TrackNames = 9,
    /**
     * The chord diagrams for guitars. Usually shown
     * below the score info.
     */
    ChordDiagrams = 10,
    /**
     * Parenthesis that are shown for tied bends
     * if they are preceeded by bends.
     */
    ParenthesisOnTiedBends = 11,
    /**
     * The tab number for tied notes if the
     * bend of a note is increased at that point.
     */
    TabNotesOnTiedBends = 12,
    /**
     * Zero tab numbers on "dive whammys".
     */
    ZerosOnDiveWhammys = 13,
    /**
     * The alternate endings information on repeats shown above the staff.
     */
    EffectAlternateEndings = 14,
    /**
     * The information about the fret on which the capo is placed shown above the staff.
     */
    EffectCapo = 15,
    /**
     * The chord names shown above beats shown above the staff.
     */
    EffectChordNames = 16,
    /**
     * The crescendo/decrescendo angle  shown above the staff.
     */
    EffectCrescendo = 17,
    /**
     * The beat dynamics  shown above the staff.
     */
    EffectDynamics = 18,
    /**
     * The curved angle for fade in/out effects  shown above the staff.
     */
    EffectFadeIn = 19,
    /**
     * The fermata symbol shown above the staff.
     */
    EffectFermata = 20,
    /**
     * The fingering information.
     */
    EffectFingering = 21,
    /**
     * The harmonics names shown above the staff.
     * (does not represent the harmonic note heads)
     */
    EffectHarmonics = 22,
    /**
     * The let ring name and line above the staff.
     */
    EffectLetRing = 23,
    /**
     * The lyrics of the track shown above the staff.
     */
    EffectLyrics = 24,
    /**
     * The section markers shown above the staff.
     */
    EffectMarker = 25,
    /**
     * The ottava symbol and lines shown above the staff.
     */
    EffectOttavia = 26,
    /**
     * The palm mute name and line shown above the staff.
     */
    EffectPalmMute = 27,
    /**
     * The pick slide information shown above the staff.
     * (does not control the pick slide lines)
     */
    EffectPickSlide = 28,
    /**
     * The pick stroke symbols shown above the staff.
     */
    EffectPickStroke = 29,
    /**
     * The slight beat vibrato waves shown above the staff.
     */
    EffectSlightBeatVibrato = 30,
    /**
     * The slight note vibrato waves shown above the staff.
     */
    EffectSlightNoteVibrato = 31,
    /**
     * The tap/slap/pop effect names shown above the staff.
     */
    EffectTap = 32,
    /**
     * The tempo information shown above the staff.
     */
    EffectTempo = 33,
    /**
     * The additional beat text shown above the staff.
     */
    EffectText = 34,
    /**
     * The trill name and waves shown above the staff.
     */
    EffectTrill = 35,
    /**
     * The triplet feel symbol shown above the staff.
     */
    EffectTripletFeel = 36,
    /**
     * The whammy bar information shown above the staff.
     * (does not control the whammy lines shown within the staff)
     */
    EffectWhammyBar = 37,
    /**
     * The wide beat vibrato waves shown above the staff.
     */
    EffectWideBeatVibrato = 38,
    /**
     * The wide note vibrato waves shown above the staff.
     */
    EffectWideNoteVibrato = 39,
    /**
     * The left hand tap symbol shown above the staff.
     */
    EffectLeftHandTap = 40
}
/**
 * The notation settings control how various music notation elements are shown and behaving
 * @json
 */
export declare class NotationSettings {
    /**
     * Gets or sets the mode to use for display and play music notation elements.
     */
    notationMode: NotationMode;
    /**
     * Gets or sets the fingering mode to use.
     */
    fingeringMode: FingeringMode;
    /**
     * Gets or sets the configuration on whether music notation elements are visible or not.
     * If notation elements are not specified, the default configuration will be applied.
     */
    elements: Map<NotationElement, boolean>;
    /**
     * Gets the default configuration of the {@see notationElements} setting. Do not modify
     * this map as it might not result in the expected side effects.
     * If items are not listed explicitly in this list, they are considered visible.
     */
    static defaultElements: Map<NotationElement, boolean>;
    /**
     * Whether to show rhythm notation in the guitar tablature.
     */
    rhythmMode: TabRhythmMode;
    /**
     * The height of the rythm bars.
     */
    rhythmHeight: number;
    /**
     * The transposition pitch offsets for the individual tracks.
     * They apply to rendering and playback.
     */
    transpositionPitches: number[];
    /**
     * The transposition pitch offsets for the individual tracks.
     * They apply to rendering only.
     */
    displayTranspositionPitches: number[];
    /**
     * If set to true the guitar tabs on grace beats are rendered smaller.
     */
    smallGraceTabNotes: boolean;
    /**
     * If set to true bend arrows expand to the end of the last tied note
     * of the string. Otherwise they end on the next beat.
     */
    extendBendArrowsOnTiedNotes: boolean;
    /**
     * If set to true, line effects (like w/bar, let-ring etc)
     * are drawn until the end of the beat instead of the start.
     */
    extendLineEffectsToBeatEnd: boolean;
    /**
     * Gets or sets the height for slurs. The factor is multiplied with the a logarithmic distance
     * between slur start and end.
     */
    slurHeight: number;
    /**
     * Gets whether the given music notation element should be shown
     * @param element the element to check
     * @returns true if the element should be shown, otherwise false.
     */
    isNotationElementVisible(element: NotationElement): boolean;
}
