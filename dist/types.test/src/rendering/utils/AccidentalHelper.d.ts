import { AccidentalType } from '@src/model/AccidentalType';
import { Bar } from '@src/model/Bar';
import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { ScoreBarRenderer } from '../ScoreBarRenderer';
/**
 * This small utilty public class allows the assignment of accidentals within a
 * desired scope.
 */
export declare class AccidentalHelper {
    private _bar;
    private _barRenderer;
    /**
     * a lookup list containing an info whether the notes within an octave
     * need an accidental rendered. the accidental symbol is determined based on the type of key signature.
     */
    private static KeySignatureLookup;
    /**
     * Contains the list of notes within an octave have accidentals set.
     */
    private static AccidentalNotes;
    /**
     * We always have 7 steps per octave.
     * (by a step the offsets inbetween score lines is meant,
     *      0 steps is on the first line (counting from top)
     *      1 steps is on the space inbetween the first and the second line
     */
    private static readonly StepsPerOctave;
    /**
     * Those are the amount of steps for the different clefs in case of a note value 0
     * [Neutral, C3, C4, F4, G2]
     */
    private static OctaveSteps;
    /**
     * The step offsets of the notes within an octave in case of for sharp keysignatures
     */
    private static SharpNoteSteps;
    /**
     * The step offsets of the notes within an octave in case of for flat keysignatures
     */
    private static FlatNoteSteps;
    private _registeredAccidentals;
    private _appliedScoreLines;
    private _appliedScoreLinesByValue;
    private _notesByValue;
    private _beatLines;
    /**
     * The beat on which the highest note of this helper was added.
     * Used together with beaming helper to calculate overflow.
     */
    maxLineBeat: Beat | null;
    /**
     * The beat on which the lowest note of this helper was added.
     * Used together with beaming helper to calculate overflow.
     */
    minLineBeat: Beat | null;
    /**
     * The line of the highest note added to this helper.
     */
    maxLine: number;
    /**
     * The line of the lowest note added to this helper.
     */
    minLine: number;
    constructor(barRenderer: ScoreBarRenderer);
    static getPercussionLine(bar: Bar, noteValue: number): number;
    static getNoteValue(note: Note): number;
    /**
     * Calculates the accidental for the given note and assignes the value to it.
     * The new accidental type is also registered within the current scope
     * @param note
     * @returns
     */
    applyAccidental(note: Note): AccidentalType;
    /**
     * Calculates the accidental for the given note value and assignes the value to it.
     * The new accidental type is also registered within the current scope
     * @param relatedBeat
     * @param noteValue
     * @param quarterBend
     * @param isHelperNote true if the note registered via this call, is a small helper note (e.g. for bends) or false if it is a main note head (e.g. for harmonics)
     * @returns
     */
    applyAccidentalForValue(relatedBeat: Beat, noteValue: number, quarterBend: boolean, isHelperNote: boolean): AccidentalType;
    static computeLineWithoutAccidentals(bar: Bar, note: Note): number;
    private getAccidental;
    private registerLine;
    getMaxLine(b: Beat): number;
    getMinLine(b: Beat): number;
    private static calculateNoteLine;
    getNoteLine(n: Note): number;
    getNoteLineForValue(rawValue: number, searchForNote?: boolean): number;
}
