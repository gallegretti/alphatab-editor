import { Note } from "../../../dist/types/model/Note";

export function setFret(note: Note, fret: number) {
    note.fret = fret;
}
