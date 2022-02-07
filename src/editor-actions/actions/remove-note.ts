import { Note } from "../../../dist/types/model/Note";
import { EditorActionResult } from "../editor-action-event";

export function removeNote(note: Note): EditorActionResult {
    note.beat.removeNote(note);
    return {
        requiresRerender: true
    }
}
