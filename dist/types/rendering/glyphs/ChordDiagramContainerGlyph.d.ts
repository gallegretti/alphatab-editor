import { Chord } from '@src/model/Chord';
import { RowContainerGlyph } from './RowContainerGlyph';
export declare class ChordDiagramContainerGlyph extends RowContainerGlyph {
    constructor(x: number, y: number);
    addChord(chord: Chord): void;
}
