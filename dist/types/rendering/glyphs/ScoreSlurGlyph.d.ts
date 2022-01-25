import { Note } from '@src/model/Note';
import { ScoreLegatoGlyph } from './ScoreLegatoGlyph';
export declare class ScoreSlurGlyph extends ScoreLegatoGlyph {
    private _startNote;
    private _endNote;
    constructor(startNote: Note, endNote: Note, forEnd?: boolean);
    protected getTieHeight(startX: number, startY: number, endX: number, endY: number): number;
    protected getStartY(): number;
    protected getEndY(): number;
    private isStartCentered;
    private isEndCentered;
    private isEndOnStem;
    protected getStartX(): number;
    protected getEndX(): number;
}
