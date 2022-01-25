import { MetaDataEvent } from '@src/midi/MetaDataEvent';
import { MetaNumberEvent } from '@src/midi/MetaNumberEvent';
import { MidiEvent } from '@src/midi/MidiEvent';
import { SystemExclusiveEvent } from '@src/midi/SystemExclusiveEvent';
import { MidiFile } from '@src/midi/MidiFile';
import { Score } from '@src/model/Score';
import { Settings } from '@src/Settings';
import { Midi20PerNotePitchBendEvent } from '@src/midi/Midi20PerNotePitchBendEvent';
import { ScoreSerializer } from '@src/generated/model/ScoreSerializer';
import { SettingsSerializer } from '@src/generated/SettingsSerializer';
/**
 * This class can convert a full {@link Score} instance to a simple JavaScript object and back for further
 * JSON serialization.
 */
export class JsonConverter {
    /**
     * @target web
     */
    static jsonReplacer(_, v) {
        if (v instanceof Map) {
            if ('fromEntries' in Object) {
                return Object.fromEntries(v);
            }
            else {
                const o = {};
                for (const [k, mv] of v) {
                    o[k] = mv;
                }
                return o;
            }
        }
        else if (ArrayBuffer.isView(v)) {
            return Array.apply([], [v]);
        }
        return v;
    }
    /**
     * Converts the given score into a JSON encoded string.
     * @param score The score to serialize.
     * @returns A JSON encoded string.
     * @target web
     */
    static scoreToJson(score) {
        let obj = JsonConverter.scoreToJsObject(score);
        return JSON.stringify(obj, JsonConverter.jsonReplacer);
    }
    /**
     * Converts the given JSON string back to a {@link Score} object.
     * @param json The JSON string
     * @param settings The settings to use during conversion.
     * @returns The converted score object.
     * @target web
     */
    static jsonToScore(json, settings) {
        return JsonConverter.jsObjectToScore(JSON.parse(json), settings);
    }
    /**
     * Converts the score into a JavaScript object without circular dependencies.
     * @param score The score object to serialize
     * @returns A serialized score object without ciruclar dependencies that can be used for further serializations.
     */
    static scoreToJsObject(score) {
        return ScoreSerializer.toJson(score);
    }
    /**
     * Converts the given JavaScript object into a score object.
     * @param jsObject The javascript object created via {@link Score}
     * @param settings The settings to use during conversion.
     * @returns The converted score object.
     */
    static jsObjectToScore(jsObject, settings) {
        let score = new Score();
        ScoreSerializer.fromJson(score, jsObject);
        score.finish(settings !== null && settings !== void 0 ? settings : new Settings());
        return score;
    }
    /**
     * Converts the given settings into a JSON encoded string.
     * @param settings The settings to serialize.
     * @returns A JSON encoded string.
     * @target web
     */
    static settingsToJson(settings) {
        let obj = JsonConverter.settingsToJsObject(settings);
        return JSON.stringify(obj, JsonConverter.jsonReplacer);
    }
    /**
     * Converts the given JSON string back to a {@link Score} object.
     * @param json The JSON string
     * @returns The converted settings object.
     * @target web
     */
    static jsonToSettings(json) {
        return JsonConverter.jsObjectToSettings(JSON.parse(json));
    }
    /**
     * Converts the settings object into a JavaScript object for transmission between components or saving purposes.
     * @param settings The settings object to serialize
     * @returns A serialized settings object without ciruclar dependencies that can be used for further serializations.
     */
    static settingsToJsObject(settings) {
        return SettingsSerializer.toJson(settings);
    }
    /**
    * Converts the given JavaScript object into a settings object.
    * @param jsObject The javascript object created via {@link Settings}
    * @returns The converted Settings object.
    */
    static jsObjectToSettings(jsObject) {
        let settings = new Settings();
        SettingsSerializer.fromJson(settings, jsObject);
        return settings;
    }
    /**
     * @target web
     */
    static jsObjectToMidiFile(midi) {
        let midi2 = new MidiFile();
        midi2.division = midi.division;
        let midiEvents = midi.events;
        for (let midiEvent of midiEvents) {
            let midiEvent2 = JsonConverter.jsObjectToMidiEvent(midiEvent);
            midi2.events.push(midiEvent2);
        }
        return midi2;
    }
    /**
     * @target web
     */
    static jsObjectToMidiEvent(midiEvent) {
        let track = midiEvent.track;
        let tick = midiEvent.tick;
        let message = midiEvent.message;
        let midiEvent2;
        switch (midiEvent.type) {
            case 'SystemExclusiveEvent':
                midiEvent2 = new SystemExclusiveEvent(track, tick, 0, 0, midiEvent.data);
                midiEvent2.message = message;
                break;
            case 'MetaDataEvent':
                midiEvent2 = new MetaDataEvent(track, tick, 0, 0, midiEvent.data);
                midiEvent2.message = message;
                break;
            case 'MetaNumberEvent':
                midiEvent2 = new MetaNumberEvent(track, tick, 0, 0, midiEvent.value);
                midiEvent2.message = message;
                break;
            case 'Midi20PerNotePitchBendEvent':
                midiEvent2 = new Midi20PerNotePitchBendEvent(track, tick, 0, midiEvent.noteKey, midiEvent.pitch);
                midiEvent2.message = message;
                break;
            default:
                midiEvent2 = new MidiEvent(track, tick, 0, 0, 0);
                midiEvent2.message = message;
                break;
        }
        return midiEvent2;
    }
    /**
     * @target web
     */
    static midiFileToJsObject(midi) {
        let midi2 = {};
        midi2.division = midi.division;
        let midiEvents = [];
        midi2.events = midiEvents;
        for (let midiEvent of midi.events) {
            midiEvents.push(JsonConverter.midiEventToJsObject(midiEvent));
        }
        return midi2;
    }
    /**
     * @target web
     */
    static midiEventToJsObject(midiEvent) {
        let midiEvent2 = {};
        midiEvent2.track = midiEvent.track;
        midiEvent2.tick = midiEvent.tick;
        midiEvent2.message = midiEvent.message;
        if (midiEvent instanceof SystemExclusiveEvent) {
            midiEvent2.type = 'SystemExclusiveEvent';
            midiEvent2.data = midiEvent.data;
        }
        else if (midiEvent instanceof MetaDataEvent) {
            midiEvent2.type = 'MetaDataEvent';
            midiEvent2.data = midiEvent.data;
        }
        else if (midiEvent instanceof MetaNumberEvent) {
            midiEvent2.type = 'MetaNumberEvent';
            midiEvent2.value = midiEvent.value;
        }
        else if (midiEvent instanceof Midi20PerNotePitchBendEvent) {
            midiEvent2.type = 'Midi20PerNotePitchBendEvent';
            midiEvent2.noteKey = midiEvent.noteKey;
            midiEvent2.pitch = midiEvent.pitch;
        }
        return midiEvent2;
    }
}
//# sourceMappingURL=JsonConverter.js.map