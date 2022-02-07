import { Note } from "../../../dist/types/model/Note";

export function removeNote(note: Note) {
    note.beat.removeNote(note);
}
