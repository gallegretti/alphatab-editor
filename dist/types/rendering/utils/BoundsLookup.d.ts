import { Beat } from '@src/model/Beat';
import { MasterBar } from '@src/model/MasterBar';
import { Note } from '@src/model/Note';
import { Score } from '@src/model/Score';
import { BeatBounds } from '@src/rendering/utils/BeatBounds';
import { MasterBarBounds } from '@src/rendering/utils/MasterBarBounds';
import { NoteBounds } from '@src/rendering/utils/NoteBounds';
import { StaveGroupBounds } from '@src/rendering/utils/StaveGroupBounds';
export declare class BoundsLookup {
    /**
     * @target web
     */
    toJson(): unknown;
    /**
     * @target web
     */
    static fromJson(json: unknown, score: Score): BoundsLookup;
    /**
     * @target web
     */
    private boundsToJson;
    private _beatLookup;
    private _masterBarLookup;
    private _currentStaveGroup;
    /**
     * Gets a list of all individual stave groups contained in the rendered music notation.
     */
    staveGroups: StaveGroupBounds[];
    /**
     * Gets or sets a value indicating whether this lookup was finished already.
     */
    isFinished: boolean;
    /**
     * Finishes the lookup for optimized access.
     */
    finish(): void;
    /**
     * Adds a new note to the lookup.
     * @param bounds The note bounds to add.
     */
    addNote(bounds: NoteBounds): void;
    /**
     * Adds a new stave group to the lookup.
     * @param bounds The stave group bounds to add.
     */
    addStaveGroup(bounds: StaveGroupBounds): void;
    /**
     * Adds a new master bar to the lookup.
     * @param bounds The master bar bounds to add.
     */
    addMasterBar(bounds: MasterBarBounds): void;
    /**
     * Adds a new beat to the lookup.
     * @param bounds The beat bounds to add.
     */
    addBeat(bounds: BeatBounds): void;
    /**
     * Tries to find the master bar bounds by a given index.
     * @param index The index of the master bar to find.
     * @returns The master bar bounds if it was rendered, or null if no boundary information is available.
     */
    findMasterBarByIndex(index: number): MasterBarBounds | null;
    /**
     * Tries to find the master bar bounds by a given master bar.
     * @param bar The master bar to find.
     * @returns The master bar bounds if it was rendered, or null if no boundary information is available.
     */
    findMasterBar(bar: MasterBar): MasterBarBounds | null;
    /**
     * Tries to find the bounds of a given beat.
     * @param beat The beat to find.
     * @returns The beat bounds if it was rendered, or null if no boundary information is available.
     */
    findBeat(beat: Beat): BeatBounds | null;
    /**
     * Tries to find a beat at the given absolute position.
     * @param x The absolute X-position of the beat to find.
     * @param y The absolute Y-position of the beat to find.
     * @returns The beat found at the given position or null if no beat could be found.
     */
    getBeatAtPos(x: number, y: number): Beat | null;
    getNoteBounds(note: Note): NoteBounds | null;
    /**
     * Tries to find the note at the given position using the given beat for fast access.
     * Use {@link findBeat} to find a beat for a given position first.
     * @param beat The beat containing the note.
     * @param x The X-position of the note to find.
     * @param y The Y-position of the note to find.
     * @returns The note at the given position within the beat or null if no note could be found.
     */
    getNoteBoundsAtPos(beat: Beat, x: number, y: number): NoteBounds | null;
    /**
     * Tries to find the note at the given position using the given beat for fast access.
     * Use {@link findBeat} to find a beat for a given position first.
     * @param beat The beat containing the note.
     * @param x The X-position of the note to find.
     * @param y The Y-position of the note to find.
     * @returns The note at the given position within the beat or null if no note could be found.
     */
    getNoteAtPos(beat: Beat, x: number, y: number): Note | null;
}
