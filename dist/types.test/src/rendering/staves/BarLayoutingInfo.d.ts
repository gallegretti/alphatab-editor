import { Beat } from '@src/model/Beat';
import { Spring } from '@src/rendering/staves/Spring';
import { ICanvas } from '@src/platform/ICanvas';
/**
 * This public class stores size information about a stave.
 * It is used by the layout engine to collect the sizes of score parts
 * to align the parts across multiple staves.
 */
export declare class BarLayoutingInfo {
    private static readonly MinDuration;
    private static readonly MinDurationWidth;
    private _timeSortedSprings;
    private _xMin;
    private _minTime;
    private _onTimePositionsForce;
    private _onTimePositions;
    private _incompleteGraceRodsWidth;
    /**
     * an internal version number that increments whenever a change was made.
     */
    version: number;
    preBeatSizes: Map<number, number>;
    onBeatSizes: Map<number, number>;
    onBeatCenterX: Map<number, number>;
    preBeatSize: number;
    postBeatSize: number;
    voiceSize: number;
    minStretchForce: number;
    totalSpringConstant: number;
    updateVoiceSize(size: number): void;
    setPreBeatSize(beat: Beat, size: number): void;
    getPreBeatSize(beat: Beat): number;
    setOnBeatSize(beat: Beat, size: number): void;
    getOnBeatSize(beat: Beat): number;
    getBeatCenterX(beat: Beat): number;
    setBeatCenterX(beat: Beat, x: number): void;
    private updateMinStretchForce;
    incompleteGraceRods: Map<string, Spring[]>;
    allGraceRods: Map<string, Spring[]>;
    springs: Map<number, Spring>;
    addSpring(start: number, duration: number, graceBeatWidth: number, preBeatWidth: number, postSpringSize: number): Spring;
    addBeatSpring(beat: Beat, preBeatSize: number, postBeatSize: number): void;
    finish(): void;
    private calculateSpringConstants;
    height: number;
    paint(_cx: number, _cy: number, _canvas: ICanvas): void;
    private calculateSpringConstant;
    spaceToForce(space: number): number;
    calculateVoiceWidth(force: number): number;
    private calculateWidth;
    buildOnTimePositions(force: number): Map<number, number>;
}
