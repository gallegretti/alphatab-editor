import selectedNoteOverlay from './selected-note-overlay';
import { ScoreRenderer } from "../dist/types/rendering/ScoreRenderer";
import { Note } from '../dist/types/model/Note';
import { Beat } from '../dist/types/model/Beat';

class SelectedNoteController {

    private currentSelectedNote: Note | null = null;

    constructor(private renderer: ScoreRenderer) {
    }

    toggleNoteSelection(data: Note) {
        if (this.currentSelectedNote?.id === data?.id) {
            this.currentSelectedNote = null;
        } else {
            this.currentSelectedNote = data;
        }
        this.redrawOverlay();
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
                .find((note) => note.string > this.currentSelectedNote!.string);
        })
    }

    moveSelectedNoteDown() {
        return this.moveSelectedNoteVertical((beatNotes) => {
            return beatNotes
                .sort((a, b) => b.string - a.string)
                .find((note) => note.string < this.currentSelectedNote!.string);
        });
    }

    hasSelectedNote(): boolean {
        return this.currentSelectedNote !== null;
    }

    getSelectedNote(): Note | null {
        return this.currentSelectedNote;
    }

    setSelectedNote(data: Note | null) {
        this.currentSelectedNote = data;
    }

    redrawOverlay() {
        if (!this.currentSelectedNote) {
            selectedNoteOverlay.drawSelectedNote(null);
            return;
        }
        const newBounds = this.renderer.boundsLookup.getNoteBounds(this.currentSelectedNote);
        selectedNoteOverlay.drawSelectedNote(newBounds.noteHeadBounds);
    }

    private selectNextNote(currentNote: Note, availableNotes: Note[]) {
        const newNote = availableNotes.find((newNote) => newNote.string === currentNote.string);
        if (newNote) {
            return newNote;
        }
        return availableNotes.find((newNote) => newNote.string < currentNote.string) ?? availableNotes.find((newNote) => newNote.string > currentNote.string);
    }

    private selectAvailableNotes(currentBeat: Beat, getBeat: (beat: Beat) => Beat | null) {
        let beat: Beat | null = currentBeat;
        do {
            // Skip empty beats until the next beat with notes is found
            beat = getBeat(beat);
        } while (beat && beat.notes.length === 0)
        return beat?.notes;
    }

    private moveSelectedNoteVertical(getNote: (notes: Note[]) => Note | undefined) {
        if (!this.currentSelectedNote) {
            return;
        }
        const beatNotes = this.currentSelectedNote.beat.notes
        const nextNote = getNote(beatNotes)
        if (!nextNote) {
            return;
        }
        this.setSelectedNote(nextNote);
        this.redrawOverlay();
    }

    private moveSelectedNoteHorizontal(getBeat: (beat: Beat) => Beat | null) {
        const note = this.currentSelectedNote;
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
        this.setSelectedNote(newNote);
        this.redrawOverlay();
    }
}

export default SelectedNoteController;
