import { Beat } from '@src/model/Beat';
import { HarmonicType } from '@src/model/HarmonicType';
import { Note } from '@src/model/Note';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { NoteEffectInfoBase } from '@src/rendering/effects/NoteEffectInfoBase';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { NotationElement } from '@src/NotationSettings';
export declare class HarmonicsEffectInfo extends NoteEffectInfoBase {
    private _harmonicType;
    private _beat;
    private _effectId;
    get effectId(): string;
    get notationElement(): NotationElement;
    constructor(harmonicType: HarmonicType);
    protected shouldCreateGlyphForNote(note: Note): boolean;
    get sizingMode(): EffectBarGlyphSizing;
    createNewGlyph(renderer: BarRendererBase, beat: Beat): EffectGlyph;
    static harmonicToString(type: HarmonicType): string;
}
