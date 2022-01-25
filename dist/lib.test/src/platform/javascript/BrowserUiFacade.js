import { Environment } from '@src/Environment';
import { EventEmitter } from '@src/EventEmitter';
import { ScoreLoader } from '@src/importer/ScoreLoader';
import { Score } from '@src/model/Score';
import { NotationMode } from '@src/NotationSettings';
import { HtmlElementContainer } from '@src/platform/javascript/HtmlElementContainer';
import { FontSizes } from '@src/platform/svg/FontSizes';
import { Bounds } from '@src/rendering/utils/Bounds';
import { Settings } from '@src/Settings';
import { FontLoadingChecker } from '@src/util/FontLoadingChecker';
import { Logger } from '@src/Logger';
import { AlphaSynthScriptProcessorOutput } from '@src/platform/javascript/AlphaSynthScriptProcessorOutput';
import { AlphaSynthWebWorkerApi } from '@src/platform/javascript/AlphaSynthWebWorkerApi';
import { AlphaTabWorkerScoreRenderer } from '@src/platform/javascript/AlphaTabWorkerScoreRenderer';
import { Cursors } from '@src/platform/Cursors';
import { JsonConverter } from '@src/model/JsonConverter';
import { SettingsSerializer } from '@src/generated/SettingsSerializer';
import { WebPlatform } from './WebPlatform';
import { AlphaTabError, AlphaTabErrorType } from '@src/AlphaTabError';
import { AlphaSynthAudioWorkletOutput } from '@src/platform/javascript/AlphaSynthAudioWorkletOutput';
/**
 * @target web
 */
export class BrowserUiFacade {
    constructor(rootElement) {
        this._fontCheckers = new Map();
        this._contents = null;
        this._file = null;
        this._totalResultCount = 0;
        this._initialTrackIndexes = null;
        this._barToElementLookup = new Map();
        this.rootContainerBecameVisible = new EventEmitter();
        this.canRenderChanged = new EventEmitter();
        this._highlightedElements = [];
        this._scrollContainer = null;
        if (Environment.webPlatform !== WebPlatform.Browser &&
            Environment.webPlatform !== WebPlatform.BrowserModule) {
            throw new AlphaTabError(AlphaTabErrorType.General, 'Usage of AlphaTabApi is only possible in browser environments. For usage in node use the Low Level APIs');
        }
        rootElement.classList.add('alphaTab');
        this.rootContainer = new HtmlElementContainer(rootElement);
        this.areWorkersSupported = 'Worker' in window;
        Environment.bravuraFontChecker.fontLoaded.on(this.onFontLoaded.bind(this));
        this._intersectionObserver = new IntersectionObserver(this.onElementVisibilityChanged.bind(this), {
            threshold: [0, 0.01, 1]
        });
        this._intersectionObserver.observe(rootElement);
    }
    get resizeThrottle() {
        return 10;
    }
    get canRender() {
        return this.areAllFontsLoaded();
    }
    areAllFontsLoaded() {
        Environment.bravuraFontChecker.checkForFontAvailability();
        if (!Environment.bravuraFontChecker.isFontLoaded) {
            return false;
        }
        let isAnyNotLoaded = false;
        for (const checker of this._fontCheckers.values()) {
            if (!checker.isFontLoaded) {
                isAnyNotLoaded = true;
            }
        }
        if (isAnyNotLoaded) {
            return false;
        }
        Logger.debug('Font', 'All fonts loaded: ' + this._fontCheckers.size);
        return true;
    }
    onFontLoaded(family) {
        FontSizes.generateFontLookup(family);
        if (this.areAllFontsLoaded()) {
            this.canRenderChanged.trigger();
        }
    }
    onElementVisibilityChanged(entries) {
        for (const e of entries) {
            if (e.isIntersecting) {
                const htmlElement = e.target;
                if (htmlElement === this.rootContainer.element) {
                    this.rootContainerBecameVisible.trigger();
                    this._intersectionObserver.unobserve(this.rootContainer.element);
                }
                else if ('svg' in htmlElement.dataset) {
                    this.replacePlaceholder(htmlElement, htmlElement.dataset['svg']);
                    this._intersectionObserver.unobserve(htmlElement);
                }
            }
        }
    }
    createWorkerRenderer() {
        return new AlphaTabWorkerScoreRenderer(this._api, this._api.settings);
    }
    initialize(api, raw) {
        this._api = api;
        let settings;
        if (raw instanceof Settings) {
            settings = raw;
        }
        else {
            settings = JsonConverter.jsObjectToSettings(raw);
        }
        let dataAttributes = this.getDataAttributes();
        SettingsSerializer.fromJson(settings, dataAttributes);
        if (settings.notation.notationMode === NotationMode.SongBook) {
            settings.setSongBookModeSettings();
        }
        api.settings = settings;
        this.setupFontCheckers(settings);
        this._initialTrackIndexes = this.parseTracks(settings.core.tracks);
        this._contents = '';
        let element = api.container;
        if (settings.core.tex) {
            this._contents = element.element.innerHTML;
            element.element.innerHTML = '';
        }
        this.createStyleElement(settings);
        this._file = settings.core.file;
    }
    setupFontCheckers(settings) {
        this.registerFontChecker(settings.display.resources.copyrightFont);
        this.registerFontChecker(settings.display.resources.effectFont);
        this.registerFontChecker(settings.display.resources.fingeringFont);
        this.registerFontChecker(settings.display.resources.graceFont);
        this.registerFontChecker(settings.display.resources.markerFont);
        this.registerFontChecker(settings.display.resources.tablatureFont);
        this.registerFontChecker(settings.display.resources.titleFont);
        this.registerFontChecker(settings.display.resources.wordsFont);
        this.registerFontChecker(settings.display.resources.barNumberFont);
        this.registerFontChecker(settings.display.resources.fretboardNumberFont);
        this.registerFontChecker(settings.display.resources.subTitleFont);
    }
    registerFontChecker(font) {
        if (!this._fontCheckers.has(font.family)) {
            let checker = new FontLoadingChecker(font.family);
            this._fontCheckers.set(font.family, checker);
            checker.fontLoaded.on(this.onFontLoaded.bind(this));
            checker.checkForFontAvailability();
        }
    }
    destroy() {
        this.rootContainer.element.innerHTML = '';
    }
    createCanvasElement() {
        let canvasElement = document.createElement('div');
        canvasElement.className = 'at-surface';
        canvasElement.style.fontSize = '0';
        canvasElement.style.overflow = 'hidden';
        canvasElement.style.lineHeight = '0';
        return new HtmlElementContainer(canvasElement);
    }
    triggerEvent(container, name, details = null, originalEvent) {
        let element = container.element;
        name = 'alphaTab.' + name;
        let e = document.createEvent('CustomEvent');
        let originalMouseEvent = originalEvent
            ? originalEvent.mouseEvent
            : null;
        e.initCustomEvent(name, false, false, details);
        if (originalMouseEvent) {
            e.originalEvent = originalMouseEvent;
        }
        element.dispatchEvent(e);
        if (window && 'jQuery' in window) {
            let jquery = window['jQuery'];
            let args = [];
            args.push(details);
            if (originalMouseEvent) {
                args.push(originalMouseEvent);
            }
            jquery(element).trigger(name, args);
        }
    }
    load(data, success, error) {
        if (data instanceof Score) {
            success(data);
            return true;
        }
        if (data instanceof ArrayBuffer) {
            let byteArray = new Uint8Array(data);
            success(ScoreLoader.loadScoreFromBytes(byteArray, this._api.settings));
            return true;
        }
        if (data instanceof Uint8Array) {
            success(ScoreLoader.loadScoreFromBytes(data, this._api.settings));
            return true;
        }
        if (typeof data === 'string') {
            ScoreLoader.loadScoreAsync(data, success, error, this._api.settings);
            return true;
        }
        return false;
    }
    loadSoundFont(data, append) {
        if (!this._api.player) {
            return false;
        }
        if (data instanceof ArrayBuffer) {
            this._api.player.loadSoundFont(new Uint8Array(data), append);
            return true;
        }
        if (data instanceof Uint8Array) {
            this._api.player.loadSoundFont(data, append);
            return true;
        }
        if (typeof data === 'string') {
            this._api.loadSoundFontFromUrl(data, append);
            return true;
        }
        return false;
    }
    initialRender() {
        this._api.renderer.preRender.on((_) => {
            this._totalResultCount = 0;
            this._barToElementLookup.clear();
        });
        const initialRender = () => {
            var _a;
            // rendering was possibly delayed due to invisible element
            // in this case we need the correct width for autosize
            this._api.renderer.width = this.rootContainer.width | 0;
            this._api.renderer.updateSettings(this._api.settings);
            if (this._contents) {
                this._api.tex(this._contents, (_a = this._initialTrackIndexes) !== null && _a !== void 0 ? _a : undefined);
                this._initialTrackIndexes = null;
            }
            else if (this._file) {
                ScoreLoader.loadScoreAsync(this._file, s => {
                    var _a;
                    this._api.renderScore(s, (_a = this._initialTrackIndexes) !== null && _a !== void 0 ? _a : undefined);
                    this._initialTrackIndexes = null;
                }, e => {
                    this._api.onError(e);
                }, this._api.settings);
            }
        };
        if (!this.rootContainer.isVisible) {
            this.rootContainerBecameVisible.on(initialRender);
        }
        else {
            initialRender();
        }
    }
    createStyleElement(settings) {
        let elementDocument = this._api.container.element.ownerDocument;
        Environment.createStyleElement(elementDocument, settings.core.fontDirectory);
    }
    parseTracks(tracksData) {
        if (!tracksData) {
            return [];
        }
        let tracks = [];
        // decode string
        if (typeof tracksData === 'string') {
            try {
                if (tracksData === 'all') {
                    return [-1];
                }
                tracksData = JSON.parse(tracksData);
            }
            catch (e) {
                tracksData = [0];
            }
        }
        // decode array
        if (typeof tracksData === 'number') {
            tracks.push(tracksData);
        }
        else if ('length' in tracksData) {
            let length = tracksData.length;
            let array = tracksData;
            for (let i = 0; i < length; i++) {
                let item = array[i];
                let value = 0;
                if (typeof item === 'number') {
                    value = item;
                }
                else if ('index' in item) {
                    value = item.index;
                }
                else {
                    value = parseInt(item.toString());
                }
                if (value >= 0 || value === -1) {
                    tracks.push(value);
                }
            }
        }
        else if ('index' in tracksData) {
            tracks.push(tracksData.index);
        }
        return tracks;
    }
    getDataAttributes() {
        let dataAttributes = new Map();
        let element = this._api.container.element;
        if (element.dataset) {
            for (let key of Object.keys(element.dataset)) {
                let value = element.dataset[key];
                try {
                    let stringValue = value;
                    value = JSON.parse(stringValue);
                }
                catch (e) {
                    if (value === '') {
                        value = null;
                    }
                }
                dataAttributes.set(key, value);
            }
        }
        else {
            for (let i = 0; i < element.attributes.length; i++) {
                let attr = element.attributes.item(i);
                let nodeName = attr.nodeName;
                if (nodeName.startsWith('data-')) {
                    let keyParts = nodeName.substr(5).split('-');
                    let key = keyParts[0];
                    for (let j = 1; j < keyParts.length; j++) {
                        key += keyParts[j].substr(0, 1).toUpperCase() + keyParts[j].substr(1);
                    }
                    let value = attr.nodeValue;
                    try {
                        value = JSON.parse(value);
                    }
                    catch (e) {
                        if (value === '') {
                            value = null;
                        }
                    }
                    dataAttributes.set(key, value);
                }
            }
        }
        return dataAttributes;
    }
    beginAppendRenderResults(renderResult) {
        let canvasElement = this._api.canvasElement.element;
        // null result indicates that the rendering finished
        if (!renderResult) {
            // so we remove elements that might be from a previous render session
            while (canvasElement.childElementCount > this._totalResultCount) {
                canvasElement.removeChild(canvasElement.lastChild);
            }
        }
        else {
            let body = renderResult.renderResult;
            if (typeof body === 'string') {
                let placeholder;
                if (this._totalResultCount < canvasElement.childElementCount) {
                    placeholder = canvasElement.childNodes.item(this._totalResultCount);
                }
                else {
                    placeholder = document.createElement('div');
                    canvasElement.appendChild(placeholder);
                }
                placeholder.style.width = renderResult.width + 'px';
                placeholder.style.height = renderResult.height + 'px';
                placeholder.style.display = 'inline-block';
                if (!this._api.settings.core.enableLazyLoading) {
                    this.replacePlaceholder(placeholder, body);
                }
                else {
                    placeholder.dataset['svg'] = body;
                    this._intersectionObserver.observe(placeholder);
                }
                // remember which bar is contained in which node for faster lookup
                // on highlight/unhighlight
                for (let i = renderResult.firstMasterBarIndex; i <= renderResult.lastMasterBarIndex; i++) {
                    this._barToElementLookup.set(i, placeholder);
                }
            }
            else {
                if (this._totalResultCount < canvasElement.childElementCount) {
                    canvasElement.replaceChild(renderResult.renderResult, canvasElement.childNodes.item(this._totalResultCount));
                }
                else {
                    canvasElement.appendChild(renderResult.renderResult);
                }
            }
            this._totalResultCount++;
        }
    }
    replacePlaceholder(placeholder, body) {
        placeholder.innerHTML = body;
        delete placeholder.dataset['svg'];
    }
    /**
     * This method creates the player. It detects browser compatibility and
     * initializes a alphaSynth version for the client.
     */
    createWorkerPlayer() {
        let alphaSynthScriptFile = Environment.scriptFile;
        if (!alphaSynthScriptFile) {
            Logger.error('Player', 'alphaTab script file could not be detected, player cannot initialize');
            return null;
        }
        let player = null;
        let supportsScriptProcessor = 'ScriptProcessorNode' in window;
        let supportsAudioWorklets = window.isSecureContext && 'AudioWorkletNode' in window;
        if (supportsAudioWorklets) {
            Logger.debug('Player', 'Will use webworkers for synthesizing and web audio api with worklets for playback');
            player = new AlphaSynthWebWorkerApi(new AlphaSynthAudioWorkletOutput(), alphaSynthScriptFile, this._api.settings.core.logLevel);
        }
        else if (supportsScriptProcessor) {
            Logger.debug('Player', 'Will use webworkers for synthesizing and web audio api for playback');
            player = new AlphaSynthWebWorkerApi(new AlphaSynthScriptProcessorOutput(), alphaSynthScriptFile, this._api.settings.core.logLevel);
        }
        if (!player) {
            Logger.error('Player', 'Player requires webworkers and web audio api, browser unsupported', null);
        }
        else {
            player.ready.on(() => {
                if (this._api.settings.player.soundFont) {
                    this._api.loadSoundFontFromUrl(this._api.settings.player.soundFont, false);
                }
            });
        }
        return player;
    }
    beginInvoke(action) {
        window.requestAnimationFrame(() => {
            action();
        });
    }
    highlightElements(groupId, masterBarIndex) {
        const element = this._barToElementLookup.get(masterBarIndex);
        if (element) {
            let elementsToHighlight = element.getElementsByClassName(groupId);
            for (let i = 0; i < elementsToHighlight.length; i++) {
                elementsToHighlight.item(i).classList.add('at-highlight');
                this._highlightedElements.push(elementsToHighlight.item(i));
            }
        }
    }
    removeHighlights() {
        const highlightedElements = this._highlightedElements;
        if (!highlightedElements) {
            return;
        }
        for (const element of highlightedElements) {
            element.classList.remove('at-highlight');
        }
        this._highlightedElements = [];
    }
    destroyCursors() {
        let element = this._api.container.element;
        let cursorWrapper = element.querySelector('.at-cursors');
        element.removeChild(cursorWrapper);
    }
    createCursors() {
        let element = this._api.container.element;
        let cursorWrapper = document.createElement('div');
        cursorWrapper.classList.add('at-cursors');
        let selectionWrapper = document.createElement('div');
        selectionWrapper.classList.add('at-selection');
        let barCursor = document.createElement('div');
        barCursor.classList.add('at-cursor-bar');
        let beatCursor = document.createElement('div');
        beatCursor.classList.add('at-cursor-beat');
        // required css styles
        element.style.position = 'relative';
        element.style.textAlign = 'left';
        cursorWrapper.style.position = 'absolute';
        cursorWrapper.style.zIndex = '1000';
        cursorWrapper.style.display = 'inline';
        cursorWrapper.style.pointerEvents = 'none';
        selectionWrapper.style.position = 'absolute';
        barCursor.style.position = 'absolute';
        barCursor.style.left = '0';
        barCursor.style.top = '0';
        barCursor.style.willChange = 'transform';
        barCursor.style.width = '1px';
        barCursor.style.height = '1px';
        beatCursor.style.position = 'absolute';
        beatCursor.style.transition = 'all 0s linear';
        beatCursor.style.left = '0';
        beatCursor.style.top = '0';
        beatCursor.style.willChange = 'transform';
        beatCursor.style.width = '3px';
        beatCursor.style.height = '1px';
        // add cursors to UI
        element.insertBefore(cursorWrapper, element.firstChild);
        cursorWrapper.appendChild(selectionWrapper);
        cursorWrapper.appendChild(barCursor);
        cursorWrapper.appendChild(beatCursor);
        return new Cursors(new HtmlElementContainer(cursorWrapper), new HtmlElementContainer(barCursor), new HtmlElementContainer(beatCursor), new HtmlElementContainer(selectionWrapper));
    }
    getOffset(scrollContainer, container) {
        let element = container.element;
        let bounds = element.getBoundingClientRect();
        let top = bounds.top + element.ownerDocument.defaultView.pageYOffset;
        let left = bounds.left + element.ownerDocument.defaultView.pageXOffset;
        if (scrollContainer) {
            let scrollElement = scrollContainer.element;
            let nodeName = scrollElement.nodeName.toLowerCase();
            if (nodeName !== 'html' && nodeName !== 'body') {
                let scrollElementOffset = this.getOffset(null, scrollContainer);
                top = top + scrollElement.scrollTop - scrollElementOffset.y;
                left = left + scrollElement.scrollLeft - scrollElementOffset.x;
            }
        }
        let b = new Bounds();
        b.x = left;
        b.y = top;
        b.w = bounds.width;
        b.h = bounds.height;
        return b;
    }
    getScrollContainer() {
        if (this._scrollContainer) {
            return this._scrollContainer;
        }
        let scrollElement = 
        // tslint:disable-next-line: strict-type-predicates
        typeof this._api.settings.player.scrollElement === 'string'
            ? document.querySelector(this._api.settings.player.scrollElement)
            : this._api.settings.player.scrollElement;
        let nodeName = scrollElement.nodeName.toLowerCase();
        if (nodeName === 'html' || nodeName === 'body') {
            // https://github.com/CoderLine/alphaTab/issues/205
            // https://github.com/CoderLine/alphaTab/issues/354
            // https://dev.opera.com/articles/fixing-the-scrolltop-bug/
            if ('scrollingElement' in document) {
                scrollElement = document.scrollingElement;
            }
            else {
                const userAgent = navigator.userAgent;
                if (userAgent.indexOf('WebKit') !== -1) {
                    scrollElement = document.body;
                }
                else {
                    scrollElement = document.documentElement;
                }
            }
        }
        this._scrollContainer = new HtmlElementContainer(scrollElement);
        return this._scrollContainer;
    }
    createSelectionElement() {
        let element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.width = '1px';
        element.style.height = '1px';
        return new HtmlElementContainer(element);
    }
    scrollToY(element, scrollTargetY, speed) {
        this.internalScrollToY(element.element, scrollTargetY, speed);
    }
    scrollToX(element, scrollTargetY, speed) {
        this.internalScrollToX(element.element, scrollTargetY, speed);
    }
    internalScrollToY(element, scrollTargetY, speed) {
        if (this._api.settings.player.nativeBrowserSmoothScroll) {
            element.scrollTo({
                top: scrollTargetY,
                behavior: 'smooth'
            });
        }
        else {
            let startY = element.scrollTop;
            let diff = scrollTargetY - startY;
            let start = 0;
            let step = (x) => {
                if (start === 0) {
                    start = x;
                }
                let time = x - start;
                let percent = Math.min(time / speed, 1);
                element.scrollTop = (startY + diff * percent) | 0;
                if (time < speed) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }
    internalScrollToX(element, scrollTargetX, speed) {
        if (this._api.settings.player.nativeBrowserSmoothScroll) {
            element.scrollTo({
                left: scrollTargetX,
                behavior: 'smooth'
            });
        }
        else {
            let startX = element.scrollLeft;
            let diff = scrollTargetX - startX;
            let start = 0;
            let step = (t) => {
                if (start === 0) {
                    start = t;
                }
                let time = t - start;
                let percent = Math.min(time / speed, 1);
                element.scrollLeft = (startX + diff * percent) | 0;
                if (time < speed) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }
}
//# sourceMappingURL=BrowserUiFacade.js.map