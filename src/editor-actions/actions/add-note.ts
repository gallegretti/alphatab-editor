import { Beat } from "../../../dist/types/model/Beat";
import { Note } from "../../../dist/types/model/Note";

const alphaTab = (window as any).alphaTab;

export function addNote(beat: Beat, note: Note) {
    const hasNoteOnString = beat.notes.find((beatNote: Note) => beatNote.string === note.string) !== undefined;
    if (hasNoteOnString) {
        // Do not add an existing note
        return;
    }
    beat.addNote(note);
    beat.finish(null);
    return note;
}