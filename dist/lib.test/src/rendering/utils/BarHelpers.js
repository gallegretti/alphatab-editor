import { GraceType } from '@src/model/GraceType';
import { BeamingHelper } from '@src/rendering/utils/BeamingHelper';
import { BarCollisionHelper } from './BarCollisionHelper';
export class BarHelpers {
    constructor(renderer) {
        this.beamHelpers = [];
        this.beamHelperLookup = [];
        this._renderer = renderer;
        this.collisionHelper = new BarCollisionHelper();
    }
    initialize() {
        var barRenderer = this._renderer;
        var bar = this._renderer.bar;
        let currentBeamHelper = null;
        let currentGraceBeamHelper = null;
        for (let i = 0, j = bar.voices.length; i < j; i++) {
            let v = bar.voices[i];
            this.beamHelpers.push([]);
            this.beamHelperLookup.push(new Map());
            for (let k = 0, l = v.beats.length; k < l; k++) {
                let b = v.beats[k];
                let helperForBeat;
                if (b.graceType !== GraceType.None) {
                    helperForBeat = currentGraceBeamHelper;
                }
                else {
                    helperForBeat = currentBeamHelper;
                    currentGraceBeamHelper = null;
                }
                // if a new beaming helper was started, we close our tuplet grouping as well
                // try to fit beam to current beamhelper
                if (!helperForBeat || !helperForBeat.checkBeat(b)) {
                    if (helperForBeat) {
                        helperForBeat.finish();
                    }
                    // if not possible, create the next beaming helper
                    helperForBeat = new BeamingHelper(bar.staff, barRenderer);
                    helperForBeat.checkBeat(b);
                    if (b.graceType !== GraceType.None) {
                        currentGraceBeamHelper = helperForBeat;
                    }
                    else {
                        currentBeamHelper = helperForBeat;
                    }
                    this.beamHelpers[v.index].push(helperForBeat);
                }
                this.beamHelperLookup[v.index].set(b.index, helperForBeat);
            }
            if (currentBeamHelper) {
                currentBeamHelper.finish();
            }
            if (currentGraceBeamHelper) {
                currentGraceBeamHelper.finish();
            }
            currentBeamHelper = null;
            currentGraceBeamHelper = null;
        }
    }
    getBeamingHelperForBeat(beat) {
        return this.beamHelperLookup[beat.voice.index].get(beat.index);
    }
}
//# sourceMappingURL=BarHelpers.js.map