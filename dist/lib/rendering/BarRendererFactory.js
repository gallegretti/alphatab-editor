/**
 * This is the base public class for creating factories providing BarRenderers
 */
export class BarRendererFactory {
    constructor() {
        this.isInAccolade = true;
        this.isRelevantForBoundsLookup = true;
        this.hideOnMultiTrack = false;
        this.hideOnPercussionTrack = false;
    }
    canCreate(track, staff) {
        return !this.hideOnPercussionTrack || !staff.isPercussion;
    }
}
//# sourceMappingURL=BarRendererFactory.js.map