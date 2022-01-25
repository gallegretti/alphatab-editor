/**
 * This eventargs define the details about the rendering and layouting process and are
 * provided whenever a part of of the music sheet is rendered.
 */
export class RenderFinishedEventArgs {
    constructor() {
        /**
         * Gets or sets the width of the current rendering result.
         */
        this.width = 0;
        /**
         * Gets or sets the height of the current rendering result.
         */
        this.height = 0;
        /**
         * Gets or sets the currently known total width of the final music sheet.
         */
        this.totalWidth = 0;
        /**
         * Gets or sets the currently known total height of the final music sheet.
         */
        this.totalHeight = 0;
        /**
         * Gets or sets the index of the first masterbar that was rendered in this result.
         */
        this.firstMasterBarIndex = 0;
        /**
         * Gets or sets the index of the last masterbar that was rendered in this result.
         */
        this.lastMasterBarIndex = 0;
        /**
         * Gets or sets the render engine specific result object which contains the rendered music sheet.
         */
        this.renderResult = null;
    }
}
//# sourceMappingURL=RenderFinishedEventArgs.js.map