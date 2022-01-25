import { Automation } from '@src/model/Automation';
import { Beat } from '@src/model/Beat';
import { Fermata } from '@src/model/Fermata';
import { KeySignature } from '@src/model/KeySignature';
import { KeySignatureType } from '@src/model/KeySignatureType';
import { RepeatGroup } from '@src/model/RepeatGroup';
import { Score } from '@src/model/Score';
import { Section } from '@src/model/Section';
import { TripletFeel } from '@src/model/TripletFeel';
/**
 * The MasterBar stores information about a bar which affects
 * all tracks.
 * @json
 */
export declare class MasterBar {
    static readonly MaxAlternateEndings: number;
    /**
     * Gets or sets the bitflag for the alternate endings. Each bit defines for which repeat counts
     * the bar is played.
     */
    alternateEndings: number;
    /**
     * Gets or sets the next masterbar in the song.
     * @json_ignore
     */
    nextMasterBar: MasterBar | null;
    /**
     * Gets or sets the next masterbar in the song.
     * @json_ignore
     */
    previousMasterBar: MasterBar | null;
    /**
     * Gets the zero based index of the masterbar.
     * @json_ignore
     */
    index: number;
    /**
     * Gets or sets the key signature used on all bars.
     */
    keySignature: KeySignature;
    /**
     * Gets or sets the type of key signature (major/minor)
     */
    keySignatureType: KeySignatureType;
    /**
     * Gets or sets whether a double bar is shown for this masterbar.
     */
    isDoubleBar: boolean;
    /**
     * Gets or sets whether a repeat section starts on this masterbar.
     */
    isRepeatStart: boolean;
    get isRepeatEnd(): boolean;
    /**
     * Gets or sets the number of repeats for the current repeat section.
     */
    repeatCount: number;
    /**
     * Gets or sets the repeat group this bar belongs to.
     * @json_ignore
     */
    repeatGroup: RepeatGroup;
    /**
     * Gets or sets the time signature numerator.
     */
    timeSignatureNumerator: number;
    /**
     * Gets or sets the time signature denominiator.
     */
    timeSignatureDenominator: number;
    /**
     * Gets or sets whether this is bar has a common time signature.
     */
    timeSignatureCommon: boolean;
    /**
     * Gets or sets the triplet feel that is valid for this bar.
     */
    tripletFeel: TripletFeel;
    /**
     * Gets or sets the new section information for this bar.
     */
    section: Section | null;
    get isSectionStart(): boolean;
    /**
     * Gets or sets the tempo automation for this bar.
     */
    tempoAutomation: Automation | null;
    /**
     * Gets or sets the reference to the score this song belongs to.
     * @json_ignore
     */
    score: Score;
    /**
     * Gets or sets the fermatas for this bar. The key is the offset of the fermata in midi ticks.
     */
    fermata: Map<number, Fermata>;
    /**
     * The timeline position of the voice within the whole score. (unit: midi ticks)
     */
    start: number;
    /**
     * Gets or sets a value indicating whether the master bar is an anacrusis (aka. pickup bar)
     */
    isAnacrusis: boolean;
    /**
     * Calculates the time spent in this bar. (unit: midi ticks)
     */
    calculateDuration(respectAnacrusis?: boolean): number;
    /**
     * Adds a fermata to the masterbar.
     * @param offset The offset of the fermata within the bar in midi ticks.
     * @param fermata The fermata.
     */
    addFermata(offset: number, fermata: Fermata): void;
    /**
     * Gets the fermata for a given beat.
     * @param beat The beat to get the fermata for.
     * @returns
     */
    getFermata(beat: Beat): Fermata | null;
}
