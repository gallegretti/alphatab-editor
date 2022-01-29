import { Note } from "../dist/types/model/Note";
import { Beat } from "../dist/types/model/Beat";
import { Bounds } from "../dist/types/rendering/utils/Bounds"


export interface NoteAndBounds {
    note: Note,
    noteBounds: Bounds,
    beatBounds: Bounds,
}

interface EditorUIEventNoteMouseDown {
    type: 'note-mouse-down',
    data: NoteAndBounds
}

interface EditorUIEventStringDown {
    type: 'string-mouse-down',
    data: {
        stringNumber: number,
        beat: Beat,
    }
}

interface EditorUIEventRenderFinished {
    type: 'render-finished',
    data: {},
}

interface EditorUIEventNumberPressed {
    type: 'number-pressed',
    rawEvent: Event,
    data: {
        number: number,
    }
}

interface EditorUIEventDeleteSelectedNote {
    type: 'delete-selected-note',
    rawEvent: Event,
    data: {}
}

interface EditorUIEventMoveCursorLeft {
    type: 'move-cursor-left',
    rawEvent: Event,
    data: {}
}

interface EditorUIEventMoveCursorRight {
    type: 'move-cursor-right',
    rawEvent: Event,
    data: {}
}

interface EditorUIEventMoveCursorUp {
    type: 'move-cursor-up',
    rawEvent: Event,
    data: {}
}

interface EditorUIEventMoveCursorDown {
    type: 'move-cursor-down',
    rawEvent: Event,
    data: {}
}

interface EditorUIEventDeselectCursor {
    type: 'deselect-cursor',
    rawEvent: Event,
    data: {}
}


export type EditorUIEvent = 
    EditorUIEventNoteMouseDown |
    EditorUIEventStringDown |
    EditorUIEventRenderFinished |
    EditorUIEventNumberPressed |
    EditorUIEventDeleteSelectedNote |
    EditorUIEventMoveCursorLeft |
    EditorUIEventMoveCursorRight |
    EditorUIEventMoveCursorUp |
    EditorUIEventMoveCursorDown |
    EditorUIEventDeselectCursor;
