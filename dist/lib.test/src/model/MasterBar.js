import { MidiUtils } from '@src/midi/MidiUtils';
import { KeySignature } from '@src/model/KeySignature';
import { KeySignatureType } from '@src/model/KeySignatureType';
import { TripletFeel } from '@src/model/TripletFeel';
/**
 * The MasterBar stores information about a bar which affects
 * all tracks.
 * @json
 */
export class MasterBar {
    constructor() {
        /**
         * Gets or sets the bitflag for the alternate endings. Each bit defines for which repeat counts
         * the bar is played.
         */
        this.alternateEndings = 0;
        /**
         * Gets or sets the next masterbar in the song.
         * @json_ignore
         */
        this.nextMasterBar = null;
        /**
         * Gets or sets the next masterbar in the song.
         * @json_ignore
         */
        this.previousMasterBar = null;
        /**
         * Gets the zero based index of the masterbar.
         * @json_ignore
         */
        this.index = 0;
        /**
         * Gets or sets the key signature used on all bars.
         */
        this.keySignature = KeySignature.C;
        /**
         * Gets or sets the type of key signature (major/minor)
         */
        this.keySignatureType = KeySignatureType.Major;
        /**
         * Gets or sets whether a double bar is shown for this masterbar.
         */
        this.isDoubleBar = false;
        /**
         * Gets or sets whether a repeat section starts on this masterbar.
         */
        this.isRepeatStart = false;
        /**
         * Gets or sets the number of repeats for the current repeat section.
         */
        this.repeatCount = 0;
        /**
         * Gets or sets the time signature numerator.
         */
        this.timeSignatureNumerator = 4;
        /**
         * Gets or sets the time signature denominiator.
         */
        this.timeSignatureDenominator = 4;
        /**
         * Gets or sets whether this is bar has a common time signature.
         */
        this.timeSignatureCommon = false;
        /**
         * Gets or sets the triplet feel that is valid for this bar.
         */
        this.tripletFeel = TripletFeel.NoTripletFeel;
        /**
         * Gets or sets the new section information for this bar.
         */
        this.section = null;
        /**
         * Gets or sets the tempo automation for this bar.
         */
        this.tempoAutomation = null;
        /**
         * Gets or sets the fermatas for this bar. The key is the offset of the fermata in midi ticks.
         */
        this.fermata = new Map();
        /**
         * The timeline position of the voice within the whole score. (unit: midi ticks)
         */
        this.start = 0;
        /**
         * Gets or sets a value indicating whether the master bar is an anacrusis (aka. pickup bar)
         */
        this.isAnacrusis = false;
    }
    get isRepeatEnd() {
        return this.repeatCount > 0;
    }
    get isSectionStart() {
        return !!this.section;
    }
    /**
     * Calculates the time spent in this bar. (unit: midi ticks)
     */
    calculateDuration(respectAnacrusis = true) {
        if (this.isAnacrusis && respectAnacrusis) {
            let duration = 0;
            for (let track of this.score.tracks) {
                for (let staff of track.staves) {
                    let barDuration = this.index < staff.bars.length
                        ? staff.bars[this.index].calculateDuration()
                        : 0;
                    if (barDuration > duration) {
                        duration = barDuration;
                    }
                }
            }
            return duration;
        }
        return this.timeSignatureNumerator * MidiUtils.valueToTicks(this.timeSignatureDenominator);
    }
    /**
     * Adds a fermata to the masterbar.
     * @param offset The offset of the fermata within the bar in midi ticks.
     * @param fermata The fermata.
     */
    addFermata(offset, fermata) {
        this.fermata.set(offset, fermata);
    }
    /**
     * Gets the fermata for a given beat.
     * @param beat The beat to get the fermata for.
     * @returns
     */
    getFermata(beat) {
        if (this.fermata.has(beat.playbackStart)) {
            return this.fermata.get(beat.playbackStart);
        }
        return null;
    }
}
MasterBar.MaxAlternateEndings = 8;
//# sourceMappingURL=MasterBar.js.map