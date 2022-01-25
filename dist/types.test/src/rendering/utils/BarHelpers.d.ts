import { Beat } from '@src/model/Beat';
import { BeamingHelper } from '@src/rendering/utils/BeamingHelper';
import { BarRendererBase } from '../BarRendererBase';
import { BarCollisionHelper } from './BarCollisionHelper';
export declare class BarHelpers {
    private _renderer;
    beamHelpers: BeamingHelper[][];
    beamHelperLookup: Map<number, BeamingHelper>[];
    collisionHelper: BarCollisionHelper;
    constructor(renderer: BarRendererBase);
    initialize(): void;
    getBeamingHelperForBeat(beat: Beat): BeamingHelper;
}
