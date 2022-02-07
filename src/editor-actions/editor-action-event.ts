import { Beat } from "../../dist/types/model/Beat";
import { Note } from "../../dist/types/model/Note";

interface EditorActionEventAddNote {
    type: 'add-note',
    data: {
        beat: Beat,
        fret: number,
        string: number,
    }
}

interface EditorActionEventRemoveNote {
    type: 'remove-note',
    data: {
        note: Note
    }
}

interface EditorActionSetFret {
    type: 'set-fret',
    data: {
        note: Note,
        fret: number
    }
}


export type EditorActionEvent = EditorActionEventAddNote | EditorActionEventRemoveNote | EditorActionSetFret;
   