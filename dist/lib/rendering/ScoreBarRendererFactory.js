import { BarRendererFactory } from '@src/rendering/BarRendererFactory';
import { ScoreBarRenderer } from '@src/rendering/ScoreBarRenderer';
/**
 * This Factory procudes ScoreBarRenderer instances
 */
export class ScoreBarRendererFactory extends BarRendererFactory {
    get staffId() {
        return ScoreBarRenderer.StaffId;
    }
    create(renderer, bar) {
        return new ScoreBarRenderer(renderer, bar);
    }
    constructor() {
        super();
    }
}
//# sourceMappingURL=ScoreBarRendererFactory.js.map