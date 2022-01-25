/**
 * Represents a group of grace beats that belong together
 */
export class GraceGroup {
    constructor() {
        /**
         * All beats within this group.
         */
        this.beats = [];
        /**
         * Gets a unique ID for this grace group.
         */
        this.id = 'empty';
        /**
         * true if the grace beat are followed by a normal beat within the same
         * bar.
         */
        this.isComplete = false;
    }
    /**
     * Adds a new beat to this group
     * @param beat The beat to add
     */
    addBeat(beat) {
        beat.graceIndex = this.beats.length;
        beat.graceGroup = this;
        this.beats.push(beat);
    }
    finish() {
        if (this.beats.length > 0) {
            this.id = this.beats[0].absoluteDisplayStart + '_' + this.beats[0].voice.index;
        }
    }
}
//# sourceMappingURL=GraceGroup.js.map