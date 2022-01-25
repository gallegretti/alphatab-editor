import { Environment } from '@src/Environment';
import { LogLevel } from '@src/LogLevel';
/**
 * @json
 */
export class CoreSettings {
    /**
     * @target web
     */
    constructor() {
        /**
         * Gets or sets the script file url that will be used to spawn the workers.
         * @target web
         */
        this.scriptFile = null;
        /**
         * Gets or sets the url to the fonts that will be used to generate the alphaTab font style.
         * @target web
         */
        this.fontDirectory = null;
        /**
         * Gets or sets the file to load directly after initializing alphaTab.
         * @target web
         */
        this.file = null;
        /**
         * Gets or sets whether the UI element contains alphaTex code that should be
         * used to initialize alphaTab.
         * @target web
         */
        this.tex = false;
        /**
         * Gets or sets the initial tracks that should be loaded for the score.
         * @target web
         */
        this.tracks = null;
        /**
         * Gets or sets whether lazy loading for displayed elements is enabled.
         */
        this.enableLazyLoading = true;
        /**
         * The engine which should be used to render the the tablature.
         *
         * - **default**- Platform specific default engine
         * - **html5**- HTML5 Canvas
         * - **svg**- SVG
         */
        this.engine = 'default';
        /**
         * The log level to use within alphaTab
         */
        this.logLevel = LogLevel.Info;
        /**
         * Gets or sets whether the rendering should be done in a worker if possible.
         */
        this.useWorkers = true;
        /**
         * Gets or sets whether in the {@link BoundsLookup} also the
         * position and area of each individual note is provided.
         */
        this.includeNoteBounds = false;
        if (!Environment.isRunningInWorker && Environment.globalThis.ALPHATAB_ROOT) {
            this.scriptFile = Environment.globalThis.ALPHATAB_ROOT;
            this.scriptFile = CoreSettings.ensureFullUrl(this.scriptFile);
            this.scriptFile = CoreSettings.appendScriptName(this.scriptFile);
        }
        else {
            this.scriptFile = Environment.scriptFile;
        }
        if (!Environment.isRunningInWorker && Environment.globalThis.ALPHATAB_FONT) {
            this.fontDirectory = Environment.globalThis['ALPHATAB_FONT'];
            this.fontDirectory = CoreSettings.ensureFullUrl(this.fontDirectory);
        }
        else {
            this.fontDirectory = this.scriptFile;
            if (this.fontDirectory) {
                let lastSlash = this.fontDirectory.lastIndexOf(String.fromCharCode(47));
                if (lastSlash >= 0) {
                    this.fontDirectory = this.fontDirectory.substr(0, lastSlash) + '/font/';
                }
            }
        }
    }
    /**
     * @target web
     */
    static ensureFullUrl(relativeUrl) {
        var _a, _b, _c;
        if (!relativeUrl) {
            return '';
        }
        if (!relativeUrl.startsWith('http') && !relativeUrl.startsWith('https') && !relativeUrl.startsWith('file')) {
            let root = '';
            let location = Environment.globalThis['location'];
            root += (_a = location.protocol) === null || _a === void 0 ? void 0 : _a.toString();
            root += '//' === null || '//' === void 0 ? void 0 : '//'.toString();
            if (location.hostname) {
                root += (_b = location.hostname) === null || _b === void 0 ? void 0 : _b.toString();
            }
            if (location.port) {
                root += ':' === null || ':' === void 0 ? void 0 : ':'.toString();
                root += (_c = location.port) === null || _c === void 0 ? void 0 : _c.toString();
            }
            // as it is not clearly defined how slashes are treated in the location object
            // better be safe than sorry here
            if (!relativeUrl.startsWith('/')) {
                let directory = location.pathname.split('/').slice(0, -1).join('/');
                if (directory.length > 0) {
                    if (!directory.startsWith('/')) {
                        root += '/' === null || '/' === void 0 ? void 0 : '/'.toString();
                    }
                    root += directory === null || directory === void 0 ? void 0 : directory.toString();
                }
            }
            if (!relativeUrl.startsWith('/')) {
                root += '/' === null || '/' === void 0 ? void 0 : '/'.toString();
            }
            root += relativeUrl === null || relativeUrl === void 0 ? void 0 : relativeUrl.toString();
            return root;
        }
        return relativeUrl;
    }
    static appendScriptName(url) {
        // append script name
        if (url && !url.endsWith('.js')) {
            if (!url.endsWith('/')) {
                url += '/';
            }
            url += 'alphaTab.js';
        }
        return url;
    }
}
//# sourceMappingURL=CoreSettings.js.map