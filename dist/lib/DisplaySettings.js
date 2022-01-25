import { RenderingResources } from '@src/RenderingResources';
import { LayoutMode } from '@src/LayoutMode';
import { StaveProfile } from '@src/StaveProfile';
/**
 * The display settings control how the general layout and display of alphaTab is done.
 * @json
 */
export class DisplaySettings {
    constructor() {
        /**
         * Sets the zoom level of the rendered notation
         */
        this.scale = 1.0;
        /**
         * The default stretch force to use for layouting.
         */
        this.stretchForce = 1.0;
        /**
         * The layouting mode used to arrange the the notation.
         */
        this.layoutMode = LayoutMode.Page;
        /**
         * The stave profile to use.
         */
        this.staveProfile = StaveProfile.Default;
        /**
         * Limit the displayed bars per row.
         */
        this.barsPerRow = -1;
        /**
         * The bar start number to start layouting with. Note that this is the bar number and not an index!
         */
        this.startBar = 1;
        /**
         * The amount of bars to render overall.
         */
        this.barCount = -1;
        /**
         * The number of bars that should be rendered per partial. This setting is not used by all layouts.
         */
        this.barCountPerPartial = 10;
        /**
         * Gets or sets the resources used during rendering. This defines all fonts and colors used.
         * @json_partial_names
         */
        this.resources = new RenderingResources();
        /**
         * Gets or sets the padding between the music notation and the border.
         */
        this.padding = null;
    }
}
//# sourceMappingURL=DisplaySettings.js.map