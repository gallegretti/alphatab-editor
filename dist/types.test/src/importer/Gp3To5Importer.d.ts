import { ScoreImporter } from '@src/importer/ScoreImporter';
import { IReadable } from '@src/io/IReadable';
import { Bar } from '@src/model/Bar';
import { Beat } from '@src/model/Beat';
import { Color } from '@src/model/Color';
import { DynamicValue } from '@src/model/DynamicValue';
import { HarmonicType } from '@src/model/HarmonicType';
import { Note } from '@src/model/Note';
import { Score } from '@src/model/Score';
import { Track } from '@src/model/Track';
import { Voice } from '@src/model/Voice';
import { IWriteable } from '@src/io/IWriteable';
export declare class Gp3To5Importer extends ScoreImporter {
    private static readonly VersionString;
    private _versionNumber;
    private _score;
    private _globalTripletFeel;
    private _lyricsTrack;
    private _lyrics;
    private _barCount;
    private _trackCount;
    private _playbackInfos;
    private _beatTextChunksByTrack;
    get name(): string;
    constructor();
    readScore(): Score;
    readVersion(): void;
    readScoreInformation(): void;
    readLyrics(): void;
    readPageSetup(): void;
    readPlaybackInfos(): void;
    readMasterBars(): void;
    readMasterBar(): void;
    readTracks(): void;
    readTrack(): void;
    readBars(): void;
    readBar(track: Track): void;
    readVoice(track: Track, bar: Bar): void;
    readBeat(track: Track, bar: Bar, voice: Voice): void;
    readChord(beat: Beat): void;
    readBeatEffects(beat: Beat): HarmonicType;
    readTremoloBarEffect(beat: Beat): void;
    private static toStrokeValue;
    readMixTableChange(beat: Beat): void;
    readNote(track: Track, bar: Bar, voice: Voice, beat: Beat, stringIndex: number): Note;
    toDynamicValue(value: number): DynamicValue;
    readNoteEffects(track: Track, voice: Voice, beat: Beat, note: Note): void;
    private static readonly BendStep;
    readBend(note: Note): void;
    readGrace(voice: Voice, note: Note): void;
    readTremoloPicking(beat: Beat): void;
    readSlide(note: Note): void;
    readArtificialHarmonic(note: Note): void;
    deltaFretToHarmonicValue(deltaFret: number): number;
    readTrill(note: Note): void;
}
export declare class GpBinaryHelpers {
    static gpReadDouble(data: IReadable): number;
    static gpReadFloat(data: IReadable): number;
    static gpReadColor(data: IReadable, readAlpha?: boolean): Color;
    static gpReadBool(data: IReadable): boolean;
    /**
     * Skips an integer (4byte) and reads a string using
     * a bytesize
     */
    static gpReadStringIntUnused(data: IReadable, encoding: string): string;
    /**
     * Reads an integer as size, and then the string itself
     */
    static gpReadStringInt(data: IReadable, encoding: string): string;
    /**
     * Reads an integer as size, skips a byte and reads the string itself
     */
    static gpReadStringIntByte(data: IReadable, encoding: string): string;
    static gpReadString(data: IReadable, length: number, encoding: string): string;
    static gpWriteString(data: IWriteable, s: string): void;
    /**
     * Reads a byte as size and the string itself.
     * Additionally it is ensured the specified amount of bytes is read.
     * @param data the data to read from.
     * @param length the amount of bytes to read
     * @param encoding The encoding to use to decode the byte into a string
     * @returns
     */
    static gpReadStringByteLength(data: IReadable, length: number, encoding: string): string;
}
