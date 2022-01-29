import selectedNoteOverlay from './selected-note-overlay';
import { NoteAndBounds } from './editor-ui-event';
import { ScoreRenderer } from "../dist/types/rendering/ScoreRenderer";

const at = (window as any).at;

class SelectedNoteController {

    constructor(private renderer: ScoreRenderer) {
    }

    currentSelectedNote: NoteAndBounds = null;
    toggleNoteSelection(data: NoteAndBounds) {
        if (this.currentSelectedNote?.note?.id === data?.note?.id) {
            this.currentSelectedNote = null;
            selectedNoteOverlay.drawSelectedNote(null);
        } else {
            this.currentSelectedNote = data;
            selectedNoteOverlay.drawSelectedNote(data.noteBounds);
        }
    }

    moveSelectedNoteLeft() {
        return this.moveSelectedNoteHorizontal((beat) => beat.previousBeat);
    }

    moveSelectedNoteRight() {
        return this.moveSelectedNoteHorizontal((beat) => beat.nextBeat);
    }

    moveSelectedNoteUp() {
        return this.moveSelectedNoteVertical((beatNotes) => {
            return beatNotes
                .sort((a, b) => a.string - b.string)
                .find((note) => note.string > this.currentSelectedNote.note.string);
        })
    }

    moveSelectedNoteDown() {
        return this.moveSelectedNoteVertical((beatNotes) => {
            return beatNotes
                .sort((a, b) => b.string - a.string)
                .find((note) => note.string < this.currentSelectedNote.note.string);
        });
    }

    hasSelectedNote() {
        return this.currentSelectedNote !== null;
    }

    getSelectedNote() {
        return this.currentSelectedNote;
    }

    setSelectedNote(data) {
        this.currentSelectedNote = data;
        selectedNoteOverlay.drawSelectedNote(null);
    }


    // Private

    selectNextNote(currentNote, availableNotes) {
        const newNote = availableNotes.find((newNote) => newNote.string === currentNote.string);
        if (newNote) {
            return newNote;
        }
        return availableNotes.find((newNote) => newNote.string < currentNote.string) ?? availableNotes.find((newNote) => newNote.string > currentNote.string);
    }

    selectAvailableNotes(currentBeat, getBeat) {
        let beat = currentBeat;
        do {
            // Skip empty beats until the next beat with notes is found
            beat = getBeat(beat, getBeat);
        } while (beat && beat.notes.length === 0)
        return beat?.notes;
    }

    moveSelectedNoteVertical(getNote) {
        if (!this.currentSelectedNote) {
            return;
        }
        const beatNotes = this.currentSelectedNote.note.beat.notes
        const nextNote = getNote(beatNotes)
        if (!nextNote) {
            return;
        }
        const newNoteData = this.renderer.boundsLookup.getNoteBounds(nextNote);
        this.setSelectedNote({
            note: newNoteData.note,
            noteBounds: newNoteData.noteHeadBounds,
            beatBounds: newNoteData.beatBounds.visualBounds,
        });
        this.redrawOverlay();
    }

    moveSelectedNoteHorizontal(getBeat) {
        console.log('moveSelectedNoteHorizontal');
        const note = this.currentSelectedNote.note;
        if (!note) {
            return;
        }
        const notes = this.selectAvailableNotes(note.beat, getBeat);
        if (!notes) {
            return;
        }
        const newNote = this.selectNextNote(note, notes);
        if (!newNote) {
            return;
        }
        const newNoteData = at.renderer.boundsLookup.getNoteBounds(newNote);
        this.setSelectedNote({
            note: newNoteData.note,
            noteBounds: newNoteData.noteHeadBounds,
            beatBounds: newNoteData.beatBounds.visualBounds,
        });
        this.redrawOverlay();
    }

    redrawOverlay() {
        try {
            // TODO: note bounds is stale, needs to be fetched again
            if (!this.currentSelectedNote.note) {
                selectedNoteOverlay.drawSelectedNote(null);
                return;
            }
            const newBounds = this.renderer.boundsLookup.getNoteBounds(this.currentSelectedNote.note);
            console.log('newBounds', newBounds);
            selectedNoteOverlay.drawSelectedNote(newBounds.noteHeadBounds);
        } catch (e) {
            console.error(e);
        }
    }
}

export default SelectedNoteController;
