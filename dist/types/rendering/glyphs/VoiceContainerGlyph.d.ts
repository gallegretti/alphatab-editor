import { TupletGroup } from '@src/model/TupletGroup';
import { Voice } from '@src/model/Voice';
import { ICanvas } from '@src/platform/ICanvas';
import { BeatContainerGlyph } from '@src/rendering/glyphs/BeatContainerGlyph';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
import { BarLayoutingInfo } from '@src/rendering/staves/BarLayoutingInfo';
/**
 * This glyph acts as container for handling
 * multiple voice rendering
 */
export declare class VoiceContainerGlyph extends GlyphGroup {
    static readonly KeySizeBeat: string;
    beatGlyphs: BeatContainerGlyph[];
    voice: Voice;
    tupletGroups: TupletGroup[];
    constructor(x: number, y: number, voice: Voice);
    scaleToWidth(width: number): void;
    private scaleToForce;
    registerLayoutingInfo(info: BarLayoutingInfo): void;
    applyLayoutingInfo(info: BarLayoutingInfo): void;
    addGlyph(g: Glyph): void;
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
