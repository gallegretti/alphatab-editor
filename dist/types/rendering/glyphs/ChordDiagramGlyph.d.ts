import { Chord } from '@src/model/Chord';
import { ICanvas } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export declare class ChordDiagramGlyph extends EffectGlyph {
    private static readonly Padding;
    private static readonly Frets;
    private static readonly CircleRadius;
    private static readonly StringSpacing;
    private static readonly FretSpacing;
    private _chord;
    private _textRow;
    private _fretRow;
    private _firstFretSpacing;
    constructor(x: number, y: number, chord: Chord);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
