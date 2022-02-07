import { Note } from "../../../dist/types/model/Note";
import { EditorActionResult } from "../editor-action-event";

export function setFret(note: Note, fret: number): EditorActionResult {
    note.fret = fret;
    return {
        requiresRerender: true
    }
}
