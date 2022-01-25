import { Tuning } from './Tuning';
/**
 * This class describes a single staff within a track. There are instruments like pianos
 * where a single track can contain multiple staffs.
 * @json
 */
export class Staff {
    constructor() {
        /**
         * Gets or sets the zero-based index of this staff within the track.
         * @json_ignore
         */
        this.index = 0;
        /**
         * Gets or sets a list of all bars contained in this staff.
         * @json_add addBar
         */
        this.bars = [];
        /**
         * Gets or sets a list of all chords defined for this staff. {@link Beat.chordId} refers to entries in this lookup.
         * @json_add addChord
         */
        this.chords = new Map();
        /**
         * Gets or sets the fret on which a capo is set.
         */
        this.capo = 0;
        /**
         * Gets or sets the number of semitones this track should be
         * transposed. This applies to rendering and playback.
         */
        this.transpositionPitch = 0;
        /**
         * Gets or sets the number of semitones this track should be
         * transposed. This applies only to rendering.
         */
        this.displayTranspositionPitch = 0;
        /**
         * Get or set the guitar tuning of the guitar. This tuning also indicates the number of strings shown in the
         * guitar tablature. Unlike the {@link Note.string} property this array directly represents
         * the order of the tracks shown in the tablature. The first item is the most top tablature line.
         */
        this.stringTuning = new Tuning("", [], false);
        /**
         * Gets or sets whether the tabs are shown.
         */
        this.showTablature = true;
        /**
         * Gets or sets whether the standard notation is shown.
         */
        this.showStandardNotation = true;
        /**
         * Gets or sets whether the staff contains percussion notation
         */
        this.isPercussion = false;
        /**
         * The number of lines shown for the standard notation.
         * For some percussion instruments this number might vary.
         */
        this.standardNotationLineCount = 5;
    }
    /**
     * Get or set the values of the related guitar tuning.
     */
    get tuning() {
        return this.stringTuning.tunings;
    }
    /**
     * Gets or sets the name of the tuning.
     */
    get tuningName() {
        return this.stringTuning.name;
    }
    get isStringed() {
        return this.stringTuning.tunings.length > 0;
    }
    finish(settings) {
        this.stringTuning.finish();
        for (let i = 0, j = this.bars.length; i < j; i++) {
            this.bars[i].finish(settings);
        }
    }
    addChord(chordId, chord) {
        chord.staff = this;
        this.chords.set(chordId, chord);
    }
    addBar(bar) {
        let bars = this.bars;
        bar.staff = this;
        bar.index = bars.length;
        if (bars.length > 0) {
            bar.previousBar = bars[bars.length - 1];
            bar.previousBar.nextBar = bar;
        }
        bars.push(bar);
    }
}
//# sourceMappingURL=Staff.js.map