import { RenderingResources } from '@src/RenderingResources';
import { LayoutMode } from '@src/LayoutMode';
import { StaveProfile } from '@src/StaveProfile';
/**
 * The display settings control how the general layout and display of alphaTab is done.
 * @json
 */
export declare class DisplaySettings {
    /**
     * Sets the zoom level of the rendered notation
     */
    scale: number;
    /**
     * The default stretch force to use for layouting.
     */
    stretchForce: number;
    /**
     * The layouting mode used to arrange the the notation.
     */
    layoutMode: LayoutMode;
    /**
     * The stave profile to use.
     */
    staveProfile: StaveProfile;
    /**
     * Limit the displayed bars per row.
     */
    barsPerRow: number;
    /**
     * The bar start number to start layouting with. Note that this is the bar number and not an index!
     */
    startBar: number;
    /**
     * The amount of bars to render overall.
     */
    barCount: number;
    /**
     * The number of bars that should be rendered per partial. This setting is not used by all layouts.
     */
    barCountPerPartial: number;
    /**
     * Gets or sets the resources used during rendering. This defines all fonts and colors used.
     * @json_partial_names
     */
    resources: RenderingResources;
    /**
     * Gets or sets the padding between the music notation and the border.
     */
    padding: number[] | null;
}
