import { Beat } from '@src/model/Beat';
import { ICanvas } from '@src/platform/ICanvas';
import { ScoreHelperNotesBaseGlyph } from '@src/rendering/glyphs/ScoreHelperNotesBaseGlyph';
export declare class ScoreWhammyBarGlyph extends ScoreHelperNotesBaseGlyph {
    static readonly SimpleDipHeight: number;
    static readonly SimpleDipPadding: number;
    private _beat;
    constructor(beat: Beat);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    private getBendNoteValue;
}
