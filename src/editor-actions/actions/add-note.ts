import { Beat } from "../../../dist/types/model/Beat";
import { Note } from "../../../dist/types/model/Note";

const alphaTab = (window as any).alphaTab;

export function addNoteOnBeat(beat: Beat, stringNumber: number) {
    const hasNoteOnString = beat.notes.find((note: Note) => note.string === stringNumber) !== undefined;
    if (hasNoteOnString) {
        // Do not add an existing note
        return;
    }
    const note = new alphaTab.model.Note() as Note;
    note.fret = 0;
    note.string = stringNumber;
    beat.addNote(note);
    beat.finish(null);
    return note;
}