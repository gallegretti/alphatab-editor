import { EditorActionEvent } from "./editor-action-event";
import { addNoteOnBeat } from "./actions/add-note";
import { removeNote } from "./actions/remove-note";
import { setFret } from "./actions/set-fret";

export default class EditorActions {

    public doAction(action: EditorActionEvent) {
        // this.actions.push(action);
        // this.actionsIndex++;
        if (action.type === 'add-note') {
            addNoteOnBeat(action.data.beat, action.data.string);
        }
        if (action.type === 'remove-note') {
            removeNote(action.data.note);
        }
        if (action.type === 'set-fret') {
            setFret(action.data.note, action.data.fret);
        }
    }

    public redoAction() {
        // TODO:
    }

    public undoAction() {
        // TODO:
    }

    public canRedoAction() {
        // TODO:
    }

    public canUndoAction() {
        // TODO:
    }

    private actions: EditorActionEvent[] = [];
    private actionsIndex = -1;
}

