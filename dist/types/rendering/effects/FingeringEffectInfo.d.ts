import { Beat } from '@src/model/Beat';
import { NotationElement } from '@src/NotationSettings';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { Settings } from '@src/Settings';
export declare class FingeringEffectInfo extends EffectBarRendererInfo {
    get notationElement(): NotationElement;
    get hideOnMultiTrack(): boolean;
    get canShareBand(): boolean;
    get sizingMode(): EffectBarGlyphSizing;
    shouldCreateGlyph(settings: Settings, beat: Beat): boolean;
    createNewGlyph(renderer: BarRendererBase, beat: Beat): EffectGlyph;
    canExpand(from: Beat, to: Beat): boolean;
}
