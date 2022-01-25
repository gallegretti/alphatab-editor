/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/selected-note-overlay.ts
var SelectedNoteOverlay = /** @class */ (function () {
    function SelectedNoteOverlay() {
    }
    SelectedNoteOverlay.prototype.drawSelectedNote = function (bounds) {
        var selectedNoteElementId = 'selected-note';
        var currentSelection = document.getElementById(selectedNoteElementId);
        if (currentSelection) {
            // Remove current selection
            currentSelection.outerHTML = "";
        }
        if (!bounds) {
            // Nothing to draw
            return;
        }
        var newSelection = document.createElement('div');
        newSelection.id = selectedNoteElementId;
        var padding = 2;
        newSelection.style.cssText = "\n            position: absolute;\n            border-style: solid;\n            border-width: 1px;\n            left: ".concat(bounds.x - padding, "px;\n            top: ").concat(bounds.y - padding, "px;\n            z-index: 99999;\n            width: ").concat(bounds.w + padding * 2, "px;\n            height: ").concat(bounds.h + padding * 2, "px;\n            pointer-events: none;\n        ");
        var alphaTabElement = document.getElementById('alphaTab');
        alphaTabElement.appendChild(newSelection);
    };
    return SelectedNoteOverlay;
}());
/* harmony default export */ const selected_note_overlay = (new SelectedNoteOverlay());

;// CONCATENATED MODULE: ./src/selected-note-controller.ts

var at = window.at;
var SelectedNoteController = /** @class */ (function () {
    function SelectedNoteController() {
        this.currentSelectedNote = null;
    }
    SelectedNoteController.prototype.toggleNoteSelection = function (data) {
        var _a, _b, _c;
        if (((_b = (_a = this.currentSelectedNote) === null || _a === void 0 ? void 0 : _a.note) === null || _b === void 0 ? void 0 : _b.id) === ((_c = data === null || data === void 0 ? void 0 : data.note) === null || _c === void 0 ? void 0 : _c.id)) {
            this.currentSelectedNote = null;
            selected_note_overlay.drawSelectedNote(null);
        }
        else {
            this.currentSelectedNote = data;
            selected_note_overlay.drawSelectedNote(data.noteBounds);
        }
    };
    SelectedNoteController.prototype.moveSelectedNoteLeft = function () {
        return this.moveSelectedNoteHorizontal(function (beat) { return beat.previousBeat; });
    };
    SelectedNoteController.prototype.moveSelectedNoteRight = function () {
        return this.moveSelectedNoteHorizontal(function (beat) { return beat.nextBeat; });
    };
    SelectedNoteController.prototype.moveSelectedNoteUp = function () {
        var _this = this;
        return this.moveSelectedNoteVertical(function (beatNotes) {
            return beatNotes
                .sort(function (a, b) { return a.string - b.string; })
                .find(function (note) { return note.string > _this.currentSelectedNote.note.string; });
        });
    };
    SelectedNoteController.prototype.moveSelectedNoteDown = function () {
        var _this = this;
        return this.moveSelectedNoteVertical(function (beatNotes) {
            return beatNotes
                .sort(function (a, b) { return b.string - a.string; })
                .find(function (note) { return note.string < _this.currentSelectedNote.note.string; });
        });
    };
    SelectedNoteController.prototype.hasSelectedNote = function () {
        return this.currentSelectedNote !== null;
    };
    SelectedNoteController.prototype.getSelectedNote = function () {
        return this.currentSelectedNote;
    };
    SelectedNoteController.prototype.setSelectedNote = function (data) {
        this.currentSelectedNote = data;
        selected_note_overlay.drawSelectedNote(null);
    };
    // Private
    SelectedNoteController.prototype.selectNextNote = function (currentNote, availableNotes) {
        var _a;
        var newNote = availableNotes.find(function (newNote) { return newNote.string === currentNote.string; });
        if (newNote) {
            return newNote;
        }
        return (_a = availableNotes.find(function (newNote) { return newNote.string < currentNote.string; })) !== null && _a !== void 0 ? _a : availableNotes.find(function (newNote) { return newNote.string > currentNote.string; });
    };
    SelectedNoteController.prototype.selectAvailableNotes = function (currentBeat, getBeat) {
        var beat = currentBeat;
        do {
            // Skip empty beats until the next beat with notes is found
            beat = getBeat(beat, getBeat);
        } while (beat && beat.notes.length === 0);
        return beat === null || beat === void 0 ? void 0 : beat.notes;
    };
    SelectedNoteController.prototype.moveSelectedNoteVertical = function (getNote) {
        if (!this.currentSelectedNote) {
            return;
        }
        var beatNotes = this.currentSelectedNote.note.beat.notes;
        var nextNote = getNote(beatNotes);
        if (!nextNote) {
            return;
        }
        var newNoteData = at.renderer.boundsLookup.getNoteBounds(nextNote);
        this.setSelectedNote({
            note: newNoteData.note,
            noteBounds: newNoteData.noteHeadBounds,
            beatBounds: newNoteData.beatBounds.visualBounds,
        });
        this.redrawOverlay();
    };
    SelectedNoteController.prototype.moveSelectedNoteHorizontal = function (getBeat) {
        var note = this.currentSelectedNote.note;
        if (!note) {
            return;
        }
        var notes = this.selectAvailableNotes(note.beat, getBeat);
        if (!notes) {
            return;
        }
        var newNote = this.selectNextNote(note, notes);
        if (!newNote) {
            return;
        }
        var newNoteData = at.renderer.boundsLookup.getNoteBounds(newNote);
        this.setSelectedNote({
            note: newNoteData.note,
            noteBounds: newNoteData.noteHeadBounds,
            beatBounds: newNoteData.beatBounds.visualBounds,
        });
        this.redrawOverlay();
    };
    SelectedNoteController.prototype.redrawOverlay = function () {
        var _a;
        // TODO: note bounds is stale, needs to be fetched again
        selected_note_overlay.drawSelectedNote((_a = this.currentSelectedNote) === null || _a === void 0 ? void 0 : _a.noteBounds);
    };
    return SelectedNoteController;
}());
/* harmony default export */ const selected_note_controller = (new SelectedNoteController());

;// CONCATENATED MODULE: ./src/event-emitter.ts
var callbacks = [];
var event_emitter_at = window.at;
function emitEvent(event) {
    callbacks.forEach(function (callback) { return callback(event); });
}
function getStringNumber(y, barBounds) {
    // TODO: Add padding around first and last frets
    var fretH = barBounds.h / 6;
    if (y > barBounds.y && y < barBounds.y + fretH * 1) {
        return 6;
    }
    if (y > barBounds.y && y < barBounds.y + fretH * 2) {
        return 5;
    }
    if (y > barBounds.y && y < barBounds.y + fretH * 3) {
        return 4;
    }
    if (y > barBounds.y && y < barBounds.y + fretH * 4) {
        return 3;
    }
    if (y > barBounds.y && y < barBounds.y + fretH * 5) {
        return 2;
    }
    if (y > barBounds.y && y < barBounds.y + fretH * 6) {
        return 1;
    }
    return null;
}
$(window).on('alphaTab.beatMouseDown', function (event, beat) {
    var y = window.event.pageY;
    var x = window.event.offsetX;
    var note = event_emitter_at.renderer.boundsLookup.getNoteAtPos(beat, x, y);
    var bounds = event_emitter_at.renderer.boundsLookup.getNoteBounds(note);
    if (bounds) {
        emitEvent({
            type: 'note-mouse-down',
            data: {
                note: note,
                noteBounds: bounds.noteHeadBounds,
                beatBounds: bounds.beatBounds.visualBounds,
            }
        });
        return;
    }
    var barBounds = event_emitter_at.renderer.boundsLookup.findBeat(beat).barBounds.visualBounds;
    var stringNumber = getStringNumber(y, barBounds);
    if (stringNumber) {
        emitEvent({
            type: 'string-mouse-down',
            data: {
                stringNumber: stringNumber,
                beat: beat
            }
        });
    }
});
$(window).on('alphaTab.renderFinished', function (event) {
    emitEvent({
        type: 'render-finished',
        data: {}
    });
});
document.addEventListener('keydown', function (event) {
    console.log(event);
    if (event.type === 'keydown' && event.key >= '0' && event.key <= '9') {
        emitEvent({
            type: 'number-pressed',
            rawEvent: event,
            data: {
                number: parseInt(event.key)
            }
        });
    }
    if (event.type === 'keydown' && event.key === 'Delete') {
        emitEvent({
            type: 'delete-selected-note',
            rawEvent: event,
            data: {}
        });
    }
    if (event.type === 'keydown' && event.key === 'ArrowLeft') {
        emitEvent({
            type: 'move-cursor-left',
            rawEvent: event,
            data: {}
        });
    }
    if (event.type === 'keydown' && event.key === 'ArrowRight') {
        emitEvent({
            type: 'move-cursor-right',
            rawEvent: event,
            data: {}
        });
    }
    if (event.type === 'keydown' && event.key === 'ArrowUp') {
        emitEvent({
            type: 'move-cursor-up',
            rawEvent: event,
            data: {}
        });
    }
    if (event.type === 'keydown' && event.key === 'ArrowDown') {
        emitEvent({
            type: 'move-cursor-down',
            rawEvent: event,
            data: {}
        });
    }
    if (event.type === 'keydown' && event.key === 'Escape') {
        emitEvent({
            type: 'deselect-cursor',
            rawEvent: event,
            data: {}
        });
    }
});
function createEventEmitter(callback) {
    callbacks.push(callback);
}

;// CONCATENATED MODULE: ./src/app.ts


createEventEmitter(onEvent);
var app_at = window.at;
var alphaTab = window.alphaTab;
function onEvent(event) {
    console.log(event);
    if (event.type === 'string-mouse-down') {
        addNoteOnClick(event.data.beat, event.data.stringNumber);
        app_at.render();
    }
    if (event.type === 'note-mouse-down') {
        selected_note_controller.toggleNoteSelection(event.data);
    }
    if (event.type === 'number-pressed' && selected_note_controller.hasSelectedNote()) {
        event.rawEvent.preventDefault();
        newFretFromInput(event.data.number);
        app_at.render();
    }
    if (event.type === 'delete-selected-note') {
        var currentSelectedNote = selected_note_controller.getSelectedNote();
        if (currentSelectedNote) {
            removeNote(currentSelectedNote.note);
            selected_note_controller.setSelectedNote(null);
            app_at.render();
        }
    }
    if (event.type === 'render-finished') {
        selected_note_controller.redrawOverlay();
    }
    if (event.type === 'move-cursor-right' && selected_note_controller.hasSelectedNote()) {
        event.rawEvent.preventDefault();
        selected_note_controller.moveSelectedNoteRight();
    }
    if (event.type === 'move-cursor-left' && selected_note_controller.hasSelectedNote()) {
        event.rawEvent.preventDefault();
        selected_note_controller.moveSelectedNoteLeft();
    }
    if (event.type === 'move-cursor-up' && selected_note_controller.hasSelectedNote()) {
        event.rawEvent.preventDefault();
        selected_note_controller.moveSelectedNoteUp();
    }
    if (event.type === 'move-cursor-down' && selected_note_controller.hasSelectedNote()) {
        event.rawEvent.preventDefault();
        selected_note_controller.moveSelectedNoteDown();
    }
    if (event.type === 'deselect-cursor' && selected_note_controller.hasSelectedNote()) {
        event.rawEvent.preventDefault();
        selected_note_controller.setSelectedNote(null);
    }
}
function newFretFromInput(newInput) {
    var currentNote = selected_note_controller.getSelectedNote().note;
    var currentFret = currentNote.fret;
    var newFret;
    if (currentFret >= 0 && currentFret <= 9) {
        newFret = (currentFret * 10) + newInput;
    }
    else {
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
    var note = new alphaTab.model.Note();
    note.fret = 0;
    note.string = stringNumber;
    beat.addNote(note);
    beat.finish();
    return note;
}

/******/ })()
;