import { ChordDiagramGlyph } from '@src/rendering/glyphs/ChordDiagramGlyph';
import { RowContainerGlyph } from './RowContainerGlyph';
export class ChordDiagramContainerGlyph extends RowContainerGlyph {
    constructor(x, y) {
        super(x, y);
    }
    addChord(chord) {
        if (chord.strings.length > 0) {
            let chordDiagram = new ChordDiagramGlyph(0, 0, chord);
            chordDiagram.renderer = this.renderer;
            chordDiagram.doLayout();
            this.glyphs.push(chordDiagram);
        }
    }
}
//# sourceMappingURL=ChordDiagramContainerGlyph.js.map