import SelectedNoteController from './selected-note-controller';
import createEventEmitter from './event-emitter';
import { EditorUIEvent } from './editor-ui-event';
import EditorActions from './editor-actions/editor-actions';

createEventEmitter(onEditorUIEvent);

const at = (window as any).at;

const editorActions = new EditorActions();
const selectedNoteController = new SelectedNoteController(at.renderer);

function onEditorUIEvent(UIeventData: EditorUIEvent) {
    console.log(UIeventData);
    if (UIeventData.type === 'string-mouse-down') {
        editorActions.doAction({ type: 'add-note', data: { beat: UIeventData.data.beat, fret: 0, string: UIeventData.data.stringNumber } });
        // TODO: Detect if need to render (Might not if a note already exists on this location)
        at.render();
    }
    if (UIeventData.type === 'note-mouse-down') {
        selectedNoteController.toggleNoteSelection(UIeventData.data.note);
    }
    if (UIeventData.type === 'number-pressed' && selectedNoteController.hasSelectedNote()) {
        UIeventData.rawEvent.preventDefault();
        const currentNote = selectedNoteController.getSelectedNote();
        const newFret = newFretFromInput(currentNote.fret, UIeventData.data.number);
        editorActions.doAction({ type: 'set-fret', data: { note: currentNote, fret: newFret } })
        at.render();
    }
    if (UIeventData.type === 'delete-selected-note') {
        const currentSelectedNote = selectedNoteController.getSelectedNote();
        if (currentSelectedNote) {
            editorActions.doAction({ type: 'remove-note', data: { note: currentSelectedNote } });
            selectedNoteController.setSelectedNote(null);
            at.render();
        }
    }
    if (UIeventData.type === 'render-finished') {
        // TODO: It looks like alphaTab will emit the render finished event before it finishes updating the boundsLookup.
        // Needs to investigate if that's the case or something else, and how to remove this timeout
        setTimeout(() => {
            selectedNoteController.redrawOverlay();
        }, 50);
    }
    if (UIeventData.type === 'move-cursor-right' && selectedNoteController.hasSelectedNote()) {
        UIeventData.rawEvent.preventDefault();
        selectedNoteController.moveSelectedNoteRight();
    }
    if (UIeventData.type === 'move-cursor-left' && selectedNoteController.hasSelectedNote()) {
        UIeventData.rawEvent.preventDefault();
        selectedNoteController.moveSelectedNoteLeft();
    }
    if (UIeventData.type === 'move-cursor-up' && selectedNoteController.hasSelectedNote()) {
        UIeventData.rawEvent.preventDefault();
        selectedNoteController.moveSelectedNoteUp();
    }
    if (UIeventData.type === 'move-cursor-down' && selectedNoteController.hasSelectedNote()) {
        UIeventData.rawEvent.preventDefault();
        selectedNoteController.moveSelectedNoteDown();
    }
    if (UIeventData.type === 'deselect-cursor' && selectedNoteController.hasSelectedNote()) {
        UIeventData.rawEvent.preventDefault();
        selectedNoteController.setSelectedNote(null);
    }
}

function newFretFromInput(currentFret: number, newInput: number) {
    let newFret;
    if (currentFret >= 0 && currentFret <= 9) {
        newFret = (currentFret * 10) + newInput;
    } else {
        newFret = newInput;
    }
    if (newFret >= 30) {
        newFret = 0;
    }
    return newFret;
}
