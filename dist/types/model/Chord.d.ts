import { Staff } from '@src/model/Staff';
/**
 * A chord definition.
 * @json
 */
export declare class Chord {
    /**
     * Gets or sets the name of the chord
     */
    name: string;
    /**
     * Indicates the first fret of the chord diagram.
     */
    firstFret: number;
    /**
     * Gets or sets the frets played on the individual strings for this chord.
     * - The order in this list goes from the highest string to the lowest string.
     * - -1 indicates that the string is not played.
     */
    strings: number[];
    /**
     * Gets or sets a list of frets where the finger should hold a barre
     */
    barreFrets: number[];
    /**
     * Gets or sets the staff the chord belongs to.
     * @json_ignore
     */
    staff: Staff;
    /**
     * Gets or sets whether the chord name is shown above the chord diagram.
     */
    showName: boolean;
    /**
     * Gets or sets whether the chord diagram is shown.
     */
    showDiagram: boolean;
    /**
     * Gets or sets whether the fingering is shown below the chord diagram.
     */
    showFingering: boolean;
}
