/**
 * Lists all modes how alphaTab can scroll the container during playback.
 */
export declare enum ScrollMode {
    /**
     * Do not scroll automatically
     */
    Off = 0,
    /**
     * Scrolling happens as soon the offsets of the cursors change.
     */
    Continuous = 1,
    /**
     * Scrolling happens as soon the cursors exceed the displayed range.
     */
    OffScreen = 2
}
/**
 * This object defines the details on how to generate the vibrato effects.
 * @json
 */
export declare class VibratoPlaybackSettings {
    /**
     * Gets or sets the wavelength of the note-wide vibrato in midi ticks.
     */
    noteWideLength: number;
    /**
     * Gets or sets the amplitude for the note-wide vibrato in semitones.
     */
    noteWideAmplitude: number;
    /**
     * Gets or sets the wavelength of the note-slight vibrato in midi ticks.
     */
    noteSlightLength: number;
    /**
     * Gets or sets the amplitude for the note-slight vibrato in semitones.
     */
    noteSlightAmplitude: number;
    /**
     * Gets or sets the wavelength of the beat-wide vibrato in midi ticks.
     */
    beatWideLength: number;
    /**
     * Gets or sets the amplitude for the beat-wide vibrato in semitones.
     */
    beatWideAmplitude: number;
    /**
     * Gets or sets the wavelength of the beat-slight vibrato in midi ticks.
     */
    beatSlightLength: number;
    /**
     * Gets or sets the amplitude for the beat-slight vibrato in semitones.
     */
    beatSlightAmplitude: number;
}
/**
 * This object defines the details on how to generate the slide effects.
 * @json
 */
export declare class SlidePlaybackSettings {
    /**
     * Gets or sets 1/4 tones (bend value) offset that
     * simple slides like slide-out-below or slide-in-above use.
     */
    simpleSlidePitchOffset: number;
    /**
     * Gets or sets the percentage which the simple slides should take up
     * from the whole note. for "slide into" effects the slide will take place
     * from time 0 where the note is plucked to 25% of the overall note duration.
     * For "slide out" effects the slide will start 75% and finish at 100% of the overall
     * note duration.
     */
    simpleSlideDurationRatio: number;
    /**
     * Gets or sets the percentage which the legato and shift slides should take up
     * from the whole note. For a value 0.5 the sliding will start at 50% of the overall note duration
     * and finish at 100%
     */
    shiftSlideDurationRatio: number;
}
/**
 * The player settings control how the audio playback and UI is behaving.
 * @json
 */
export declare class PlayerSettings {
    /**
     * Gets or sets the URL of the sound font to be loaded.
     */
    soundFont: string | null;
    /**
     * Gets or sets the element that should be used for scrolling.
     */
    scrollElement: string;
    /**
     * Gets or sets whether the player should be enabled.
     */
    enablePlayer: boolean;
    /**
     * Gets or sets whether playback cursors should be displayed.
     */
    enableCursor: boolean;
    /**
     * Gets or sets whether the beat cursor should be animated or just ticking.
     */
    enableAnimatedBeatCursor: boolean;
    /**
     * Gets or sets whether the notation elements of the currently played beat should be
     * highlighted.
     */
    enableElementHighlighting: boolean;
    /**
     * Gets or sets alphaTab should provide user interaction features to
     * select playback ranges and jump to the playback position by click (aka. seeking).
     */
    enableUserInteraction: boolean;
    /**
     * Gets or sets the X-offset to add when scrolling.
     */
    scrollOffsetX: number;
    /**
     * Gets or sets the Y-offset to add when scrolling
     */
    scrollOffsetY: number;
    /**
     * Gets or sets the mode how to scroll.
     */
    scrollMode: ScrollMode;
    /**
     * Gets or sets how fast the scrolling to the new position should happen (in milliseconds)
     */
    scrollSpeed: number;
    /**
     * Gets or sets whether the native browser smooth scroll mechanism should be used over a custom animation.
     * @target web
     */
    nativeBrowserSmoothScroll: boolean;
    /**
     * Gets or sets the bend duration in milliseconds for songbook bends.
     */
    songBookBendDuration: number;
    /**
     * Gets or sets the duration of whammy dips in milliseconds for songbook whammys.
     */
    songBookDipDuration: number;
    /**
     * Gets or sets the settings on how the vibrato audio is generated.
     * @json_partial_names
     */
    readonly vibrato: VibratoPlaybackSettings;
    /**
     * Gets or sets the setitngs on how the slide audio is generated.
     * @json_partial_names
     */
    readonly slide: SlidePlaybackSettings;
    /**
     * Gets or sets whether the triplet feel should be applied/played during audio playback.
     */
    playTripletFeel: boolean;
}
