/**
 * Represents the bounds of a single beat.
 */
export class BeatBounds {
    constructor() {
        /**
         * Gets or sets the individual note positions of this beat (if {@link CoreSettings.includeNoteBounds} was set to true).
         */
        this.notes = null;
    }
    /**
     * Adds a new note to this bounds.
     * @param bounds The note bounds to add.
     */
    addNote(bounds) {
        if (!this.notes) {
            this.notes = [];
        }
        bounds.beatBounds = this;
        this.notes.push(bounds);
    }
    getNoteBounds(noteId) {
        var _a, _b;
        return (_b = (_a = this.notes) === null || _a === void 0 ? void 0 : _a.find(note => note.note.id === noteId)) !== null && _b !== void 0 ? _b : null;
    }
    /**
     * Tries to find a note at the given position.
     * @param x The X-position of the note to find.
     * @param y The Y-position of the note to find.
     * @returns The note at the given position or null if no note was found, or the note lookup was not enabled before rendering.
     */
    findNoteBoundsAtPos(x, y) {
        const notes = this.notes;
        if (!notes) {
            return null;
        }
        // TODO: can be likely optimized
        // a beat is mostly vertically aligned, we could sort the note bounds by Y
        // and then do a binary search on the Y-axis.
        for (let note of notes) {
            let bottom = note.noteHeadBounds.y + note.noteHeadBounds.h;
            let right = note.noteHeadBounds.x + note.noteHeadBounds.w;
            if (note.noteHeadBounds.x <= x && note.noteHeadBounds.y <= y && x <= right && y <= bottom) {
                return note;
            }
        }
        return null;
    }
    /**
     * Tries to find a note at the given position.
     * @param x The X-position of the note to find.
     * @param y The Y-position of the note to find.
     * @returns The note at the given position or null if no note was found, or the note lookup was not enabled before rendering.
     */
    findNoteAtPos(x, y) {
        var _a, _b;
        return (_b = (_a = this.findNoteBoundsAtPos(x, y)) === null || _a === void 0 ? void 0 : _a.note) !== null && _b !== void 0 ? _b : null;
    }
}
//# sourceMappingURL=BeatBounds.js.map