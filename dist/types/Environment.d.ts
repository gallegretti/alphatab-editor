import { LayoutMode } from '@src/LayoutMode';
import { StaveProfile } from '@src/StaveProfile';
import { ScoreImporter } from '@src/importer/ScoreImporter';
import { ICanvas } from '@src/platform/ICanvas';
import { BarRendererFactory } from '@src/rendering/BarRendererFactory';
import { ScoreLayout } from '@src/rendering/layout/ScoreLayout';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
import { FontLoadingChecker } from '@src/util/FontLoadingChecker';
import { WebPlatform } from './platform/javascript/WebPlatform';
export declare class LayoutEngineFactory {
    readonly vertical: boolean;
    readonly createLayout: (renderer: ScoreRenderer) => ScoreLayout;
    constructor(vertical: boolean, createLayout: (renderer: ScoreRenderer) => ScoreLayout);
}
export declare class RenderEngineFactory {
    readonly supportsWorkers: boolean;
    readonly createCanvas: () => ICanvas;
    constructor(supportsWorkers: boolean, canvas: () => ICanvas);
}
/**
 * This public class represents the global alphaTab environment where
 * alphaTab looks for information like available layout engines
 * staves etc.
 * This public class represents the global alphaTab environment where
 * alphaTab looks for information like available layout engines
 * staves etc.
 * @partial
 */
export declare class Environment {
    /**
     * The font size of the music font in pixel.
     */
    static readonly MusicFontSize = 34;
    /**
     * The scaling factor to use when rending raster graphics for sharper rendering on high-dpi displays.
     */
    static HighDpiFactor: number;
    /**
     * @target web
     */
    static createStyleElement(elementDocument: HTMLDocument, fontDirectory: string | null): void;
    /**
     * @target web
     */
    private static _globalThis;
    /**
     * @target web
     */
    static get globalThis(): any;
    /**
     * @target web
     */
    static webPlatform: WebPlatform;
    /**
     * @target web
     */
    static scriptFile: string | null;
    /**
     * @target web
     */
    static bravuraFontChecker: FontLoadingChecker;
    /**
     * @target web
     */
    static get isRunningInWorker(): boolean;
    /**
     * @target web
     */
    static get isRunningInAudioWorklet(): boolean;
    /**
     * @target web
     */
    static createAlphaTabWorker(scriptFile: string): Worker;
    /**
     * @target web
     * @partial
     */
    static throttle(action: () => void, delay: number): () => void;
    /**
     * @target web
     */
    private static detectScriptFile;
    /**
     * @target web
     */
    private static registerJQueryPlugin;
    static renderEngines: Map<string, RenderEngineFactory>;
    static layoutEngines: Map<LayoutMode, LayoutEngineFactory>;
    static staveProfiles: Map<StaveProfile, BarRendererFactory[]>;
    static getRenderEngineFactory(engine: string): RenderEngineFactory;
    static getLayoutEngineFactory(layoutMode: LayoutMode): LayoutEngineFactory;
    /**
     * Gets all default ScoreImporters
     * @returns
     */
    static buildImporters(): ScoreImporter[];
    private static createDefaultRenderEngines;
    /**
     * @target web
     * @partial
     */
    private static createPlatformSpecificRenderEngines;
    private static createDefaultStaveProfiles;
    private static createDefaultLayoutEngines;
    /**
     * @target web
     * @partial
     */
    static platformInit(): void;
    /**
     * @target web
     */
    private static detectWebPlatform;
}
