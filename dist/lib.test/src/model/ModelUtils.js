import { GeneralMidi } from '@src/midi/GeneralMidi';
import { Fingers } from '@src/model/Fingers';
import { FingeringMode } from '@src/NotationSettings';
export class TuningParseResult {
    constructor() {
        this.note = null;
        this.noteValue = 0;
        this.octave = 0;
    }
    get realValue() {
        return this.octave * 12 + this.noteValue;
    }
}
/**
 * This public class contains some utilities for working with model public classes
 */
export class ModelUtils {
    static getIndex(duration) {
        let index = 0;
        let value = duration;
        if (value < 0) {
            return index;
        }
        return Math.log2(duration) | 0;
    }
    static keySignatureIsFlat(ks) {
        return ks < 0;
    }
    static keySignatureIsNatural(ks) {
        return ks === 0;
    }
    static keySignatureIsSharp(ks) {
        return ks > 0;
    }
    static applyPitchOffsets(settings, score) {
        for (let i = 0; i < score.tracks.length; i++) {
            if (i < settings.notation.displayTranspositionPitches.length) {
                for (let staff of score.tracks[i].staves) {
                    staff.displayTranspositionPitch = -settings.notation.displayTranspositionPitches[i];
                }
            }
            if (i < settings.notation.transpositionPitches.length) {
                for (let staff of score.tracks[i].staves) {
                    staff.transpositionPitch = -settings.notation.transpositionPitches[i];
                }
            }
        }
    }
    static fingerToString(settings, beat, finger, leftHand) {
        if (settings.notation.fingeringMode === FingeringMode.ScoreForcePiano ||
            settings.notation.fingeringMode === FingeringMode.SingleNoteEffectBandForcePiano ||
            GeneralMidi.isPiano(beat.voice.bar.staff.track.playbackInfo.program)) {
            switch (finger) {
                case Fingers.Unknown:
                case Fingers.NoOrDead:
                    return null;
                case Fingers.Thumb:
                    return '1';
                case Fingers.IndexFinger:
                    return '2';
                case Fingers.MiddleFinger:
                    return '3';
                case Fingers.AnnularFinger:
                    return '4';
                case Fingers.LittleFinger:
                    return '5';
                default:
                    return null;
            }
        }
        if (leftHand) {
            switch (finger) {
                case Fingers.Unknown:
                case Fingers.NoOrDead:
                    return '0';
                case Fingers.Thumb:
                    return 'T';
                case Fingers.IndexFinger:
                    return '1';
                case Fingers.MiddleFinger:
                    return '2';
                case Fingers.AnnularFinger:
                    return '3';
                case Fingers.LittleFinger:
                    return '4';
                default:
                    return null;
            }
        }
        switch (finger) {
            case Fingers.Unknown:
            case Fingers.NoOrDead:
                return null;
            case Fingers.Thumb:
                return 'p';
            case Fingers.IndexFinger:
                return 'i';
            case Fingers.MiddleFinger:
                return 'm';
            case Fingers.AnnularFinger:
                return 'a';
            case Fingers.LittleFinger:
                return 'c';
            default:
                return null;
        }
    }
    /**
     * Checks if the given string is a tuning inticator.
     * @param name
     * @returns
     */
    static isTuning(name) {
        return !!ModelUtils.parseTuning(name);
    }
    static parseTuning(name) {
        let note = '';
        let octave = '';
        for (let i = 0; i < name.length; i++) {
            let c = name.charCodeAt(i);
            if (c >= 0x30 && c <= 0x39) {
                // number without note?
                if (!note) {
                    return null;
                }
                octave += String.fromCharCode(c);
            }
            else if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a) || c === 0x23) {
                note += String.fromCharCode(c);
            }
            else {
                return null;
            }
        }
        if (!octave || !note) {
            return null;
        }
        let result = new TuningParseResult();
        result.octave = parseInt(octave) + 1;
        result.note = note.toLowerCase();
        result.noteValue = ModelUtils.getToneForText(result.note);
        return result;
    }
    static getTuningForText(str) {
        let result = ModelUtils.parseTuning(str);
        if (!result) {
            return -1;
        }
        return result.realValue;
    }
    static getToneForText(note) {
        let b = 0;
        switch (note.toLowerCase()) {
            case 'c':
                b = 0;
                break;
            case 'c#':
            case 'db':
                b = 1;
                break;
            case 'd':
                b = 2;
                break;
            case 'd#':
            case 'eb':
                b = 3;
                break;
            case 'e':
                b = 4;
                break;
            case 'f':
                b = 5;
                break;
            case 'f#':
            case 'gb':
                b = 6;
                break;
            case 'g':
                b = 7;
                break;
            case 'g#':
            case 'ab':
                b = 8;
                break;
            case 'a':
                b = 9;
                break;
            case 'a#':
            case 'bb':
                b = 10;
                break;
            case 'b':
                b = 11;
                break;
            default:
                return 0;
        }
        return b;
    }
    static newGuid() {
        return (Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1));
    }
    static isAlmostEqualTo(a, b) {
        return Math.abs(a - b) < 0.00001;
    }
    static toHexString(n, digits = 0) {
        let s = '';
        let hexChars = '0123456789ABCDEF';
        do {
            s = String.fromCharCode(hexChars.charCodeAt(n & 15)) + s;
            n = n >> 4;
        } while (n > 0);
        while (s.length < digits) {
            s = '0' + s;
        }
        return s;
    }
}
//# sourceMappingURL=ModelUtils.js.map