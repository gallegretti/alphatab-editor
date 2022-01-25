import { Envelope } from '@src/synth/synthesis/Envelope';
import { LoopMode } from '@src/synth/synthesis/LoopMode';
import { TypeConversions } from '@src/io/TypeConversions';
export var GenOperators;
(function (GenOperators) {
    GenOperators[GenOperators["StartAddrsOffset"] = 0] = "StartAddrsOffset";
    GenOperators[GenOperators["EndAddrsOffset"] = 1] = "EndAddrsOffset";
    GenOperators[GenOperators["StartloopAddrsOffset"] = 2] = "StartloopAddrsOffset";
    GenOperators[GenOperators["EndloopAddrsOffset"] = 3] = "EndloopAddrsOffset";
    GenOperators[GenOperators["StartAddrsCoarseOffset"] = 4] = "StartAddrsCoarseOffset";
    GenOperators[GenOperators["ModLfoToPitch"] = 5] = "ModLfoToPitch";
    GenOperators[GenOperators["VibLfoToPitch"] = 6] = "VibLfoToPitch";
    GenOperators[GenOperators["ModEnvToPitch"] = 7] = "ModEnvToPitch";
    GenOperators[GenOperators["InitialFilterFc"] = 8] = "InitialFilterFc";
    GenOperators[GenOperators["InitialFilterQ"] = 9] = "InitialFilterQ";
    GenOperators[GenOperators["ModLfoToFilterFc"] = 10] = "ModLfoToFilterFc";
    GenOperators[GenOperators["ModEnvToFilterFc"] = 11] = "ModEnvToFilterFc";
    GenOperators[GenOperators["EndAddrsCoarseOffset"] = 12] = "EndAddrsCoarseOffset";
    GenOperators[GenOperators["ModLfoToVolume"] = 13] = "ModLfoToVolume";
    GenOperators[GenOperators["Unused1"] = 14] = "Unused1";
    GenOperators[GenOperators["ChorusEffectsSend"] = 15] = "ChorusEffectsSend";
    GenOperators[GenOperators["ReverbEffectsSend"] = 16] = "ReverbEffectsSend";
    GenOperators[GenOperators["Pan"] = 17] = "Pan";
    GenOperators[GenOperators["Unused2"] = 18] = "Unused2";
    GenOperators[GenOperators["Unused3"] = 19] = "Unused3";
    GenOperators[GenOperators["Unused4"] = 20] = "Unused4";
    GenOperators[GenOperators["DelayModLFO"] = 21] = "DelayModLFO";
    GenOperators[GenOperators["FreqModLFO"] = 22] = "FreqModLFO";
    GenOperators[GenOperators["DelayVibLFO"] = 23] = "DelayVibLFO";
    GenOperators[GenOperators["FreqVibLFO"] = 24] = "FreqVibLFO";
    GenOperators[GenOperators["DelayModEnv"] = 25] = "DelayModEnv";
    GenOperators[GenOperators["AttackModEnv"] = 26] = "AttackModEnv";
    GenOperators[GenOperators["HoldModEnv"] = 27] = "HoldModEnv";
    GenOperators[GenOperators["DecayModEnv"] = 28] = "DecayModEnv";
    GenOperators[GenOperators["SustainModEnv"] = 29] = "SustainModEnv";
    GenOperators[GenOperators["ReleaseModEnv"] = 30] = "ReleaseModEnv";
    GenOperators[GenOperators["KeynumToModEnvHold"] = 31] = "KeynumToModEnvHold";
    GenOperators[GenOperators["KeynumToModEnvDecay"] = 32] = "KeynumToModEnvDecay";
    GenOperators[GenOperators["DelayVolEnv"] = 33] = "DelayVolEnv";
    GenOperators[GenOperators["AttackVolEnv"] = 34] = "AttackVolEnv";
    GenOperators[GenOperators["HoldVolEnv"] = 35] = "HoldVolEnv";
    GenOperators[GenOperators["DecayVolEnv"] = 36] = "DecayVolEnv";
    GenOperators[GenOperators["SustainVolEnv"] = 37] = "SustainVolEnv";
    GenOperators[GenOperators["ReleaseVolEnv"] = 38] = "ReleaseVolEnv";
    GenOperators[GenOperators["KeynumToVolEnvHold"] = 39] = "KeynumToVolEnvHold";
    GenOperators[GenOperators["KeynumToVolEnvDecay"] = 40] = "KeynumToVolEnvDecay";
    GenOperators[GenOperators["Instrument"] = 41] = "Instrument";
    GenOperators[GenOperators["Reserved1"] = 42] = "Reserved1";
    GenOperators[GenOperators["KeyRange"] = 43] = "KeyRange";
    GenOperators[GenOperators["VelRange"] = 44] = "VelRange";
    GenOperators[GenOperators["StartloopAddrsCoarseOffset"] = 45] = "StartloopAddrsCoarseOffset";
    GenOperators[GenOperators["Keynum"] = 46] = "Keynum";
    GenOperators[GenOperators["Velocity"] = 47] = "Velocity";
    GenOperators[GenOperators["InitialAttenuation"] = 48] = "InitialAttenuation";
    GenOperators[GenOperators["Reserved2"] = 49] = "Reserved2";
    GenOperators[GenOperators["EndloopAddrsCoarseOffset"] = 50] = "EndloopAddrsCoarseOffset";
    GenOperators[GenOperators["CoarseTune"] = 51] = "CoarseTune";
    GenOperators[GenOperators["FineTune"] = 52] = "FineTune";
    GenOperators[GenOperators["SampleID"] = 53] = "SampleID";
    GenOperators[GenOperators["SampleModes"] = 54] = "SampleModes";
    GenOperators[GenOperators["Reserved3"] = 55] = "Reserved3";
    GenOperators[GenOperators["ScaleTuning"] = 56] = "ScaleTuning";
    GenOperators[GenOperators["ExclusiveClass"] = 57] = "ExclusiveClass";
    GenOperators[GenOperators["OverridingRootKey"] = 58] = "OverridingRootKey";
    GenOperators[GenOperators["Unused5"] = 59] = "Unused5";
    GenOperators[GenOperators["EndOper"] = 60] = "EndOper";
})(GenOperators || (GenOperators = {}));
export class Region {
    constructor(other) {
        this.loopMode = LoopMode.None;
        this.sampleRate = 0;
        this.loKey = 0;
        this.hiKey = 0;
        this.loVel = 0;
        this.hiVel = 0;
        this.group = 0;
        this.offset = 0;
        this.end = 0;
        this.loopStart = 0;
        this.loopEnd = 0;
        this.transpose = 0;
        this.tune = 0;
        this.pitchKeyCenter = 0;
        this.pitchKeyTrack = 0;
        this.attenuation = 0;
        this.pan = 0;
        this.ampEnv = new Envelope();
        this.modEnv = new Envelope();
        this.initialFilterQ = 0;
        this.initialFilterFc = 0;
        this.modEnvToPitch = 0;
        this.modEnvToFilterFc = 0;
        this.modLfoToFilterFc = 0;
        this.modLfoToVolume = 0;
        this.delayModLFO = 0;
        this.freqModLFO = 0;
        this.modLfoToPitch = 0;
        this.delayVibLFO = 0;
        this.freqVibLFO = 0;
        this.vibLfoToPitch = 0;
        if (other) {
            this.loopMode = other.loopMode;
            this.sampleRate = other.sampleRate;
            this.loKey = other.loKey;
            this.hiKey = other.hiKey;
            this.loVel = other.loVel;
            this.hiVel = other.hiVel;
            this.group = other.group;
            this.offset = other.offset;
            this.end = other.end;
            this.loopStart = other.loopStart;
            this.loopEnd = other.loopEnd;
            this.transpose = other.transpose;
            this.tune = other.tune;
            this.pitchKeyCenter = other.pitchKeyCenter;
            this.pitchKeyTrack = other.pitchKeyTrack;
            this.attenuation = other.attenuation;
            this.pan = other.pan;
            this.ampEnv = new Envelope(other.ampEnv);
            this.modEnv = new Envelope(other.modEnv);
            this.initialFilterQ = other.initialFilterQ;
            this.initialFilterFc = other.initialFilterFc;
            this.modEnvToPitch = other.modEnvToPitch;
            this.modEnvToFilterFc = other.modEnvToFilterFc;
            this.modLfoToFilterFc = other.modLfoToFilterFc;
            this.modLfoToVolume = other.modLfoToVolume;
            this.delayModLFO = other.delayModLFO;
            this.freqModLFO = other.freqModLFO;
            this.modLfoToPitch = other.modLfoToPitch;
            this.delayVibLFO = other.delayVibLFO;
            this.freqVibLFO = other.freqVibLFO;
            this.vibLfoToPitch = other.vibLfoToPitch;
        }
    }
    clear(forRelative) {
        this.loopMode = LoopMode.None;
        this.sampleRate = 0;
        this.loKey = 0;
        this.hiKey = 0;
        this.loVel = 0;
        this.hiVel = 0;
        this.group = 0;
        this.offset = 0;
        this.end = 0;
        this.loopStart = 0;
        this.loopEnd = 0;
        this.transpose = 0;
        this.tune = 0;
        this.pitchKeyCenter = 0;
        this.pitchKeyTrack = 0;
        this.attenuation = 0;
        this.pan = 0;
        this.ampEnv.clear();
        this.modEnv.clear();
        this.initialFilterQ = 0;
        this.initialFilterFc = 0;
        this.modEnvToPitch = 0;
        this.modEnvToFilterFc = 0;
        this.modLfoToFilterFc = 0;
        this.modLfoToVolume = 0;
        this.delayModLFO = 0;
        this.freqModLFO = 0;
        this.modLfoToPitch = 0;
        this.delayVibLFO = 0;
        this.freqVibLFO = 0;
        this.vibLfoToPitch = 0;
        this.hiKey = 127;
        this.hiVel = 127;
        this.pitchKeyCenter = 60; // C4
        if (forRelative) {
            return;
        }
        this.pitchKeyTrack = 100;
        this.pitchKeyCenter = -1;
        // SF2 defaults in timecents.
        this.ampEnv.delay = -12000.0;
        this.ampEnv.attack = -12000.0;
        this.ampEnv.hold = -12000.0;
        this.ampEnv.decay = -12000.0;
        this.ampEnv.release = -12000.0;
        this.modEnv.delay = -12000.0;
        this.modEnv.attack = -12000.0;
        this.modEnv.hold = -12000.0;
        this.modEnv.decay = -12000.0;
        this.modEnv.release = -12000.0;
        this.initialFilterFc = 13500;
        this.delayModLFO = -12000.0;
        this.delayVibLFO = -12000.0;
    }
    operator(genOper, amount) {
        switch (genOper) {
            case GenOperators.StartAddrsOffset:
                this.offset += TypeConversions.int16ToUint32(amount.shortAmount);
                break;
            case GenOperators.EndAddrsOffset:
                this.end += TypeConversions.int16ToUint32(amount.shortAmount);
                break;
            case GenOperators.StartloopAddrsOffset:
                this.loopStart += TypeConversions.int16ToUint32(amount.shortAmount);
                break;
            case GenOperators.EndloopAddrsOffset:
                this.loopEnd += TypeConversions.int16ToUint32(amount.shortAmount);
                break;
            case GenOperators.StartAddrsCoarseOffset:
                this.offset += TypeConversions.int16ToUint32(amount.shortAmount) * 32768;
                break;
            case GenOperators.ModLfoToPitch:
                this.modLfoToPitch = amount.shortAmount;
                break;
            case GenOperators.VibLfoToPitch:
                this.vibLfoToPitch = amount.shortAmount;
                break;
            case GenOperators.ModEnvToPitch:
                this.modEnvToPitch = amount.shortAmount;
                break;
            case GenOperators.InitialFilterFc:
                this.initialFilterFc = amount.shortAmount;
                break;
            case GenOperators.InitialFilterQ:
                this.initialFilterQ = amount.shortAmount;
                break;
            case GenOperators.ModLfoToFilterFc:
                this.modLfoToFilterFc = amount.shortAmount;
                break;
            case GenOperators.ModEnvToFilterFc:
                this.modEnvToFilterFc = amount.shortAmount;
                break;
            case GenOperators.EndAddrsCoarseOffset:
                this.end += TypeConversions.int16ToUint32(amount.shortAmount) * 32768;
                break;
            case GenOperators.ModLfoToVolume:
                this.modLfoToVolume = amount.shortAmount;
                break;
            case GenOperators.Pan:
                this.pan = amount.shortAmount / 1000.0;
                break;
            case GenOperators.DelayModLFO:
                this.delayModLFO = amount.shortAmount;
                break;
            case GenOperators.FreqModLFO:
                this.freqModLFO = amount.shortAmount;
                break;
            case GenOperators.DelayVibLFO:
                this.delayVibLFO = amount.shortAmount;
                break;
            case GenOperators.FreqVibLFO:
                this.freqVibLFO = amount.shortAmount;
                break;
            case GenOperators.DelayModEnv:
                this.modEnv.delay = amount.shortAmount;
                break;
            case GenOperators.AttackModEnv:
                this.modEnv.attack = amount.shortAmount;
                break;
            case GenOperators.HoldModEnv:
                this.modEnv.hold = amount.shortAmount;
                break;
            case GenOperators.DecayModEnv:
                this.modEnv.decay = amount.shortAmount;
                break;
            case GenOperators.SustainModEnv:
                this.modEnv.sustain = amount.shortAmount;
                break;
            case GenOperators.ReleaseModEnv:
                this.modEnv.release = amount.shortAmount;
                break;
            case GenOperators.KeynumToModEnvHold:
                this.modEnv.keynumToHold = amount.shortAmount;
                break;
            case GenOperators.KeynumToModEnvDecay:
                this.modEnv.keynumToDecay = amount.shortAmount;
                break;
            case GenOperators.DelayVolEnv:
                this.ampEnv.delay = amount.shortAmount;
                break;
            case GenOperators.AttackVolEnv:
                this.ampEnv.attack = amount.shortAmount;
                break;
            case GenOperators.HoldVolEnv:
                this.ampEnv.hold = amount.shortAmount;
                break;
            case GenOperators.DecayVolEnv:
                this.ampEnv.decay = amount.shortAmount;
                break;
            case GenOperators.SustainVolEnv:
                this.ampEnv.sustain = amount.shortAmount;
                break;
            case GenOperators.ReleaseVolEnv:
                this.ampEnv.release = amount.shortAmount;
                break;
            case GenOperators.KeynumToVolEnvHold:
                this.ampEnv.keynumToHold = amount.shortAmount;
                break;
            case GenOperators.KeynumToVolEnvDecay:
                this.ampEnv.keynumToDecay = amount.shortAmount;
                break;
            case GenOperators.KeyRange:
                this.loKey = amount.lowByteAmount;
                this.hiKey = amount.highByteAmount;
                break;
            case GenOperators.VelRange:
                this.loVel = amount.lowByteAmount;
                this.hiVel = amount.highByteAmount;
                break;
            case GenOperators.StartloopAddrsCoarseOffset:
                this.loopStart += TypeConversions.int16ToUint32(amount.shortAmount) * 32768;
                break;
            case GenOperators.InitialAttenuation:
                this.attenuation += amount.shortAmount * 0.1;
                break;
            case GenOperators.EndloopAddrsCoarseOffset:
                this.loopEnd += TypeConversions.int16ToUint32(amount.shortAmount) * 32768;
                break;
            case GenOperators.CoarseTune:
                this.transpose += amount.shortAmount;
                break;
            case GenOperators.FineTune:
                this.tune += amount.shortAmount;
                break;
            case GenOperators.SampleModes:
                this.loopMode =
                    (amount.wordAmount & 3) === 3
                        ? LoopMode.Sustain
                        : (amount.wordAmount & 3) === 1
                            ? LoopMode.Continuous
                            : LoopMode.None;
                break;
            case GenOperators.ScaleTuning:
                this.pitchKeyTrack = amount.shortAmount;
                break;
            case GenOperators.ExclusiveClass:
                this.group = amount.wordAmount;
                break;
            case GenOperators.OverridingRootKey:
                this.pitchKeyCenter = amount.shortAmount;
                break;
        }
    }
}
//# sourceMappingURL=Region.js.map