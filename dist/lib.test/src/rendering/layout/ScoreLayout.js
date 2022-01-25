import { StaveProfile } from '@src/StaveProfile';
import { Environment } from '@src/Environment';
import { Font, FontStyle, FontWeight } from '@src/model/Font';
import { TextAlign } from '@src/platform/ICanvas';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { ChordDiagramContainerGlyph } from '@src/rendering/glyphs/ChordDiagramContainerGlyph';
import { TextGlyph } from '@src/rendering/glyphs/TextGlyph';
import { RenderFinishedEventArgs } from '@src/rendering/RenderFinishedEventArgs';
import { RenderStaff } from '@src/rendering/staves/RenderStaff';
import { StaveGroup } from '@src/rendering/staves/StaveGroup';
import { Logger } from '@src/Logger';
import { NotationElement } from '@src/NotationSettings';
import { TuningContainerGlyph } from '../glyphs/TuningContainerGlyph';
/**
 * This is the base public class for creating new layouting engines for the score renderer.
 */
export class ScoreLayout {
    constructor(renderer) {
        this._barRendererLookup = new Map();
        this.width = 0;
        this.height = 0;
        this.scoreInfoGlyphs = new Map();
        this.chordDiagrams = null;
        this.tuningGlyph = null;
        this.firstBarIndex = 0;
        this.lastBarIndex = 0;
        this.renderer = renderer;
    }
    layoutAndRender() {
        let score = this.renderer.score;
        let startIndex = this.renderer.settings.display.startBar;
        startIndex--; // map to array index
        startIndex = Math.min(score.masterBars.length - 1, Math.max(0, startIndex));
        this.firstBarIndex = startIndex;
        let endBarIndex = this.renderer.settings.display.barCount;
        if (endBarIndex < 0) {
            endBarIndex = score.masterBars.length;
        }
        endBarIndex = startIndex + endBarIndex - 1; // map count to array index
        endBarIndex = Math.min(score.masterBars.length - 1, Math.max(0, endBarIndex));
        this.lastBarIndex = endBarIndex;
        this.createScoreInfoGlyphs();
        this.doLayoutAndRender();
    }
    createScoreInfoGlyphs() {
        Logger.debug('ScoreLayout', 'Creating score info glyphs');
        let notation = this.renderer.settings.notation;
        let score = this.renderer.score;
        let res = this.renderer.settings.display.resources;
        this.scoreInfoGlyphs = new Map();
        if (score.title && notation.isNotationElementVisible(NotationElement.ScoreTitle)) {
            this.scoreInfoGlyphs.set(NotationElement.ScoreTitle, new TextGlyph(0, 0, score.title, res.titleFont, TextAlign.Center));
        }
        if (score.subTitle && notation.isNotationElementVisible(NotationElement.ScoreSubTitle)) {
            this.scoreInfoGlyphs.set(NotationElement.ScoreSubTitle, new TextGlyph(0, 0, score.subTitle, res.subTitleFont, TextAlign.Center));
        }
        if (score.artist && notation.isNotationElementVisible(NotationElement.ScoreArtist)) {
            this.scoreInfoGlyphs.set(NotationElement.ScoreArtist, new TextGlyph(0, 0, score.artist, res.subTitleFont, TextAlign.Center));
        }
        if (score.album && notation.isNotationElementVisible(NotationElement.ScoreAlbum)) {
            this.scoreInfoGlyphs.set(NotationElement.ScoreAlbum, new TextGlyph(0, 0, score.album, res.subTitleFont, TextAlign.Center));
        }
        if (score.music &&
            score.music === score.words &&
            notation.isNotationElementVisible(NotationElement.ScoreWordsAndMusic)) {
            this.scoreInfoGlyphs.set(NotationElement.ScoreWordsAndMusic, new TextGlyph(0, 0, 'Music and Words by ' + score.words, res.wordsFont, TextAlign.Center));
        }
        else {
            if (score.music && notation.isNotationElementVisible(NotationElement.ScoreMusic)) {
                this.scoreInfoGlyphs.set(NotationElement.ScoreMusic, new TextGlyph(0, 0, 'Music by ' + score.music, res.wordsFont, TextAlign.Right));
            }
            if (score.words && notation.isNotationElementVisible(NotationElement.ScoreWords)) {
                this.scoreInfoGlyphs.set(NotationElement.ScoreWords, new TextGlyph(0, 0, 'Words by ' + score.words, res.wordsFont, TextAlign.Left));
            }
        }
        const fakeBarRenderer = new BarRendererBase(this.renderer, this.renderer.tracks[0].staves[0].bars[0]);
        if (notation.isNotationElementVisible(NotationElement.GuitarTuning)) {
            let tunings = [];
            for (let track of this.renderer.tracks) {
                for (let staff of track.staves) {
                    if (!staff.isPercussion && staff.isStringed && staff.tuning.length > 0 && staff.showTablature) {
                        tunings.push(staff);
                        break;
                    }
                }
            }
            // tuning info
            if (tunings.length > 0) {
                this.tuningGlyph = new TuningContainerGlyph(0, 0);
                this.tuningGlyph.renderer = fakeBarRenderer;
                for (const t of tunings) {
                    this.tuningGlyph.addTuning(t.stringTuning, tunings.length > 1 ? t.track.name : '');
                }
            }
        }
        // chord diagram glyphs
        if (notation.isNotationElementVisible(NotationElement.ChordDiagrams)) {
            this.chordDiagrams = new ChordDiagramContainerGlyph(0, 0);
            this.chordDiagrams.renderer = fakeBarRenderer;
            let chords = new Map();
            for (let track of this.renderer.tracks) {
                for (let staff of track.staves) {
                    for (const [chordId, chord] of staff.chords) {
                        if (!chords.has(chordId)) {
                            if (chord.showDiagram) {
                                chords.set(chordId, chord);
                                this.chordDiagrams.addChord(chord);
                            }
                        }
                    }
                }
            }
        }
    }
    get scale() {
        return this.renderer.settings.display.scale;
    }
    createEmptyStaveGroup() {
        let group = new StaveGroup();
        group.layout = this;
        for (let trackIndex = 0; trackIndex < this.renderer.tracks.length; trackIndex++) {
            let track = this.renderer.tracks[trackIndex];
            let hasScore = false;
            for (let staff of track.staves) {
                if (staff.showStandardNotation) {
                    hasScore = true;
                    break;
                }
            }
            for (let staffIndex = 0; staffIndex < track.staves.length; staffIndex++) {
                let staff = track.staves[staffIndex];
                // use optimal profile for track
                let staveProfile;
                if (staff.isPercussion) {
                    staveProfile = StaveProfile.Score;
                }
                else if (this.renderer.settings.display.staveProfile !== StaveProfile.Default) {
                    staveProfile = this.renderer.settings.display.staveProfile;
                }
                else if (staff.showTablature && staff.showStandardNotation) {
                    staveProfile = StaveProfile.ScoreTab;
                }
                else if (staff.showTablature) {
                    staveProfile = hasScore ? StaveProfile.TabMixed : StaveProfile.Tab;
                }
                else if (staff.showStandardNotation) {
                    staveProfile = StaveProfile.Score;
                }
                else {
                    continue;
                }
                let profile = Environment.staveProfiles.get(staveProfile);
                for (let factory of profile) {
                    if (factory.canCreate(track, staff)) {
                        group.addStaff(track, new RenderStaff(trackIndex, staff, factory));
                    }
                }
            }
        }
        return group;
    }
    registerBarRenderer(key, renderer) {
        if (!this._barRendererLookup.has(key)) {
            this._barRendererLookup.set(key, new Map());
        }
        this._barRendererLookup.get(key).set(renderer.bar.id, renderer);
    }
    unregisterBarRenderer(key, renderer) {
        if (this._barRendererLookup.has(key)) {
            let lookup = this._barRendererLookup.get(key);
            lookup.delete(renderer.bar.id);
        }
    }
    getRendererForBar(key, bar) {
        let barRendererId = bar.id;
        if (this._barRendererLookup.has(key) && this._barRendererLookup.get(key).has(barRendererId)) {
            return this._barRendererLookup.get(key).get(barRendererId);
        }
        return null;
    }
    renderAnnotation() {
        // attention, you are not allowed to remove change this notice within any version of this library without permission!
        let msg = 'rendered by alphaTab';
        let canvas = this.renderer.canvas;
        let resources = this.renderer.settings.display.resources;
        let size = 12 * this.renderer.settings.display.scale;
        let height = size * 2;
        this.height += height;
        let x = this.width / 2;
        canvas.beginRender(this.width, height);
        canvas.color = resources.mainGlyphColor;
        canvas.font = new Font(resources.copyrightFont.family, size, FontStyle.Plain, FontWeight.Bold);
        canvas.textAlign = TextAlign.Center;
        canvas.fillText(msg, x, size);
        let result = canvas.endRender();
        let e = new RenderFinishedEventArgs();
        e.width = this.width;
        e.height = height;
        e.renderResult = result;
        e.totalWidth = this.width;
        e.totalHeight = this.height;
        e.firstMasterBarIndex = -1;
        e.lastMasterBarIndex = -1;
        this.renderer.partialRenderFinished.trigger(e);
    }
}
//# sourceMappingURL=ScoreLayout.js.map