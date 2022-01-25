import { Beat } from '@src/model/Beat';
import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
export declare class ScoreBrushGlyph extends Glyph {
    private _beat;
    constructor(beat: Beat);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
