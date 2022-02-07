import { Beat } from "../../dist/types/model/Beat";
import { Note } from "../../dist/types/model/Note";

interface EditorActionEventAddNote {
    type: 'add-note',
    data: {
        beat: Beat,
        note: Note,
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
        fret: number,
        previousFret?: number
    }
}


export type EditorActionEvent = EditorActionEventAddNote | EditorActionEventRemoveNote | EditorActionSetFret;
   