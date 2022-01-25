import { Settings } from '@src/Settings';
import { ByteBuffer } from '@src/io/ByteBuffer';
/**
 * This is the base class for creating new song exporters which
 * enable writing scores to a binary datasink.
 */
export class ScoreExporter {
    /**
     * Initializes the importer with the given data and settings.
     */
    init(data, settings) {
        this.data = data;
        this.settings = settings;
    }
    /**
     * Exports the given score to a binary buffer.
     * @param score The score to serialize
     * @param settings  The settings to use during serialization
     * @returns A byte buffer with the serialized score.
     */
    export(score, settings = null) {
        const writable = ByteBuffer.withCapacity(1024);
        this.init(writable, settings !== null && settings !== void 0 ? settings : new Settings());
        this.writeScore(score);
        return writable.toArray();
    }
}
//# sourceMappingURL=ScoreExporter.js.map