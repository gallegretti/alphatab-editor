import { Duration } from '@src/model/Duration';
import { DynamicValue } from '@src/model/DynamicValue';
export declare class MidiUtils {
    static readonly QuarterTime: number;
    private static readonly MinVelocity;
    private static readonly VelocityIncrement;
    /**
     * Converts the given midi tick duration into milliseconds.
     * @param ticks The duration in midi ticks
     * @param tempo The current tempo in BPM.
     * @returns The converted duration in milliseconds.
     */
    static ticksToMillis(ticks: number, tempo: number): number;
    /**
     * Converts the given midi tick duration into milliseconds.
     * @param millis The duration in milliseconds
     * @param tempo The current tempo in BPM.
     * @returns The converted duration in midi ticks.
     */
    static millisToTicks(millis: number, tempo: number): number;
    /**
     * Converts a duration value to its ticks equivalent.
     */
    static toTicks(duration: Duration): number;
    /**
     * Converts a numerical value to its ticks equivalent.
     * @param duration the numerical proportion to convert. (i.E. timesignature denominator, note duration,...)
     */
    static valueToTicks(duration: number): number;
    static applyDot(ticks: number, doubleDotted: boolean): number;
    static applyTuplet(ticks: number, numerator: number, denominator: number): number;
    static removeTuplet(ticks: number, numerator: number, denominator: number): number;
    static dynamicToVelocity(dyn: DynamicValue): number;
}
