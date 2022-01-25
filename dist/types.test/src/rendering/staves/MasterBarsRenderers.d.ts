import { MasterBar } from '@src/model/MasterBar';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { BarLayoutingInfo } from '@src/rendering/staves/BarLayoutingInfo';
/**
 * This container represents a single column of bar renderers independent from any staves.
 * This container can be used to reorganize renderers into a new staves.
 */
export declare class MasterBarsRenderers {
    width: number;
    isLinkedToPrevious: boolean;
    canWrap: boolean;
    masterBar: MasterBar;
    renderers: BarRendererBase[];
    layoutingInfo: BarLayoutingInfo;
}
