/**
 * This public class represents a predefined string tuning.
 * @json
 */
export declare class Tuning {
    private static _sevenStrings;
    private static _sixStrings;
    private static _fiveStrings;
    private static _fourStrings;
    private static _defaultTunings;
    static readonly defaultAccidentals: string[];
    static readonly defaultSteps: string[];
    static getTextForTuning(tuning: number, includeOctave: boolean): string;
    static getTextPartsForTuning(tuning: number, octaveShift?: number): string[];
    /**
     * Gets the default tuning for the given string count.
     * @param stringCount The string count.
     * @returns The tuning for the given string count or null if the string count is not defined.
     */
    static getDefaultTuningFor(stringCount: number): Tuning | null;
    /**
     * Gets a list of all tuning presets for a given stirng count.
     * @param stringCount The string count.
     * @returns The list of known tunings for the given string count or an empty list if the string count is not defined.
     */
    static getPresetsFor(stringCount: number): Tuning[];
    static initialize(): void;
    /**
     * Tries to find a known tuning by a given list of tuning values.
     * @param strings The values defining the tuning.
     * @returns The known tuning.
     */
    static findTuning(strings: number[]): Tuning | null;
    /**
     * Gets or sets whether this is the standard tuning for this number of strings.
     */
    isStandard: boolean;
    /**
     * Gets or sets the name of the tuning.
     */
    name: string;
    /**
     * Gets or sets the values for each string of the instrument.
     */
    tunings: number[];
    /**
     * Initializes a new instance of the {@link Tuning} class.
     * @param name The name.
     * @param tuning The tuning.
     * @param isStandard if set to`true`[is standard].
     */
    constructor(name?: string, tuning?: number[] | null, isStandard?: boolean);
    /**
     * Tries to detect the name and standard flag of the tuning from a known tuning list based
     * on the string values.
     */
    finish(): void;
}
