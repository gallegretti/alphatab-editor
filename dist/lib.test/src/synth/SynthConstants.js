// The SoundFont loading and Audio Synthesis is based on TinySoundFont, licensed under MIT,
// developed by Bernhard Schelling (https://github.com/schellingb/TinySoundFont)
// TypeScript port for alphaTab: (C) 2020 by Daniel Kuschny
// Licensed under: MPL-2.0
export class SynthConstants {
}
SynthConstants.DefaultChannelCount = 16 + 1;
SynthConstants.MetronomeChannel = SynthConstants.DefaultChannelCount - 1;
SynthConstants.AudioChannels = 2;
SynthConstants.MinVolume = 0;
SynthConstants.MinProgram = 0;
SynthConstants.MaxProgram = 127;
SynthConstants.MinPlaybackSpeed = 0.125;
SynthConstants.MaxPlaybackSpeed = 8;
/**
 * The Midi Pitch bend message is a 15-bit value
 */
SynthConstants.MaxPitchWheel = 0x4000;
/**
 * The Midi 2.0 Pitch bend message is a 32-bit value
 */
SynthConstants.MaxPitchWheel20 = 0x100000000;
/**
 * The pitch wheel value for no pitch change at all.
 */
SynthConstants.DefaultPitchWheel = SynthConstants.MaxPitchWheel / 2;
SynthConstants.MicroBufferCount = 32;
SynthConstants.MicroBufferSize = 64;
//# sourceMappingURL=SynthConstants.js.map