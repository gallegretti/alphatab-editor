import { Track } from '@src/model/Track';
import { RenderStaff } from '@src/rendering/staves/RenderStaff';
import { StaveGroup } from '@src/rendering/staves/StaveGroup';
export declare class StaveTrackGroup {
    track: Track;
    staveGroup: StaveGroup;
    staves: RenderStaff[];
    stavesRelevantForBoundsLookup: RenderStaff[];
    firstStaffInAccolade: RenderStaff | null;
    lastStaffInAccolade: RenderStaff | null;
    constructor(staveGroup: StaveGroup, track: Track);
    addStaff(staff: RenderStaff): void;
}
