export declare class SynthConstants {
    static readonly DefaultChannelCount: number;
    static readonly MetronomeChannel: number;
    static readonly AudioChannels: number;
    static readonly MinVolume: number;
    static readonly MinProgram: number;
    static readonly MaxProgram: number;
    static readonly MinPlaybackSpeed: number;
    static readonly MaxPlaybackSpeed: number;
    /**
     * The Midi Pitch bend message is a 15-bit value
     */
    static readonly MaxPitchWheel: number;
    /**
     * The Midi 2.0 Pitch bend message is a 32-bit value
     */
    static readonly MaxPitchWheel20: number;
    /**
     * The pitch wheel value for no pitch change at all.
     */
    static readonly DefaultPitchWheel: number;
    static readonly MicroBufferCount: number;
    static readonly MicroBufferSize: number;
}
