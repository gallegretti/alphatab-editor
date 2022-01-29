import { Score } from '@src/model/Score';
import { Settings } from '@src/Settings';
export declare class CapellaParser {
    score: Score;
    private _trackChannel;
    private _beamingMode;
    private _galleryObjects;
    private _voiceCounts;
    private _isFirstSystem;
    parseXml(xml: string, settings: Settings): void;
    private consolidate;
    private static applyEffectRange;
    private parseDom;
    private _staffLookup;
    private parseLayout;
    private _brackets;
    private parseBrackets;
    private parseBracket;
    private parseLayoutStaves;
    private _staffLayoutLookup;
    private _staffLayouts;
    private parseStaffLayout;
    private parseClef;
    private parseClefOttava;
    private parseSystems;
    private parseSystem;
    private parseStaves;
    private _timeSignature;
    private _currentStaffLayout;
    private parseStaff;
    private parseTime;
    private parseVoices;
    private getOrCreateBar;
    private addNewBar;
    private _voiceStates;
    private _currentVoiceState;
    private _currentBar;
    private _currentVoice;
    private newBar;
    private parseVoice;
    private initFromPreviousBeat;
    private getLastBeat;
    private ensureVoice;
    private parseChord;
    private parseHeads;
    private _tieStarts;
    private _tieStartIds;
    private _slurs;
    private _crescendo;
    private parseHead;
    private parseBeatDrawObject;
    private parseBarDrawObject;
    private applyVolta;
    private parseLyric;
    private parseRestDurations;
    private parseDurationValue;
    private parseDuration;
    private parsePageObjects;
    private parseGallery;
    private parseDrawObj;
    private parseTrill;
    private parseOctaveClef;
    private parseVolta;
    private parseWedge;
    private parseTupletBracket;
    private parseWavyLine;
    private parseSlur;
    private parseGuitar;
    private parseText;
    private parseInfo;
}