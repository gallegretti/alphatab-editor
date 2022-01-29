import SelectedNoteController from './selected-note-controller';
import createEventEmitter from './event-emitter';
import { Note } from '../dist/types/model/Note';
import { Beat } from '../dist/types/model/Beat';
import { EditorUIEvent } from './editor-ui-event';

createEventEmitter(onEditorUIEvent);

const at = (window as any).at;
const alphaTab = (window as any).alphaTab;

const selectedNoteController = new SelectedNoteController(at.renderer);

function onEditorUIEvent(UIevent: EditorUIEvent) {
    console.log(UIevent);
    if (UIevent.type === 'string-mouse-down') {
        // addNoteOnClick(UIevent.data.beat, UIevent.data.stringNumber);
        // at.render();
    }
    if (UIevent.type === 'note-mouse-down') {
        selectedNoteController.toggleNoteSelection(UIevent.data);
    }
    if (UIevent.type === 'number-pressed' && selectedNoteController.hasSelectedNote()) {
        UIevent.rawEvent.preventDefault();
        newFretFromInput(UIevent.data.number);
        at.render();
    }
    if (UIevent.type === 'delete-selected-note') {
        const currentSelectedNote = selectedNoteController.getSelectedNote();
        if (currentSelectedNote) {
            removeNote(currentSelectedNote.note);
            selectedNoteController.setSelectedNote(null);
            at.render();
        }
    }
    if (UIevent.type === 'render-finished') {
        // TODO: It looks like alphaTab will emit the render finished event before it finishes updating the boundsLookup.
        // Needs to investigate if that's the case or something else, and how to remove this timeout
        setTimeout(() => {
            selectedNoteController.redrawOverlay();
        }, 50);
    }
    if (UIevent.type === 'move-cursor-right' && selectedNoteController.hasSelectedNote()) {
        UIevent.rawEvent.preventDefault();
        selectedNoteController.moveSelectedNoteRight();
    }
    if (UIevent.type === 'move-cursor-left' && selectedNoteController.hasSelectedNote()) {
        UIevent.rawEvent.preventDefault();
        selectedNoteController.moveSelectedNoteLeft();
    }
    if (UIevent.type === 'move-cursor-up' && selectedNoteController.hasSelectedNote()) {
        UIevent.rawEvent.preventDefault();
        selectedNoteController.moveSelectedNoteUp();
    }
    if (UIevent.type === 'move-cursor-down' && selectedNoteController.hasSelectedNote()) {
        UIevent.rawEvent.preventDefault();
        selectedNoteController.moveSelectedNoteDown();
    }
    if (UIevent.type === 'deselect-cursor' && selectedNoteController.hasSelectedNote()) {
        UIevent.rawEvent.preventDefault();
        selectedNoteController.setSelectedNote(null);
    }
}

function newFretFromInput(newInput: number) {
    const currentNote = selectedNoteController.getSelectedNote().note;
    const currentFret = currentNote.fret;
    let newFret;
    if (currentFret >= 0 && currentFret <= 9) {
        newFret = (currentFret * 10) + newInput;
    } else {
        newFret = newInput;
    }
    if (newFret >= 30) {
        newFret = 0;
    }
    currentNote.fret = newFret;
}


function removeNote(note: Note) {
    note.beat.removeNote(note);
}

function addNoteOnClick(beat: Beat, stringNumber: number) {
    const note = new alphaTab.model.Note() as Note;
    note.fret = 0;
    note.string = stringNumber;
    beat.addNote(note);
    beat.finish({});
    return note;
}