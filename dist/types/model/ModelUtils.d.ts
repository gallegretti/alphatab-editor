import { Beat } from '@src/model/Beat';
import { Duration } from '@src/model/Duration';
import { Fingers } from '@src/model/Fingers';
import { Score } from '@src/model/Score';
import { Settings } from '@src/Settings';
export declare class TuningParseResult {
    note: string | null;
    noteValue: number;
    octave: number;
    get realValue(): number;
}
/**
 * This public class contains some utilities for working with model public classes
 */
export declare class ModelUtils {
    static getIndex(duration: Duration): number;
    static keySignatureIsFlat(ks: number): boolean;
    static keySignatureIsNatural(ks: number): boolean;
    static keySignatureIsSharp(ks: number): boolean;
    static applyPitchOffsets(settings: Settings, score: Score): void;
    static fingerToString(settings: Settings, beat: Beat, finger: Fingers, leftHand: boolean): string | null;
    /**
     * Checks if the given string is a tuning inticator.
     * @param name
     * @returns
     */
    static isTuning(name: string): boolean;
    static parseTuning(name: string): TuningParseResult | null;
    static getTuningForText(str: string): number;
    static getToneForText(note: string): number;
    static newGuid(): string;
    static isAlmostEqualTo(a: number, b: number): boolean;
    static toHexString(n: number, digits?: number): string;
}
