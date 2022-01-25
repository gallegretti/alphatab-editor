import { Clef } from '@src/model/Clef';
import { MasterBar } from '@src/model/MasterBar';
import { Ottavia } from '@src/model/Ottavia';
import { SimileMark } from '@src/model/SimileMark';
import { Staff } from '@src/model/Staff';
import { Voice } from '@src/model/Voice';
import { Settings } from '@src/Settings';
/**
 * A bar is a single block within a track, also known as Measure.
 * @json
 */
export declare class Bar {
    private static _globalBarId;
    /**
     * Gets or sets the unique id of this bar.
     */
    id: number;
    /**
     * Gets or sets the zero-based index of this bar within the staff.
     * @json_ignore
     */
    index: number;
    /**
     * Gets or sets the next bar that comes after this bar.
     * @json_ignore
     */
    nextBar: Bar | null;
    /**
     * Gets or sets the previous bar that comes before this bar.
     * @json_ignore
     */
    previousBar: Bar | null;
    /**
     * Gets or sets the clef on this bar.
     */
    clef: Clef;
    /**
     * Gets or sets the ottava applied to the clef.
     */
    clefOttava: Ottavia;
    /**
     * Gets or sets the reference to the parent staff.
     * @json_ignore
     */
    staff: Staff;
    /**
     * Gets or sets the list of voices contained in this bar.
     * @json_add addVoice
     */
    voices: Voice[];
    /**
     * Gets or sets the simile mark on this bar.
     */
    simileMark: SimileMark;
    /**
     * Gets a value indicating whether this bar contains multiple voices with notes.
     * @json_ignore
     */
    isMultiVoice: boolean;
    get masterBar(): MasterBar;
    get isEmpty(): boolean;
    addVoice(voice: Voice): void;
    finish(settings: Settings): void;
    calculateDuration(): number;
}
