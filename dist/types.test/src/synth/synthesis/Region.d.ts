import { HydraGenAmount } from '@src/synth/soundfont/Hydra';
import { Envelope } from '@src/synth/synthesis/Envelope';
import { LoopMode } from '@src/synth/synthesis/LoopMode';
export declare enum GenOperators {
    StartAddrsOffset = 0,
    EndAddrsOffset = 1,
    StartloopAddrsOffset = 2,
    EndloopAddrsOffset = 3,
    StartAddrsCoarseOffset = 4,
    ModLfoToPitch = 5,
    VibLfoToPitch = 6,
    ModEnvToPitch = 7,
    InitialFilterFc = 8,
    InitialFilterQ = 9,
    ModLfoToFilterFc = 10,
    ModEnvToFilterFc = 11,
    EndAddrsCoarseOffset = 12,
    ModLfoToVolume = 13,
    Unused1 = 14,
    ChorusEffectsSend = 15,
    ReverbEffectsSend = 16,
    Pan = 17,
    Unused2 = 18,
    Unused3 = 19,
    Unused4 = 20,
    DelayModLFO = 21,
    FreqModLFO = 22,
    DelayVibLFO = 23,
    FreqVibLFO = 24,
    DelayModEnv = 25,
    AttackModEnv = 26,
    HoldModEnv = 27,
    DecayModEnv = 28,
    SustainModEnv = 29,
    ReleaseModEnv = 30,
    KeynumToModEnvHold = 31,
    KeynumToModEnvDecay = 32,
    DelayVolEnv = 33,
    AttackVolEnv = 34,
    HoldVolEnv = 35,
    DecayVolEnv = 36,
    SustainVolEnv = 37,
    ReleaseVolEnv = 38,
    KeynumToVolEnvHold = 39,
    KeynumToVolEnvDecay = 40,
    Instrument = 41,
    Reserved1 = 42,
    KeyRange = 43,
    VelRange = 44,
    StartloopAddrsCoarseOffset = 45,
    Keynum = 46,
    Velocity = 47,
    InitialAttenuation = 48,
    Reserved2 = 49,
    EndloopAddrsCoarseOffset = 50,
    CoarseTune = 51,
    FineTune = 52,
    SampleID = 53,
    SampleModes = 54,
    Reserved3 = 55,
    ScaleTuning = 56,
    ExclusiveClass = 57,
    OverridingRootKey = 58,
    Unused5 = 59,
    EndOper = 60
}
export declare class Region {
    loopMode: LoopMode;
    sampleRate: number;
    loKey: number;
    hiKey: number;
    loVel: number;
    hiVel: number;
    group: number;
    offset: number;
    end: number;
    loopStart: number;
    loopEnd: number;
    transpose: number;
    tune: number;
    pitchKeyCenter: number;
    pitchKeyTrack: number;
    attenuation: number;
    pan: number;
    ampEnv: Envelope;
    modEnv: Envelope;
    initialFilterQ: number;
    initialFilterFc: number;
    modEnvToPitch: number;
    modEnvToFilterFc: number;
    modLfoToFilterFc: number;
    modLfoToVolume: number;
    delayModLFO: number;
    freqModLFO: number;
    modLfoToPitch: number;
    delayVibLFO: number;
    freqVibLFO: number;
    vibLfoToPitch: number;
    constructor(other?: Region);
    clear(forRelative: boolean): void;
    operator(genOper: number, amount: HydraGenAmount): void;
}
