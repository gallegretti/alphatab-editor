/**
 * This public class provides names for all general midi instruments.
 */
export declare class GeneralMidi {
    private static _values;
    static getValue(name: string): number;
    static isPiano(program: number): boolean;
    static isGuitar(program: number): boolean;
}
