import { MasterBar } from '@src/model/MasterBar';
import { RenderStylesheet } from '@src/model/RenderStylesheet';
import { Track } from '@src/model/Track';
import { Settings } from '@src/Settings';
import { Note } from './Note';
/**
 * The score is the root node of the complete
 * model. It stores the basic information of
 * a song and stores the sub components.
 * @json
 */
export declare class Score {
    private _noteByIdLookup;
    private _currentRepeatGroup;
    /**
     * The album of this song.
     */
    album: string;
    /**
     * The artist who performs this song.
     */
    artist: string;
    /**
     * The owner of the copyright of this song.
     */
    copyright: string;
    /**
     * Additional instructions
     */
    instructions: string;
    /**
     * The author of the music.
     */
    music: string;
    /**
     * Some additional notes about the song.
     */
    notices: string;
    /**
     * The subtitle of the song.
     */
    subTitle: string;
    /**
     * The title of the song.
     */
    title: string;
    /**
     * The author of the song lyrics
     */
    words: string;
    /**
     * The author of this tablature.
     */
    tab: string;
    /**
     * Gets or sets the global tempo of the song in BPM. The tempo might change via {@link MasterBar.tempo}.
     */
    tempo: number;
    /**
     * Gets or sets the name/label of the tempo.
     */
    tempoLabel: string;
    /**
     * Gets or sets a list of all masterbars contained in this song.
     * @json_add addMasterBar
     */
    masterBars: MasterBar[];
    /**
     * Gets or sets a list of all tracks contained in this song.
     * @json_add addTrack
     */
    tracks: Track[];
    /**
     * Gets or sets the rendering stylesheet for this song.
     */
    stylesheet: RenderStylesheet;
    rebuildRepeatGroups(): void;
    addMasterBar(bar: MasterBar): void;
    addTrack(track: Track): void;
    finish(settings: Settings): void;
    registerNote(note: Note): void;
    getNoteById(noteId: number): Note | null;
}
