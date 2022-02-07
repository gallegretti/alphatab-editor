import { Beat } from "../../../dist/types/model/Beat";
import { Note } from "../../../dist/types/model/Note";
import { EditorActionResult } from "../editor-action-event";

const alphaTab = (window as any).alphaTab;

export function addNote(beat: Beat, note: Note): EditorActionResult {
    const hasNoteOnString = beat.notes.find((beatNote: Note) => beatNote.string === note.string) !== undefined;
    if (hasNoteOnString) {
        // Do not add an existing note
        return {
            requiresRerender: false
        };
    }
    beat.addNote(note);
    beat.finish(null);
    return {
        requiresRerender: true
    };
}