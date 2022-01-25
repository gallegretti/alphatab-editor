import { TripletFeel } from '@src/model/TripletFeel';
import { ICanvas } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export declare enum TripletFeelGlyphBarType {
    Full = 0,
    PartialLeft = 1,
    PartialRight = 2
}
export declare class TripletFeelGlyph extends EffectGlyph {
    private static readonly NoteScale;
    private static readonly NoteHeight;
    private static readonly NoteSeparation;
    private static readonly BarHeight;
    private static readonly BarSeparation;
    private _tripletFeel;
    constructor(tripletFeel: TripletFeel);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    private renderBarNote;
    private renderTriplet;
}
