import { ICanvas } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export declare class FadeInGlyph extends EffectGlyph {
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
