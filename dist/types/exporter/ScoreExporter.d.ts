import { Settings } from '@src/Settings';
import { IWriteable } from '@src/io/IWriteable';
import { Score } from '@src/model/Score';
/**
 * This is the base class for creating new song exporters which
 * enable writing scores to a binary datasink.
 */
export declare abstract class ScoreExporter {
    protected data: IWriteable;
    protected settings: Settings;
    /**
     * Initializes the importer with the given data and settings.
     */
    init(data: IWriteable, settings: Settings): void;
    /**
     * Exports the given score to a binary buffer.
     * @param score The score to serialize
     * @param settings  The settings to use during serialization
     * @returns A byte buffer with the serialized score.
     */
    export(score: Score, settings?: Settings | null): Uint8Array;
    abstract get name(): string;
    /**
     * Writes the given score into the data sink.
     * @returns The score to write.
     */
    abstract writeScore(score: Score): void;
}
