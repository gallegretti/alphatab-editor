import { Bar } from '@src/model/Bar';
import { Chord } from '@src/model/Chord';
import { Track } from '@src/model/Track';
import { Settings } from '@src/Settings';
import { Tuning } from './Tuning';
/**
 * This class describes a single staff within a track. There are instruments like pianos
 * where a single track can contain multiple staffs.
 * @json
 */
export declare class Staff {
    /**
     * Gets or sets the zero-based index of this staff within the track.
     * @json_ignore
     */
    index: number;
    /**
     * Gets or sets the reference to the track this staff belongs to.
     * @json_ignore
     */
    track: Track;
    /**
     * Gets or sets a list of all bars contained in this staff.
     * @json_add addBar
     */
    bars: Bar[];
    /**
     * Gets or sets a list of all chords defined for this staff. {@link Beat.chordId} refers to entries in this lookup.
     * @json_add addChord
     */
    chords: Map<string, Chord>;
    /**
     * Gets or sets the fret on which a capo is set.
     */
    capo: number;
    /**
     * Gets or sets the number of semitones this track should be
     * transposed. This applies to rendering and playback.
     */
    transpositionPitch: number;
    /**
     * Gets or sets the number of semitones this track should be
     * transposed. This applies only to rendering.
     */
    displayTranspositionPitch: number;
    /**
     * Get or set the guitar tuning of the guitar. This tuning also indicates the number of strings shown in the
     * guitar tablature. Unlike the {@link Note.string} property this array directly represents
     * the order of the tracks shown in the tablature. The first item is the most top tablature line.
     */
    stringTuning: Tuning;
    /**
     * Get or set the values of the related guitar tuning.
     */
    get tuning(): number[];
    /**
     * Gets or sets the name of the tuning.
     */
    get tuningName(): string;
    get isStringed(): boolean;
    /**
     * Gets or sets whether the tabs are shown.
     */
    showTablature: boolean;
    /**
     * Gets or sets whether the standard notation is shown.
     */
    showStandardNotation: boolean;
    /**
     * Gets or sets whether the staff contains percussion notation
     */
    isPercussion: boolean;
    /**
     * The number of lines shown for the standard notation.
     * For some percussion instruments this number might vary.
     */
    standardNotationLineCount: number;
    finish(settings: Settings): void;
    addChord(chordId: string, chord: Chord): void;
    addBar(bar: Bar): void;
}
