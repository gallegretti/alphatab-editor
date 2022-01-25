export class StaveTrackGroup {
    constructor(staveGroup, track) {
        this.staves = [];
        this.stavesRelevantForBoundsLookup = [];
        this.firstStaffInAccolade = null;
        this.lastStaffInAccolade = null;
        this.staveGroup = staveGroup;
        this.track = track;
    }
    addStaff(staff) {
        this.staves.push(staff);
        if (staff.isRelevantForBoundsLookup) {
            this.stavesRelevantForBoundsLookup.push(staff);
        }
    }
}
//# sourceMappingURL=StaveTrackGroup.js.map