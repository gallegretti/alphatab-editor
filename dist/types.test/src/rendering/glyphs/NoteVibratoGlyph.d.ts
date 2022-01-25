import { VibratoType } from '@src/model/VibratoType';
import { ICanvas } from '@src/platform/ICanvas';
import { GroupedEffectGlyph } from '@src/rendering/glyphs/GroupedEffectGlyph';
export declare class NoteVibratoGlyph extends GroupedEffectGlyph {
    private _type;
    private _scale;
    private _symbol;
    private _symbolSize;
    private _partialWaves;
    constructor(x: number, y: number, type: VibratoType, scale?: number, partialWaves?: boolean);
    doLayout(): void;
    protected paintGrouped(cx: number, cy: number, endX: number, canvas: ICanvas): void;
}
