import { BarRendererFactory } from '@src/rendering/BarRendererFactory';
import { TabBarRenderer } from '@src/rendering/TabBarRenderer';
/**
 * This Factory produces TabBarRenderer instances
 */
export class TabBarRendererFactory extends BarRendererFactory {
    constructor(showTimeSignature, showRests, showTiedNotes) {
        super();
        this._showTimeSignature = showTimeSignature;
        this._showRests = showRests;
        this._showTiedNotes = showTiedNotes;
        this.hideOnPercussionTrack = true;
    }
    get staffId() {
        return TabBarRenderer.StaffId;
    }
    canCreate(track, staff) {
        return staff.tuning.length > 0 && super.canCreate(track, staff);
    }
    create(renderer, bar) {
        let tabBarRenderer = new TabBarRenderer(renderer, bar);
        tabBarRenderer.showRests = this._showRests;
        tabBarRenderer.showTimeSignature = this._showTimeSignature;
        tabBarRenderer.showTiedNotes = this._showTiedNotes;
        return tabBarRenderer;
    }
}
//# sourceMappingURL=TabBarRendererFactory.js.map