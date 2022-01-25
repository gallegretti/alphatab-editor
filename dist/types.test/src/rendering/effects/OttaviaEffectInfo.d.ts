import { Beat } from '@src/model/Beat';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { Settings } from '@src/Settings';
import { NotationElement } from '@src/NotationSettings';
export declare class OttaviaEffectInfo extends EffectBarRendererInfo {
    private _aboveStaff;
    get effectId(): string;
    get notationElement(): NotationElement;
    get hideOnMultiTrack(): boolean;
    get canShareBand(): boolean;
    get sizingMode(): EffectBarGlyphSizing;
    constructor(aboveStaff: boolean);
    shouldCreateGlyph(settings: Settings, beat: Beat): boolean;
    createNewGlyph(renderer: BarRendererBase, beat: Beat): EffectGlyph;
    canExpand(from: Beat, to: Beat): boolean;
}
