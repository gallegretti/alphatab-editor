/**
 * This is the base public class for creating new song importers which
 * enable reading scores from any binary datasource
 */
export class ScoreImporter {
    /**
     * Initializes the importer with the given data and settings.
     */
    init(data, settings) {
        this.data = data;
        this.settings = settings;
    }
}
//# sourceMappingURL=ScoreImporter.js.map