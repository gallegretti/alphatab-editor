import { Score } from '@src/model/Score';
/**
 * This class can write a score.gpif XML from a given score model.
 */
export declare class GpifWriter {
    private _rhythmIdLookup;
    private static MidiProgramInfoLookup;
    private static DrumKitProgramInfo;
    writeXml(score: Score): string;
    private writeDom;
    private writeNoteNode;
    private writeNoteProperties;
    private writeTransposedPitch;
    private writeConcertPitch;
    private writePitchForValue;
    private writePitch;
    private writeBend;
    private writeStandardBend;
    private toBendValue;
    private toBendOffset;
    private writeBeatNode;
    private writeBeatLyrics;
    private writeBeatXProperties;
    private writeBeatProperties;
    private writeRhythm;
    private writeWhammyNode;
    private writeStandardWhammy;
    private writeScoreNode;
    private writeMasterTrackNode;
    private writeAudioTracksNode;
    private writeTracksNode;
    private writeTrackNode;
    private static getIconId;
    private writeSoundAndAutomation;
    private writeSoundsAndAutomations;
    private writeMidiConnectionNode;
    private writeRseNode;
    private writeStavesNode;
    private writeStaffNode;
    private writeDiagramCollection;
    private writeSimplePropertyNode;
    private writeSimpleXPropertyNode;
    private writeLyricsNode;
    private writeTransposeNode;
    private writeInstrumentSetNode;
    private mapMusicSymbol;
    private writeMasterBarsNode;
    private writeMasterBarNode;
    private writeFermatas;
    private writeFermata;
    private writeBarNode;
    private writeVoiceNode;
}
