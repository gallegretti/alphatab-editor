/**
 * All settings related to importers that decode file formats.
 * @json
 */
export declare class ImporterSettings {
    /**
     * The text encoding to use when decoding strings. By default UTF-8 is used.
     */
    encoding: string;
    /**
     * If part-groups should be merged into a single track.
     */
    mergePartGroupsInMusicXml: boolean;
    /**
     * If set to true, text annotations on beats are attempted to be parsed as
     * lyrics considering spaces as separators and removing underscores.
     * If a track/staff has explicit lyrics the beat texts will not be detected as lyrics.
     */
    beatTextAsLyrics: boolean;
}
