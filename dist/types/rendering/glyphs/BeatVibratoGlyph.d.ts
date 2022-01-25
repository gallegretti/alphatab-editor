import { VibratoType } from '@src/model/VibratoType';
import { ICanvas } from '@src/platform/ICanvas';
import { GroupedEffectGlyph } from '@src/rendering/glyphs/GroupedEffectGlyph';
export declare class BeatVibratoGlyph extends GroupedEffectGlyph {
    private _type;
    private _stepSize;
    constructor(type: VibratoType);
    doLayout(): void;
    protected paintGrouped(cx: number, cy: number, endX: number, canvas: ICanvas): void;
}
