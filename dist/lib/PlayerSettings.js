/**
 * Lists all modes how alphaTab can scroll the container during playback.
 */
export var ScrollMode;
(function (ScrollMode) {
    /**
     * Do not scroll automatically
     */
    ScrollMode[ScrollMode["Off"] = 0] = "Off";
    /**
     * Scrolling happens as soon the offsets of the cursors change.
     */
    ScrollMode[ScrollMode["Continuous"] = 1] = "Continuous";
    /**
     * Scrolling happens as soon the cursors exceed the displayed range.
     */
    ScrollMode[ScrollMode["OffScreen"] = 2] = "OffScreen";
})(ScrollMode || (ScrollMode = {}));
/**
 * This object defines the details on how to generate the vibrato effects.
 * @json
 */
export class VibratoPlaybackSettings {
    constructor() {
        /**
         * Gets or sets the wavelength of the note-wide vibrato in midi ticks.
         */
        this.noteWideLength = 480;
        /**
         * Gets or sets the amplitude for the note-wide vibrato in semitones.
         */
        this.noteWideAmplitude = 2;
        /**
         * Gets or sets the wavelength of the note-slight vibrato in midi ticks.
         */
        this.noteSlightLength = 480;
        /**
         * Gets or sets the amplitude for the note-slight vibrato in semitones.
         */
        this.noteSlightAmplitude = 2;
        /**
         * Gets or sets the wavelength of the beat-wide vibrato in midi ticks.
         */
        this.beatWideLength = 240;
        /**
         * Gets or sets the amplitude for the beat-wide vibrato in semitones.
         */
        this.beatWideAmplitude = 3;
        /**
         * Gets or sets the wavelength of the beat-slight vibrato in midi ticks.
         */
        this.beatSlightLength = 240;
        /**
         * Gets or sets the amplitude for the beat-slight vibrato in semitones.
         */
        this.beatSlightAmplitude = 3;
    }
}
/**
 * This object defines the details on how to generate the slide effects.
 * @json
 */
export class SlidePlaybackSettings {
    constructor() {
        /**
         * Gets or sets 1/4 tones (bend value) offset that
         * simple slides like slide-out-below or slide-in-above use.
         */
        this.simpleSlidePitchOffset = 6;
        /**
         * Gets or sets the percentage which the simple slides should take up
         * from the whole note. for "slide into" effects the slide will take place
         * from time 0 where the note is plucked to 25% of the overall note duration.
         * For "slide out" effects the slide will start 75% and finish at 100% of the overall
         * note duration.
         */
        this.simpleSlideDurationRatio = 0.25;
        /**
         * Gets or sets the percentage which the legato and shift slides should take up
         * from the whole note. For a value 0.5 the sliding will start at 50% of the overall note duration
         * and finish at 100%
         */
        this.shiftSlideDurationRatio = 0.5;
    }
}
/**
 * The player settings control how the audio playback and UI is behaving.
 * @json
 */
export class PlayerSettings {
    constructor() {
        /**
         * Gets or sets the URL of the sound font to be loaded.
         */
        this.soundFont = null;
        /**
         * Gets or sets the element that should be used for scrolling.
         */
        this.scrollElement = 'html,body';
        /**
         * Gets or sets whether the player should be enabled.
         */
        this.enablePlayer = false;
        /**
         * Gets or sets whether playback cursors should be displayed.
         */
        this.enableCursor = true;
        /**
         * Gets or sets whether the beat cursor should be animated or just ticking.
         */
        this.enableAnimatedBeatCursor = true;
        /**
         * Gets or sets whether the notation elements of the currently played beat should be
         * highlighted.
         */
        this.enableElementHighlighting = true;
        /**
         * Gets or sets alphaTab should provide user interaction features to
         * select playback ranges and jump to the playback position by click (aka. seeking).
         */
        this.enableUserInteraction = true;
        /**
         * Gets or sets the X-offset to add when scrolling.
         */
        this.scrollOffsetX = 0;
        /**
         * Gets or sets the Y-offset to add when scrolling
         */
        this.scrollOffsetY = 0;
        /**
         * Gets or sets the mode how to scroll.
         */
        this.scrollMode = ScrollMode.Continuous;
        /**
         * Gets or sets how fast the scrolling to the new position should happen (in milliseconds)
         */
        this.scrollSpeed = 300;
        /**
         * Gets or sets whether the native browser smooth scroll mechanism should be used over a custom animation.
         * @target web
         */
        this.nativeBrowserSmoothScroll = true;
        /**
         * Gets or sets the bend duration in milliseconds for songbook bends.
         */
        this.songBookBendDuration = 75;
        /**
         * Gets or sets the duration of whammy dips in milliseconds for songbook whammys.
         */
        this.songBookDipDuration = 150;
        /**
         * Gets or sets the settings on how the vibrato audio is generated.
         * @json_partial_names
         */
        this.vibrato = new VibratoPlaybackSettings();
        /**
         * Gets or sets the setitngs on how the slide audio is generated.
         * @json_partial_names
         */
        this.slide = new SlidePlaybackSettings();
        /**
         * Gets or sets whether the triplet feel should be applied/played during audio playback.
         */
        this.playTripletFeel = true;
    }
}
//# sourceMappingURL=PlayerSettings.js.map