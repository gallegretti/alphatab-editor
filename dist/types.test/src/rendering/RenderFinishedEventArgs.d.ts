/**
 * This eventargs define the details about the rendering and layouting process and are
 * provided whenever a part of of the music sheet is rendered.
 */
export declare class RenderFinishedEventArgs {
    /**
     * Gets or sets the width of the current rendering result.
     */
    width: number;
    /**
     * Gets or sets the height of the current rendering result.
     */
    height: number;
    /**
     * Gets or sets the currently known total width of the final music sheet.
     */
    totalWidth: number;
    /**
     * Gets or sets the currently known total height of the final music sheet.
     */
    totalHeight: number;
    /**
     * Gets or sets the index of the first masterbar that was rendered in this result.
     */
    firstMasterBarIndex: number;
    /**
     * Gets or sets the index of the last masterbar that was rendered in this result.
     */
    lastMasterBarIndex: number;
    /**
     * Gets or sets the render engine specific result object which contains the rendered music sheet.
     */
    renderResult: unknown;
}
