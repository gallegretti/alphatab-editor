import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { BarBounds } from '@src/rendering/utils/BarBounds';
import { Bounds } from '@src/rendering/utils/Bounds';
import { NoteBounds } from '@src/rendering/utils/NoteBounds';
/**
 * Represents the bounds of a single beat.
 */
export declare class BeatBounds {
    /**
     * Gets or sets the reference to the parent {@link BarBounds}.
     */
    barBounds: BarBounds;
    /**
     * Gets or sets the bounds covering all visually visible elements spanning this beat.
     */
    visualBounds: Bounds;
    /**
     * Gets or sets the actual bounds of the elements in this beat including whitespace areas.
     */
    realBounds: Bounds;
    /**
     * Gets or sets the beat related to this bounds.
     */
    beat: Beat;
    /**
     * Gets or sets the individual note positions of this beat (if {@link CoreSettings.includeNoteBounds} was set to true).
     */
    notes: NoteBounds[] | null;
    /**
     * Adds a new note to this bounds.
     * @param bounds The note bounds to add.
     */
    addNote(bounds: NoteBounds): void;
    getNoteBounds(noteId: number): NoteBounds | null;
    /**
     * Tries to find a note at the given position.
     * @param x The X-position of the note to find.
     * @param y The Y-position of the note to find.
     * @returns The note at the given position or null if no note was found, or the note lookup was not enabled before rendering.
     */
    findNoteBoundsAtPos(x: number, y: number): NoteBounds | null;
    /**
     * Tries to find a note at the given position.
     * @param x The X-position of the note to find.
     * @param y The Y-position of the note to find.
     * @returns The note at the given position or null if no note was found, or the note lookup was not enabled before rendering.
     */
    findNoteAtPos(x: number, y: number): Note | null;
}
