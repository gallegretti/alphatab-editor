class SelectedNoteOverlay {
    drawSelectedNote(bounds) {
        const selectedNoteElementId = 'selected-note';
        const currentSelection = document.getElementById(selectedNoteElementId);
        if (currentSelection) {
            // Remove current selection
            currentSelection.outerHTML = "";
        }
        if (!bounds) {
            // Nothing to draw
            return;
        }
        const newSelection = document.createElement('div');
        newSelection.id = selectedNoteElementId;
        const padding = 2;
        newSelection.style.cssText = `
            position: absolute;
            border-style: solid;
            border-width: 1px;
            left: ${bounds.x - padding}px;
            top: ${bounds.y - padding}px;
            z-index: 99999;
            width: ${bounds.w + padding * 2}px;
            height: ${bounds.h + padding * 2}px;
            pointer-events: none;
        `;
        const alphaTabElement = document.getElementById('alphaTab');
        alphaTabElement.appendChild(newSelection);
    }
}

export default new SelectedNoteOverlay();
