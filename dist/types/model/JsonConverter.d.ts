import { MidiEvent } from '@src/midi/MidiEvent';
import { MidiFile } from '@src/midi/MidiFile';
import { Score } from '@src/model/Score';
import { Settings } from '@src/Settings';
/**
 * This class can convert a full {@link Score} instance to a simple JavaScript object and back for further
 * JSON serialization.
 */
export declare class JsonConverter {
    /**
     * @target web
     */
    private static jsonReplacer;
    /**
     * Converts the given score into a JSON encoded string.
     * @param score The score to serialize.
     * @returns A JSON encoded string.
     * @target web
     */
    static scoreToJson(score: Score): string;
    /**
     * Converts the given JSON string back to a {@link Score} object.
     * @param json The JSON string
     * @param settings The settings to use during conversion.
     * @returns The converted score object.
     * @target web
     */
    static jsonToScore(json: string, settings?: Settings): Score;
    /**
     * Converts the score into a JavaScript object without circular dependencies.
     * @param score The score object to serialize
     * @returns A serialized score object without ciruclar dependencies that can be used for further serializations.
     */
    static scoreToJsObject(score: Score): unknown;
    /**
     * Converts the given JavaScript object into a score object.
     * @param jsObject The javascript object created via {@link Score}
     * @param settings The settings to use during conversion.
     * @returns The converted score object.
     */
    static jsObjectToScore(jsObject: unknown, settings?: Settings): Score;
    /**
     * Converts the given settings into a JSON encoded string.
     * @param settings The settings to serialize.
     * @returns A JSON encoded string.
     * @target web
     */
    static settingsToJson(settings: Settings): string;
    /**
     * Converts the given JSON string back to a {@link Score} object.
     * @param json The JSON string
     * @returns The converted settings object.
     * @target web
     */
    static jsonToSettings(json: string): Settings;
    /**
     * Converts the settings object into a JavaScript object for transmission between components or saving purposes.
     * @param settings The settings object to serialize
     * @returns A serialized settings object without ciruclar dependencies that can be used for further serializations.
     */
    static settingsToJsObject(settings: Settings): Map<string, unknown> | null;
    /**
    * Converts the given JavaScript object into a settings object.
    * @param jsObject The javascript object created via {@link Settings}
    * @returns The converted Settings object.
    */
    static jsObjectToSettings(jsObject: unknown): Settings;
    /**
     * @target web
     */
    static jsObjectToMidiFile(midi: any): MidiFile;
    /**
     * @target web
     */
    static jsObjectToMidiEvent(midiEvent: any): MidiEvent;
    /**
     * @target web
     */
    static midiFileToJsObject(midi: MidiFile): unknown;
    /**
     * @target web
     */
    static midiEventToJsObject(midiEvent: MidiEvent): unknown;
}
