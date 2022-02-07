import { EditorActionEvent } from "./editor-action-event";
import { addNote } from "./actions/add-note";
import { removeNote } from "./actions/remove-note";
import { setFret } from "./actions/set-fret";

export default class EditorActions {

    public doAction(action: EditorActionEvent) {
        console.log(action);
        // If a new action is performed and the index is not at the end,
        // invalidate everything after it
        if (this.actionsIndex !== this.actions.length - 1) {
            this.actions = this.actions.slice(this.actionsIndex + 1);
            this.actionsIndex = this.actions.length - 1;
        }

        if (action.type === 'add-note') {
            addNote(action.data.beat, action.data.note);
        }
        if (action.type === 'remove-note') {
            removeNote(action.data.note);
        }
        if (action.type === 'set-fret') {
            // Store previous fret so we can undo
            action.data.previousFret = action.data.note.fret;
            setFret(action.data.note, action.data.fret);
        }

        // And then add this action as the next on the list
        this.actions.push(action);
        this.actionsIndex++;
    }

    public redoAction(): boolean {
        const actionToRedo = this.actionToRedo();
        if (!actionToRedo) {
            return false;
        }
        if (actionToRedo.type === 'add-note') {
            addNote(actionToRedo.data.beat, actionToRedo.data.note);
        }
        if (actionToRedo.type === 'remove-note') {
            removeNote(actionToRedo.data.note);
        }
        if (actionToRedo.type === 'set-fret') {
            setFret(actionToRedo.data.note, actionToRedo.data.fret);
        }
        this.actionsIndex++;
        return true;
    }

    public undoAction(): boolean {
        const actionToUndo = this.actionToUndo();
        if (!actionToUndo) {
            return false;
        }
        if (actionToUndo.type === 'add-note') {
            removeNote(actionToUndo.data.note);
        }
        if (actionToUndo.type === 'remove-note') {
            addNote(actionToUndo.data.note.beat, actionToUndo.data.note);
        }
        if (actionToUndo.type === 'set-fret') {
            setFret(actionToUndo.data.note, actionToUndo.data.previousFret);
        }
        this.actionsIndex--;
        return true;
    }

    private actionToRedo() {
        return this.actions[this.actionsIndex + 1];
    }

    private actionToUndo() {
        return this.actions[this.actionsIndex];
    }

    private actions: EditorActionEvent[] = [];

    /**
     * Index is always equal to the last executed action
     */
    private actionsIndex = -1;
}

