import { Bar } from '@src/model/Bar';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { ChordDiagramContainerGlyph } from '@src/rendering/glyphs/ChordDiagramContainerGlyph';
import { TextGlyph } from '@src/rendering/glyphs/TextGlyph';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
import { StaveGroup } from '@src/rendering/staves/StaveGroup';
import { NotationElement } from '@src/NotationSettings';
import { TuningContainerGlyph } from '../glyphs/TuningContainerGlyph';
/**
 * This is the base public class for creating new layouting engines for the score renderer.
 */
export declare abstract class ScoreLayout {
    private _barRendererLookup;
    abstract get name(): string;
    renderer: ScoreRenderer;
    width: number;
    height: number;
    protected scoreInfoGlyphs: Map<NotationElement, TextGlyph>;
    protected chordDiagrams: ChordDiagramContainerGlyph | null;
    protected tuningGlyph: TuningContainerGlyph | null;
    protected constructor(renderer: ScoreRenderer);
    abstract get supportsResize(): boolean;
    abstract resize(): void;
    layoutAndRender(): void;
    protected abstract doLayoutAndRender(): void;
    private createScoreInfoGlyphs;
    get scale(): number;
    firstBarIndex: number;
    lastBarIndex: number;
    protected createEmptyStaveGroup(): StaveGroup;
    registerBarRenderer(key: string, renderer: BarRendererBase): void;
    unregisterBarRenderer(key: string, renderer: BarRendererBase): void;
    getRendererForBar(key: string, bar: Bar): BarRendererBase | null;
    renderAnnotation(): void;
}
