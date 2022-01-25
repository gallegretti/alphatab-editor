/**
 * This container represents a single column of bar renderers independent from any staves.
 * This container can be used to reorganize renderers into a new staves.
 */
export class MasterBarsRenderers {
    constructor() {
        this.width = 0;
        this.isLinkedToPrevious = false;
        this.canWrap = true;
        this.renderers = [];
    }
}
//# sourceMappingURL=MasterBarsRenderers.js.map