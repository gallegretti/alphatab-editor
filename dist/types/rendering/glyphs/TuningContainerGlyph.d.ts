import { Tuning } from '@src/model/Tuning';
import { RowContainerGlyph } from './RowContainerGlyph';
export declare class TuningContainerGlyph extends RowContainerGlyph {
    constructor(x: number, y: number);
    addTuning(tuning: Tuning, trackLabel: string): void;
}
