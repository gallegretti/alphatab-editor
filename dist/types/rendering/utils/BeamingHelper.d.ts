import { Beat } from '@src/model/Beat';
import { Duration } from '@src/model/Duration';
import { Note } from '@src/model/Note';
import { Staff } from '@src/model/Staff';
import { Voice } from '@src/model/Voice';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { BarRendererBase } from '../BarRendererBase';
export declare class BeamingHelperDrawInfo {
    startBeat: Beat | null;
    startX: number;
    startY: number;
    endBeat: Beat | null;
    endX: number;
    endY: number;
    /**
     * calculates the Y-position given a X-pos using the current start end point
     * @param x
     */
    calcY(x: number): number;
}
/**
 * This public class helps drawing beams and bars for notes.
 */
export declare class BeamingHelper {
    private _staff;
    private _beatLineXPositions;
    private _renderer;
    private _firstNonRestBeat;
    private _lastNonRestBeat;
    voice: Voice | null;
    beats: Beat[];
    shortestDuration: Duration;
    /**
     * the number of fingering indicators that will be drawn
     */
    fingeringCount: number;
    /**
     * an indicator whether any beat has a tuplet on it.
     */
    hasTuplet: boolean;
    private _firstBeatLowestNoteCompareValue;
    private _firstBeatHighestNoteCompareValue;
    private _lastBeatLowestNoteCompareValue;
    private _lastBeatHighestNoteCompareValue;
    lowestNoteInHelper: Note | null;
    private _lowestNoteCompareValueInHelper;
    highestNoteInHelper: Note | null;
    private _highestNoteCompareValueInHelper;
    invertBeamDirection: boolean;
    preferredBeamDirection: BeamDirection | null;
    isGrace: boolean;
    minRestLine: number | null;
    beatOfMinRestLine: Beat | null;
    maxRestLine: number | null;
    beatOfMaxRestLine: Beat | null;
    get isRestBeamHelper(): boolean;
    get hasLine(): boolean;
    get hasFlag(): boolean;
    constructor(staff: Staff, renderer: BarRendererBase);
    getBeatLineX(beat: Beat): number;
    hasBeatLineX(beat: Beat): boolean;
    registerBeatLineX(staffId: string, beat: Beat, up: number, down: number): void;
    private getOrCreateBeatPositions;
    direction: BeamDirection;
    finish(): void;
    private calculateDirection;
    static computeLineHeightsForRest(duration: Duration): number[];
    /**
     * Registers a rest beat within the accidental helper so the rest
     * symbol is considered properly during beaming.
     * @param beat The rest beat.
     * @param line The line on which the rest symbol is placed
     */
    applyRest(beat: Beat, line: number): void;
    private invert;
    checkBeat(beat: Beat): boolean;
    private checkNote;
    private static canJoin;
    private static canJoinDuration;
    static isFullBarJoin(a: Beat, b: Beat, barIndex: number): boolean;
    get beatOfLowestNote(): Beat;
    get beatOfHighestNote(): Beat;
    /**
     * Returns whether the the position of the given beat, was registered by the staff of the given ID
     * @param staffId
     * @param beat
     * @returns
     */
    isPositionFrom(staffId: string, beat: Beat): boolean;
    drawingInfos: Map<BeamDirection, BeamingHelperDrawInfo>;
}
