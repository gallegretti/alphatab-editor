import { Duration } from '@src/model/Duration';
import { Score } from '@src/model/Score';
import { Settings } from '@src/Settings';
/**
 * This structure represents a duration within a gpif
 */
export declare class GpifRhythm {
    id: string;
    dots: number;
    tupletDenominator: number;
    tupletNumerator: number;
    value: Duration;
}
/**
 * This class can parse a score.gpif xml file into the model structure
 */
export declare class GpifParser {
    private static readonly InvalidId;
    /**
     * GPX range: 0-100
     * Internal range: 0 - 60
     */
    private static readonly BendPointPositionFactor;
    /**
     * GPIF: 25 per quarternote
     * Internal Range: 1 per quarter note
     */
    private static readonly BendPointValueFactor;
    score: Score;
    private _masterTrackAutomations;
    private _automationsPerTrackIdAndBarIndex;
    private _tracksMapping;
    private _tracksById;
    private _masterBars;
    private _barsOfMasterBar;
    private _barsById;
    private _voicesOfBar;
    private _voiceById;
    private _beatsOfVoice;
    private _rhythmOfBeat;
    private _beatById;
    private _rhythmById;
    private _noteById;
    private _notesOfBeat;
    private _tappedNotes;
    private _lyricsByTrack;
    private _soundsByTrack;
    private _hasAnacrusis;
    private _articulationByName;
    private _skipApplyLyrics;
    parseXml(xml: string, settings: Settings): void;
    private parseDom;
    private parseScoreNode;
    private parseMasterTrackNode;
    private parseAutomations;
    private parseAutomation;
    private parseTracksNode;
    private parseTrack;
    private parseTrackAutomations;
    private parseNotationPatch;
    private parseInstrumentSet;
    private parseElements;
    private parseElement;
    private parseArticulations;
    private parseArticulation;
    private parseTechniqueSymbol;
    private parseNoteHead;
    private parseStaves;
    private parseStaff;
    private parseStaffProperties;
    private parseStaffProperty;
    private parseLyrics;
    private parseLyricsLine;
    private parseDiagramCollectionForTrack;
    private parseDiagramCollectionForStaff;
    private parseDiagramItemForTrack;
    private parseDiagramItemForStaff;
    private parseDiagramItemForChord;
    private parseTrackProperties;
    private parseTrackProperty;
    private parseGeneralMidi;
    private parseSounds;
    private parseSound;
    private parseSoundMidi;
    private parsePartSounding;
    private parseTranspose;
    private parseRSE;
    private parseChannelStrip;
    private parseChannelStripParameters;
    private parseMasterBarsNode;
    private parseMasterBar;
    private parseFermatas;
    private parseFermata;
    private parseBars;
    private parseBar;
    private parseVoices;
    private parseVoice;
    private parseBeats;
    private parseBeat;
    private parseBeatLyrics;
    private parseBeatXProperties;
    private parseBeatProperties;
    private parseNotes;
    private parseNote;
    private parseNoteProperties;
    private parseConcertPitch;
    private toBendValue;
    private toBendOffset;
    private parseRhythms;
    private parseRhythm;
    private buildModel;
}
