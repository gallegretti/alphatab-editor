import { ScoreImporter } from '@src/importer/ScoreImporter';
import { Score } from '@src/model/Score';
import { AlphaTabError } from '@src/AlphaTabError';
import { Settings } from '@src/Settings';
/**
 * A list of terminals recognized by the alphaTex-parser
 */
export declare enum AlphaTexSymbols {
    No = 0,
    Eof = 1,
    Number = 2,
    DoubleDot = 3,
    Dot = 4,
    String = 5,
    Tuning = 6,
    LParensis = 7,
    RParensis = 8,
    LBrace = 9,
    RBrace = 10,
    Pipe = 11,
    MetaCommand = 12,
    Multiply = 13,
    LowerThan = 14,
    Property = 15
}
export declare class AlphaTexError extends AlphaTabError {
    position: number;
    nonTerm: string;
    expected: AlphaTexSymbols;
    symbol: AlphaTexSymbols;
    symbolData: unknown;
    constructor(message: string);
    static symbolError(position: number, nonTerm: string, expected: AlphaTexSymbols, symbol: AlphaTexSymbols, symbolData?: unknown): AlphaTexError;
    static errorMessage(position: number, message: string): AlphaTexError;
}
/**
 * This importer can parse alphaTex markup into a score structure.
 */
export declare class AlphaTexImporter extends ScoreImporter {
    private static readonly Eof;
    private _trackChannel;
    private _score;
    private _currentTrack;
    private _currentStaff;
    private _input;
    private _ch;
    private _curChPos;
    private _sy;
    private _syData;
    private _allowNegatives;
    private _allowTuning;
    private _currentDuration;
    private _currentDynamics;
    private _currentTuplet;
    private _lyrics;
    private _staffHasExplicitTuning;
    private _staffTuningApplied;
    logErrors: boolean;
    constructor();
    get name(): string;
    initFromString(tex: string, settings: Settings): void;
    readScore(): Score;
    private consolidate;
    private error;
    private errorMessage;
    /**
     * Initializes the song with some required default values.
     * @returns
     */
    private createDefaultScore;
    private newTrack;
    /**
     * Converts a clef string into the clef value.
     * @param str the string to convert
     * @returns the clef value
     */
    private parseClefFromString;
    /**
     * Converts a clef tuning into the clef value.
     * @param i the tuning value to convert
     * @returns the clef value
     */
    private parseClefFromInt;
    private parseTripletFeelFromString;
    private parseTripletFeelFromInt;
    /**
     * Converts a keysignature string into the assocciated value.
     * @param str the string to convert
     * @returns the assocciated keysignature value
     */
    private parseKeySignature;
    /**
     * Reads the next character of the source stream.
     */
    private nextChar;
    /**
     * Reads the next terminal symbol.
     */
    private newSy;
    /**
     * Checks if the given character is a letter.
     * (no control characters, whitespaces, numbers or dots)
     * @param code the character
     * @returns true if the given character is a letter, otherwise false.
     */
    private static isLetter;
    /**
     * Checks if the given charater is a non terminal.
     * @param ch the character
     * @returns true if the given character is a terminal, otherwise false.
     */
    private static isTerminal;
    /**
     * Checks if the given character is a digit.
     * @param code the character
     * @returns true if the given character is a digit, otherwise false.
     */
    private isDigit;
    /**
     * Reads a string from the stream.
     * @returns the read string.
     */
    private readName;
    /**
     * Reads a number from the stream.
     * @returns the read number.
     */
    private readNumber;
    private score;
    private metaData;
    private handleStaffMeta;
    private chordProperties;
    private bars;
    private trackStaffMeta;
    private staffProperties;
    private bar;
    private newBar;
    private beat;
    private beatDuration;
    private beatEffects;
    /**
     * Tries to apply a beat effect to the given beat.
     * @returns true if a effect could be applied, otherwise false
     */
    private applyBeatEffect;
    private getChordId;
    private applyTuplet;
    private note;
    private noteEffects;
    private toFinger;
    private parseDuration;
    private barMeta;
}
