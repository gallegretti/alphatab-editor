import { Beat } from '@src/model/Beat';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { Settings } from '@src/Settings';
import { NotationElement } from '@src/NotationSettings';
export declare class LetRingEffectInfo extends EffectBarRendererInfo {
    get notationElement(): NotationElement;
    get canShareBand(): boolean;
    get hideOnMultiTrack(): boolean;
    shouldCreateGlyph(settings: Settings, beat: Beat): boolean;
    get sizingMode(): EffectBarGlyphSizing;
    createNewGlyph(renderer: BarRendererBase, beat: Beat): EffectGlyph;
    canExpand(from: Beat, to: Beat): boolean;
}
