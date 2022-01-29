import { EditorUIEvent } from "./editor-ui-event";
import { Bounds } from "../dist/types/rendering/utils/Bounds";

const callbacks = [];

const at = (window as any).at;

function emitEvent(event: EditorUIEvent) {
    callbacks.forEach((callback) => callback(event));
}

function getStringNumber(y: number, barBounds: Bounds) {
    // TODO: Add padding around first and last frets
    const fretH = barBounds.h / 6;
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

$(window).on('alphaTab.beatMouseDown', (event, beat) => {
    const y = (window.event as MouseEvent).pageY;
    const x = (window.event as MouseEvent).offsetX;
    const note = at.renderer.boundsLookup.getNoteAtPos(beat, x, y);
    const bounds = at.renderer.boundsLookup.getNoteBounds(note);
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
    const barBounds = at.renderer.boundsLookup.findBeat(beat).barBounds.visualBounds;
    const stringNumber = getStringNumber(y, barBounds);
    if (stringNumber) {
        emitEvent({
            type: 'string-mouse-down',
            data: {
                stringNumber,
                beat
            }
        });
    }
});

$(window).on('alphaTab.renderFinished', (event) => {
    emitEvent({
        type: 'render-finished',
        data: {}
    })
})

document.addEventListener('keydown', (event) => {
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
        })
    }
    if (event.type === 'keydown' && event.key === 'ArrowRight') {
        emitEvent({
            type: 'move-cursor-right',
            rawEvent: event,
            data: {}
        })
    }
    if (event.type === 'keydown' && event.key === 'ArrowUp') {
        emitEvent({
            type: 'move-cursor-up',
            rawEvent: event,
            data: {}
        })
    }
    if (event.type === 'keydown' && event.key === 'ArrowDown') {
        emitEvent({
            type: 'move-cursor-down',
            rawEvent: event,
            data: {}
        })
    }
    if (event.type === 'keydown' && event.key === 'Escape') {
        emitEvent({
            type: 'deselect-cursor',
            rawEvent: event,
            data: {}
        })
    }
});

export default function createEventEmitter(callback) {
    callbacks.push(callback);
}