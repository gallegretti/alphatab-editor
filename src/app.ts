import selectedNoteController from './selected-note-controller';
import createEventEmitter from './event-emitter';

createEventEmitter(onEvent);

const at = (window as any).at;
const alphaTab = (window as any).alphaTab;

function onEvent(event) {
    console.log(event);
    if (event.type === 'string-mouse-down') {
        addNoteOnClick(event.data.beat, event.data.stringNumber);
        at.render();
    }
    if (event.type === 'note-mouse-down') {
        selectedNoteController.toggleNoteSelection(event.data);
    }
    if (event.type === 'number-pressed' && selectedNoteController.hasSelectedNote()) {
        event.rawEvent.preventDefault();
        newFretFromInput(event.data.number);
        at.render();
    }
    if (event.type === 'delete-selected-note') {
        const currentSelectedNote = selectedNoteController.getSelectedNote();
        if (currentSelectedNote) {
            removeNote(currentSelectedNote.note);
            selectedNoteController.setSelectedNote(null);
            at.render();
        }
    }
    if (event.type === 'render-finished') {
        selectedNoteController.redrawOverlay();
    }
    if (event.type === 'move-cursor-right' && selectedNoteController.hasSelectedNote()) {
        event.rawEvent.preventDefault();
        selectedNoteController.moveSelectedNoteRight();
    }
    if (event.type === 'move-cursor-left' && selectedNoteController.hasSelectedNote()) {
        event.rawEvent.preventDefault();
        selectedNoteController.moveSelectedNoteLeft();
    }
    if (event.type === 'move-cursor-up' && selectedNoteController.hasSelectedNote()) {
        event.rawEvent.preventDefault();
        selectedNoteController.moveSelectedNoteUp();
    }
    if (event.type === 'move-cursor-down' && selectedNoteController.hasSelectedNote()) {
        event.rawEvent.preventDefault();
        selectedNoteController.moveSelectedNoteDown();
    }
    if (event.type === 'deselect-cursor' && selectedNoteController.hasSelectedNote()) {
        event.rawEvent.preventDefault();
        selectedNoteController.setSelectedNote(null);
    }
}


function newFretFromInput(newInput) {
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


function removeNote(note) {
    note.beat.removeNote(note);
}

function addNoteOnClick(beat, stringNumber) {
    const note = new alphaTab.model.Note();
    note.fret = 0;
    note.string = stringNumber;
    beat.addNote(note);
    beat.finish();
    return note;
}