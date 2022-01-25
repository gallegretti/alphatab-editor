// TODO: rework model to specify for each finger 
// on which frets they are placed. 
/**
 * A chord definition.
 * @json
 */
export class Chord {
    constructor() {
        /**
         * Gets or sets the name of the chord
         */
        this.name = '';
        /**
         * Indicates the first fret of the chord diagram.
         */
        this.firstFret = 1;
        /**
         * Gets or sets the frets played on the individual strings for this chord.
         * - The order in this list goes from the highest string to the lowest string.
         * - -1 indicates that the string is not played.
         */
        this.strings = [];
        /**
         * Gets or sets a list of frets where the finger should hold a barre
         */
        this.barreFrets = [];
        /**
         * Gets or sets whether the chord name is shown above the chord diagram.
         */
        this.showName = true;
        /**
         * Gets or sets whether the chord diagram is shown.
         */
        this.showDiagram = true;
        /**
         * Gets or sets whether the fingering is shown below the chord diagram.
         */
        this.showFingering = true;
    }
}
//# sourceMappingURL=Chord.js.map