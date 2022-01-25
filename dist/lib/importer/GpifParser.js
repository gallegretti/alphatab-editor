import { UnsupportedFormatError } from '@src/importer/UnsupportedFormatError';
import { AccentuationType } from '@src/model/AccentuationType';
import { Automation, AutomationType } from '@src/model/Automation';
import { Bar } from '@src/model/Bar';
import { Beat } from '@src/model/Beat';
import { BendPoint } from '@src/model/BendPoint';
import { BrushType } from '@src/model/BrushType';
import { Chord } from '@src/model/Chord';
import { Clef } from '@src/model/Clef';
import { Color } from '@src/model/Color';
import { CrescendoType } from '@src/model/CrescendoType';
import { Duration } from '@src/model/Duration';
import { DynamicValue } from '@src/model/DynamicValue';
import { Fermata, FermataType } from '@src/model/Fermata';
import { Fingers } from '@src/model/Fingers';
import { GraceType } from '@src/model/GraceType';
import { HarmonicType } from '@src/model/HarmonicType';
import { KeySignatureType } from '@src/model/KeySignatureType';
import { Lyrics } from '@src/model/Lyrics';
import { MasterBar } from '@src/model/MasterBar';
import { Note } from '@src/model/Note';
import { Ottavia } from '@src/model/Ottavia';
import { PickStroke } from '@src/model/PickStroke';
import { Score } from '@src/model/Score';
import { Section } from '@src/model/Section';
import { SimileMark } from '@src/model/SimileMark';
import { SlideInType } from '@src/model/SlideInType';
import { SlideOutType } from '@src/model/SlideOutType';
import { Track } from '@src/model/Track';
import { TripletFeel } from '@src/model/TripletFeel';
import { VibratoType } from '@src/model/VibratoType';
import { Voice } from '@src/model/Voice';
import { XmlDocument } from '@src/xml/XmlDocument';
import { XmlNodeType } from '@src/xml/XmlNode';
import { MidiUtils } from '@src/midi/MidiUtils';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { NoteAccidentalMode } from '@src/model/NoteAccidentalMode';
import { PercussionMapper } from '@src/model/PercussionMapper';
import { InstrumentArticulation } from '@src/model/InstrumentArticulation';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { TextBaseline } from '@src/platform/ICanvas';
import { BeatCloner } from '@src/generated/model/BeatCloner';
import { NoteCloner } from '@src/generated/model/NoteCloner';
import { Logger } from '@src/Logger';
/**
 * This structure represents a duration within a gpif
 */
export class GpifRhythm {
    constructor() {
        this.id = '';
        this.dots = 0;
        this.tupletDenominator = -1;
        this.tupletNumerator = -1;
        this.value = Duration.Quarter;
    }
}
class GpifSound {
    constructor() {
        this.name = '';
        this.path = '';
        this.role = '';
        this.program = 0;
    }
    get uniqueId() {
        return this.path + ';' + this.name + ';' + this.role;
    }
}
/**
 * This class can parse a score.gpif xml file into the model structure
 */
export class GpifParser {
    constructor() {
        this._hasAnacrusis = false;
        this._skipApplyLyrics = false;
    }
    parseXml(xml, settings) {
        this._masterTrackAutomations = new Map();
        this._automationsPerTrackIdAndBarIndex = new Map();
        this._tracksMapping = [];
        this._tracksById = new Map();
        this._masterBars = [];
        this._barsOfMasterBar = [];
        this._voicesOfBar = new Map();
        this._barsById = new Map();
        this._voiceById = new Map();
        this._beatsOfVoice = new Map();
        this._beatById = new Map();
        this._rhythmOfBeat = new Map();
        this._rhythmById = new Map();
        this._notesOfBeat = new Map();
        this._noteById = new Map();
        this._tappedNotes = new Map();
        this._lyricsByTrack = new Map();
        this._soundsByTrack = new Map();
        this._skipApplyLyrics = false;
        let dom = new XmlDocument();
        try {
            dom.parse(xml);
        }
        catch (e) {
            throw new UnsupportedFormatError('Could not parse XML', e);
        }
        this.parseDom(dom);
        this.buildModel();
        this.score.finish(settings);
        if (!this._skipApplyLyrics && this._lyricsByTrack.size > 0) {
            for (const [t, lyrics] of this._lyricsByTrack) {
                let track = this._tracksById.get(t);
                track.applyLyrics(lyrics);
            }
        }
    }
    parseDom(dom) {
        let root = dom.firstElement;
        if (!root) {
            return;
        }
        // the XML uses IDs for referring elements within the
        //  Therefore we do the parsing in 2 steps:
        // - at first we read all model elements and store them by ID in a lookup table
        // - after that we need to join up the information.
        if (root.localName === 'GPIF') {
            this.score = new Score();
            // parse all children
            for (let n of root.childNodes) {
                if (n.nodeType === XmlNodeType.Element) {
                    switch (n.localName) {
                        case 'Score':
                            this.parseScoreNode(n);
                            break;
                        case 'MasterTrack':
                            this.parseMasterTrackNode(n);
                            break;
                        case 'Tracks':
                            this.parseTracksNode(n);
                            break;
                        case 'MasterBars':
                            this.parseMasterBarsNode(n);
                            break;
                        case 'Bars':
                            this.parseBars(n);
                            break;
                        case 'Voices':
                            this.parseVoices(n);
                            break;
                        case 'Beats':
                            this.parseBeats(n);
                            break;
                        case 'Notes':
                            this.parseNotes(n);
                            break;
                        case 'Rhythms':
                            this.parseRhythms(n);
                            break;
                    }
                }
            }
        }
        else {
            throw new UnsupportedFormatError('Root node of XML was not GPIF');
        }
    }
    //
    // <Score>...</Score>
    //
    parseScoreNode(element) {
        for (let c of element.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Title':
                        this.score.title = c.firstChild.innerText;
                        break;
                    case 'SubTitle':
                        this.score.subTitle = c.firstChild.innerText;
                        break;
                    case 'Artist':
                        this.score.artist = c.firstChild.innerText;
                        break;
                    case 'Album':
                        this.score.album = c.firstChild.innerText;
                        break;
                    case 'Words':
                        this.score.words = c.firstChild.innerText;
                        break;
                    case 'Music':
                        this.score.music = c.firstChild.innerText;
                        break;
                    case 'WordsAndMusic':
                        if (c.firstChild && c.firstChild.innerText !== '') {
                            let wordsAndMusic = c.firstChild.innerText;
                            if (wordsAndMusic && !this.score.words) {
                                this.score.words = wordsAndMusic;
                            }
                            if (wordsAndMusic && !this.score.music) {
                                this.score.music = wordsAndMusic;
                            }
                        }
                        break;
                    case 'Copyright':
                        this.score.copyright = c.firstChild.innerText;
                        break;
                    case 'Tabber':
                        this.score.tab = c.firstChild.innerText;
                        break;
                    case 'Instructions':
                        this.score.instructions = c.firstChild.innerText;
                        break;
                    case 'Notices':
                        this.score.notices = c.firstChild.innerText;
                        break;
                }
            }
        }
    }
    //
    // <MasterTrack>...</MasterTrack>
    //
    parseMasterTrackNode(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Automations':
                        this.parseAutomations(c, this._masterTrackAutomations, null);
                        break;
                    case 'Tracks':
                        this._tracksMapping = c.innerText.split(' ');
                        break;
                    case 'Anacrusis':
                        this._hasAnacrusis = true;
                        break;
                }
            }
        }
    }
    parseAutomations(node, automations, sounds) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Automation':
                        this.parseAutomation(c, automations, sounds);
                        break;
                }
            }
        }
    }
    parseAutomation(node, automations, sounds) {
        let type = null;
        let isLinear = false;
        let barIndex = -1;
        let ratioPosition = 0;
        let numberValue = 0;
        let textValue = null;
        let reference = 0;
        let text = null;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Type':
                        type = c.innerText;
                        break;
                    case 'Linear':
                        isLinear = c.innerText.toLowerCase() === 'true';
                        break;
                    case 'Bar':
                        barIndex = parseInt(c.innerText);
                        break;
                    case 'Position':
                        ratioPosition = parseFloat(c.innerText);
                        break;
                    case 'Value':
                        if (c.firstElement && c.firstElement.nodeType === XmlNodeType.CDATA) {
                            textValue = c.innerText;
                        }
                        else {
                            let parts = c.innerText.split(' ');
                            // Issue 391: Some GPX files might have
                            // single floating point value.
                            if (parts.length === 1) {
                                numberValue = parseFloat(parts[0]);
                                reference = 1;
                            }
                            else {
                                numberValue = parseFloat(parts[0]);
                                reference = parseInt(parts[1]);
                            }
                        }
                        break;
                    case 'Text':
                        text = c.innerText;
                        break;
                }
            }
        }
        if (!type) {
            return;
        }
        let automation = null;
        switch (type) {
            case 'Tempo':
                automation = Automation.buildTempoAutomation(isLinear, ratioPosition, numberValue, reference);
                break;
            case 'Sound':
                if (textValue && sounds && sounds.has(textValue)) {
                    automation = Automation.buildInstrumentAutomation(isLinear, ratioPosition, sounds.get(textValue).program);
                }
                break;
        }
        if (automation) {
            if (text) {
                automation.text = text;
            }
            if (barIndex >= 0) {
                if (!automations.has(barIndex)) {
                    automations.set(barIndex, []);
                }
                automations.get(barIndex).push(automation);
            }
        }
    }
    //
    // <Tracks>...</Tracks>
    //
    parseTracksNode(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Track':
                        this.parseTrack(c);
                        break;
                }
            }
        }
    }
    parseTrack(node) {
        this._articulationByName = new Map();
        let track = new Track();
        track.ensureStaveCount(1);
        let staff = track.staves[0];
        staff.showStandardNotation = true;
        let trackId = node.getAttribute('id');
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Name':
                        track.name = c.innerText;
                        break;
                    case 'Color':
                        let parts = c.innerText.split(' ');
                        if (parts.length >= 3) {
                            let r = parseInt(parts[0]);
                            let g = parseInt(parts[1]);
                            let b = parseInt(parts[2]);
                            track.color = new Color(r, g, b, 0xff);
                        }
                        break;
                    case 'Instrument':
                        let instrumentName = c.getAttribute('ref');
                        if (instrumentName.endsWith('-gs') || instrumentName.endsWith('GrandStaff')) {
                            track.ensureStaveCount(2);
                            track.staves[1].showStandardNotation = true;
                        }
                        break;
                    case 'InstrumentSet':
                        this.parseInstrumentSet(track, c);
                        break;
                    case 'NotationPatch':
                        this.parseNotationPatch(track, c);
                        break;
                    case 'ShortName':
                        track.shortName = c.innerText;
                        break;
                    case 'Lyrics':
                        this.parseLyrics(trackId, c);
                        break;
                    case 'Properties':
                        this.parseTrackProperties(track, c);
                        break;
                    case 'GeneralMidi':
                    case 'MidiConnection':
                    case 'MIDISettings':
                        this.parseGeneralMidi(track, c);
                        break;
                    case 'Sounds':
                        this.parseSounds(trackId, track, c);
                        break;
                    case 'PlaybackState':
                        let state = c.innerText;
                        track.playbackInfo.isSolo = state === 'Solo';
                        track.playbackInfo.isMute = state === 'Mute';
                        break;
                    case 'PartSounding':
                        this.parsePartSounding(track, c);
                        break;
                    case 'Staves':
                        this.parseStaves(track, c);
                        break;
                    case 'Transpose':
                        this.parseTranspose(track, c);
                        break;
                    case 'RSE':
                        this.parseRSE(track, c);
                        break;
                    case 'Automations':
                        this.parseTrackAutomations(trackId, c);
                        break;
                }
            }
        }
        this._tracksById.set(trackId, track);
    }
    parseTrackAutomations(trackId, c) {
        const trackAutomations = new Map();
        this._automationsPerTrackIdAndBarIndex.set(trackId, trackAutomations);
        this.parseAutomations(c, trackAutomations, this._soundsByTrack.get(trackId));
    }
    parseNotationPatch(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'LineCount':
                        const lineCount = parseInt(c.innerText);
                        for (let staff of track.staves) {
                            staff.standardNotationLineCount = lineCount;
                        }
                        break;
                    case 'Elements':
                        this.parseElements(track, c);
                        break;
                }
            }
        }
    }
    parseInstrumentSet(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Type':
                        switch (c.innerText) {
                            case 'drumKit':
                                for (let staff of track.staves) {
                                    staff.isPercussion = true;
                                }
                                break;
                        }
                        if (c.innerText === 'drumKit') {
                            for (let staff of track.staves) {
                                staff.isPercussion = true;
                            }
                        }
                        break;
                    case 'Elements':
                        this.parseElements(track, c);
                        break;
                    case 'LineCount':
                        const lineCount = parseInt(c.innerText);
                        for (let staff of track.staves) {
                            staff.standardNotationLineCount = lineCount;
                        }
                        break;
                }
            }
        }
    }
    parseElements(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Element':
                        this.parseElement(track, c);
                        break;
                }
            }
        }
    }
    parseElement(track, node) {
        const typeElement = node.findChildElement('Type');
        const type = typeElement ? typeElement.innerText : "";
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Name':
                    case 'Articulations':
                        this.parseArticulations(track, c, type);
                        break;
                }
            }
        }
    }
    parseArticulations(track, node, elementType) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Articulation':
                        this.parseArticulation(track, c, elementType);
                        break;
                }
            }
        }
    }
    parseArticulation(track, node, elementType) {
        const articulation = new InstrumentArticulation();
        articulation.outputMidiNumber = -1;
        articulation.elementType = elementType;
        let name = '';
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                const txt = c.innerText;
                switch (c.localName) {
                    case 'Name':
                        name = c.innerText;
                        break;
                    case 'OutputMidiNumber':
                        if (txt.length > 0) {
                            articulation.outputMidiNumber = parseInt(txt);
                        }
                        break;
                    case 'TechniqueSymbol':
                        articulation.techniqueSymbol = this.parseTechniqueSymbol(txt);
                        break;
                    case 'TechniquePlacement':
                        switch (txt) {
                            case 'outside':
                                articulation.techniqueSymbolPlacement = TextBaseline.Bottom;
                                break;
                            case 'inside':
                                articulation.techniqueSymbolPlacement = TextBaseline.Middle;
                                break;
                            case 'above':
                                articulation.techniqueSymbolPlacement = TextBaseline.Bottom;
                                break;
                            case 'below':
                                articulation.techniqueSymbolPlacement = TextBaseline.Top;
                                break;
                        }
                        break;
                    case 'Noteheads':
                        const noteHeadsTxt = txt.split(' ');
                        if (noteHeadsTxt.length >= 1) {
                            articulation.noteHeadDefault = this.parseNoteHead(noteHeadsTxt[0]);
                        }
                        if (noteHeadsTxt.length >= 2) {
                            articulation.noteHeadHalf = this.parseNoteHead(noteHeadsTxt[1]);
                        }
                        if (noteHeadsTxt.length >= 3) {
                            articulation.noteHeadWhole = this.parseNoteHead(noteHeadsTxt[2]);
                        }
                        if (articulation.noteHeadHalf == MusicFontSymbol.None) {
                            articulation.noteHeadHalf = articulation.noteHeadDefault;
                        }
                        if (articulation.noteHeadWhole == MusicFontSymbol.None) {
                            articulation.noteHeadWhole = articulation.noteHeadDefault;
                        }
                        break;
                    case 'StaffLine':
                        if (txt.length > 0) {
                            articulation.staffLine = parseInt(txt);
                        }
                        break;
                }
            }
        }
        if (articulation.outputMidiNumber !== -1) {
            track.percussionArticulations.push(articulation);
            if (name.length > 0) {
                this._articulationByName.set(name, articulation);
            }
        }
        else if (name.length > 0 && this._articulationByName.has(name)) {
            this._articulationByName.get(name).staffLine = articulation.staffLine;
        }
    }
    parseTechniqueSymbol(txt) {
        switch (txt) {
            case 'pictEdgeOfCymbal':
                return MusicFontSymbol.PictEdgeOfCymbal;
            case 'articStaccatoAbove':
                return MusicFontSymbol.ArticStaccatoAbove;
            case 'noteheadParenthesis':
                return MusicFontSymbol.NoteheadParenthesis;
            case 'stringsUpBow':
                return MusicFontSymbol.StringsUpBow;
            case 'stringsDownBow':
                return MusicFontSymbol.StringsDownBow;
            case 'guitarGolpe':
                return MusicFontSymbol.GuitarGolpe;
            default:
                return MusicFontSymbol.None;
        }
    }
    parseNoteHead(txt) {
        switch (txt) {
            case 'noteheadDoubleWholeSquare':
                return MusicFontSymbol.NoteheadDoubleWholeSquare;
            case 'noteheadDoubleWhole':
                return MusicFontSymbol.NoteheadDoubleWhole;
            case 'noteheadWhole':
                return MusicFontSymbol.NoteheadWhole;
            case 'noteheadHalf':
                return MusicFontSymbol.NoteheadHalf;
            case 'noteheadBlack':
                return MusicFontSymbol.NoteheadBlack;
            case 'noteheadNull':
                return MusicFontSymbol.NoteheadNull;
            case 'noteheadXOrnate':
                return MusicFontSymbol.NoteheadXOrnate;
            case 'noteheadTriangleUpWhole':
                return MusicFontSymbol.NoteheadTriangleUpWhole;
            case 'noteheadTriangleUpHalf':
                return MusicFontSymbol.NoteheadTriangleUpHalf;
            case 'noteheadTriangleUpBlack':
                return MusicFontSymbol.NoteheadTriangleUpBlack;
            case 'noteheadDiamondBlackWide':
                return MusicFontSymbol.NoteheadDiamondBlackWide;
            case 'noteheadDiamondWhite':
                return MusicFontSymbol.NoteheadDiamondWhite;
            case 'noteheadDiamondWhiteWide':
                return MusicFontSymbol.NoteheadDiamondWhiteWide;
            case 'noteheadCircleX':
                return MusicFontSymbol.NoteheadCircleX;
            case 'noteheadXWhole':
                return MusicFontSymbol.NoteheadXWhole;
            case 'noteheadXHalf':
                return MusicFontSymbol.NoteheadXHalf;
            case 'noteheadXBlack':
                return MusicFontSymbol.NoteheadXBlack;
            case 'noteheadParenthesis':
                return MusicFontSymbol.NoteheadParenthesis;
            case 'noteheadSlashedBlack2':
                return MusicFontSymbol.NoteheadSlashedBlack2;
            case 'noteheadCircleSlash':
                return MusicFontSymbol.NoteheadCircleSlash;
            case 'noteheadHeavyX':
                return MusicFontSymbol.NoteheadHeavyX;
            case 'noteheadHeavyXHat':
                return MusicFontSymbol.NoteheadHeavyXHat;
            default:
                Logger.warning('GPIF', 'Unknown notehead symbol', txt);
                return MusicFontSymbol.None;
        }
    }
    parseStaves(track, node) {
        let staffIndex = 0;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Staff':
                        track.ensureStaveCount(staffIndex + 1);
                        let staff = track.staves[staffIndex];
                        this.parseStaff(staff, c);
                        staffIndex++;
                        break;
                }
            }
        }
    }
    parseStaff(staff, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Properties':
                        this.parseStaffProperties(staff, c);
                        break;
                }
            }
        }
    }
    parseStaffProperties(staff, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Property':
                        this.parseStaffProperty(staff, c);
                        break;
                }
            }
        }
    }
    parseStaffProperty(staff, node) {
        let propertyName = node.getAttribute('name');
        switch (propertyName) {
            case 'Tuning':
                for (let c of node.childNodes) {
                    if (c.nodeType === XmlNodeType.Element) {
                        switch (c.localName) {
                            case 'Pitches':
                                let tuningParts = node.findChildElement('Pitches').innerText.split(' ');
                                let tuning = new Array(tuningParts.length);
                                for (let i = 0; i < tuning.length; i++) {
                                    tuning[tuning.length - 1 - i] = parseInt(tuningParts[i]);
                                }
                                staff.stringTuning.tunings = tuning;
                                break;
                            case 'Label':
                                staff.stringTuning.name = c.innerText;
                                break;
                        }
                    }
                }
                if (!staff.isPercussion) {
                    staff.showTablature = true;
                }
                break;
            case 'DiagramCollection':
            case 'ChordCollection':
                this.parseDiagramCollectionForStaff(staff, node);
                break;
            case 'CapoFret':
                let capo = parseInt(node.findChildElement('Fret').innerText);
                staff.capo = capo;
                break;
        }
    }
    parseLyrics(trackId, node) {
        let tracks = [];
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Line':
                        tracks.push(this.parseLyricsLine(c));
                        break;
                }
            }
        }
        this._lyricsByTrack.set(trackId, tracks);
    }
    parseLyricsLine(node) {
        let lyrics = new Lyrics();
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Offset':
                        lyrics.startBar = parseInt(c.innerText);
                        break;
                    case 'Text':
                        lyrics.text = c.innerText;
                        break;
                }
            }
        }
        return lyrics;
    }
    parseDiagramCollectionForTrack(track, node) {
        let items = node.findChildElement('Items');
        for (let c of items.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Item':
                        this.parseDiagramItemForTrack(track, c);
                        break;
                }
            }
        }
    }
    parseDiagramCollectionForStaff(staff, node) {
        let items = node.findChildElement('Items');
        for (let c of items.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Item':
                        this.parseDiagramItemForStaff(staff, c);
                        break;
                }
            }
        }
    }
    parseDiagramItemForTrack(track, node) {
        let chord = new Chord();
        let chordId = node.getAttribute('id');
        for (let staff of track.staves) {
            staff.addChord(chordId, chord);
        }
        this.parseDiagramItemForChord(chord, node);
    }
    parseDiagramItemForStaff(staff, node) {
        let chord = new Chord();
        let chordId = node.getAttribute('id');
        staff.addChord(chordId, chord);
        this.parseDiagramItemForChord(chord, node);
    }
    parseDiagramItemForChord(chord, node) {
        chord.name = node.getAttribute('name');
        let diagram = node.findChildElement('Diagram');
        let stringCount = parseInt(diagram.getAttribute('stringCount'));
        let baseFret = parseInt(diagram.getAttribute('baseFret'));
        chord.firstFret = baseFret + 1;
        for (let i = 0; i < stringCount; i++) {
            chord.strings.push(-1);
        }
        for (let c of diagram.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Fret':
                        let guitarString = parseInt(c.getAttribute('string'));
                        chord.strings[stringCount - guitarString - 1] = baseFret + parseInt(c.getAttribute('fret'));
                        break;
                    case 'Fingering':
                        let existingFingers = new Map();
                        for (let p of c.childNodes) {
                            if (p.nodeType === XmlNodeType.Element) {
                                switch (p.localName) {
                                    case 'Position':
                                        let finger = Fingers.Unknown;
                                        let fret = baseFret + parseInt(p.getAttribute('fret'));
                                        switch (p.getAttribute('finger')) {
                                            case 'Index':
                                                finger = Fingers.IndexFinger;
                                                break;
                                            case 'Middle':
                                                finger = Fingers.MiddleFinger;
                                                break;
                                            case 'Rank':
                                                finger = Fingers.AnnularFinger;
                                                break;
                                            case 'Pinky':
                                                finger = Fingers.LittleFinger;
                                                break;
                                            case 'Thumb':
                                                finger = Fingers.Thumb;
                                                break;
                                            case 'None':
                                                break;
                                        }
                                        if (finger !== Fingers.Unknown) {
                                            if (existingFingers.has(finger)) {
                                                chord.barreFrets.push(fret);
                                            }
                                            else {
                                                existingFingers.set(finger, true);
                                            }
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                    case 'Property':
                        switch (c.getAttribute('name')) {
                            case 'ShowName':
                                chord.showName = c.getAttribute('value') === 'true';
                                break;
                            case 'ShowDiagram':
                                chord.showDiagram = c.getAttribute('value') === 'true';
                                break;
                            case 'ShowFingering':
                                chord.showFingering = c.getAttribute('value') === 'true';
                                break;
                        }
                        break;
                }
            }
        }
    }
    parseTrackProperties(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Property':
                        this.parseTrackProperty(track, c);
                        break;
                }
            }
        }
    }
    parseTrackProperty(track, node) {
        let propertyName = node.getAttribute('name');
        switch (propertyName) {
            case 'Tuning':
                let tuningParts = node.findChildElement('Pitches').innerText.split(' ');
                let tuning = new Array(tuningParts.length);
                for (let i = 0; i < tuning.length; i++) {
                    tuning[tuning.length - 1 - i] = parseInt(tuningParts[i]);
                }
                for (let staff of track.staves) {
                    staff.stringTuning.tunings = tuning;
                    staff.showStandardNotation = true;
                    staff.showTablature = true;
                }
                break;
            case 'DiagramCollection':
            case 'ChordCollection':
                this.parseDiagramCollectionForTrack(track, node);
                break;
            case 'CapoFret':
                let capo = parseInt(node.findChildElement('Fret').innerText);
                for (let staff of track.staves) {
                    staff.capo = capo;
                }
                break;
        }
    }
    parseGeneralMidi(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Program':
                        track.playbackInfo.program = parseInt(c.innerText);
                        break;
                    case 'Port':
                        track.playbackInfo.port = parseInt(c.innerText);
                        break;
                    case 'PrimaryChannel':
                        track.playbackInfo.primaryChannel = parseInt(c.innerText);
                        break;
                    case 'SecondaryChannel':
                        track.playbackInfo.secondaryChannel = parseInt(c.innerText);
                        break;
                }
            }
        }
        let isPercussion = node.getAttribute('table') === 'Percussion';
        if (isPercussion) {
            for (let staff of track.staves) {
                staff.isPercussion = true;
            }
        }
    }
    parseSounds(trackId, track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Sound':
                        this.parseSound(trackId, track, c);
                        break;
                }
            }
        }
    }
    parseSound(trackId, track, node) {
        const sound = new GpifSound();
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Name':
                        sound.name = c.innerText;
                        break;
                    case 'Path':
                        sound.path = c.innerText;
                        break;
                    case 'Role':
                        sound.role = c.innerText;
                        break;
                    case 'MIDI':
                        this.parseSoundMidi(sound, c);
                        break;
                }
            }
        }
        if (sound.role === 'Factory' || track.playbackInfo.program === 0) {
            track.playbackInfo.program = sound.program;
        }
        if (!this._soundsByTrack.has(trackId)) {
            this._soundsByTrack.set(trackId, new Map());
        }
        this._soundsByTrack.get(trackId).set(sound.uniqueId, sound);
    }
    parseSoundMidi(sound, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Program':
                        sound.program = parseInt(c.innerText);
                        break;
                }
            }
        }
    }
    parsePartSounding(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'TranspositionPitch':
                        for (let staff of track.staves) {
                            staff.displayTranspositionPitch = parseInt(c.innerText);
                        }
                        break;
                }
            }
        }
    }
    parseTranspose(track, node) {
        let octave = 0;
        let chromatic = 0;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Chromatic':
                        chromatic = parseInt(c.innerText);
                        break;
                    case 'Octave':
                        octave = parseInt(c.innerText);
                        break;
                }
            }
        }
        for (let staff of track.staves) {
            staff.displayTranspositionPitch = octave * 12 + chromatic;
        }
    }
    parseRSE(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'ChannelStrip':
                        this.parseChannelStrip(track, c);
                        break;
                }
            }
        }
    }
    parseChannelStrip(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Parameters':
                        this.parseChannelStripParameters(track, c);
                        break;
                }
            }
        }
    }
    parseChannelStripParameters(track, node) {
        if (node.firstChild && node.firstChild.value) {
            let parameters = node.firstChild.value.split(' ');
            if (parameters.length >= 12) {
                track.playbackInfo.balance = Math.floor(parseFloat(parameters[11]) * 16);
                track.playbackInfo.volume = Math.floor(parseFloat(parameters[12]) * 16);
            }
        }
    }
    //
    // <MasterBars>...</MasterBars>
    //
    parseMasterBarsNode(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'MasterBar':
                        this.parseMasterBar(c);
                        break;
                }
            }
        }
    }
    parseMasterBar(node) {
        let masterBar = new MasterBar();
        if (this._masterBars.length === 0 && this._hasAnacrusis) {
            masterBar.isAnacrusis = true;
        }
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Time':
                        let timeParts = c.innerText.split('/');
                        masterBar.timeSignatureNumerator = parseInt(timeParts[0]);
                        masterBar.timeSignatureDenominator = parseInt(timeParts[1]);
                        break;
                    case 'DoubleBar':
                        masterBar.isDoubleBar = true;
                        break;
                    case 'Section':
                        masterBar.section = new Section();
                        masterBar.section.marker = c.findChildElement('Letter').innerText;
                        masterBar.section.text = c.findChildElement('Text').innerText;
                        break;
                    case 'Repeat':
                        if (c.getAttribute('start').toLowerCase() === 'true') {
                            masterBar.isRepeatStart = true;
                        }
                        if (c.getAttribute('end').toLowerCase() === 'true' && c.getAttribute('count')) {
                            masterBar.repeatCount = parseInt(c.getAttribute('count'));
                        }
                        break;
                    case 'AlternateEndings':
                        let alternateEndings = c.innerText.split(' ');
                        let i = 0;
                        for (let k = 0; k < alternateEndings.length; k++) {
                            i = i | (1 << (-1 + parseInt(alternateEndings[k])));
                        }
                        masterBar.alternateEndings = i;
                        break;
                    case 'Bars':
                        this._barsOfMasterBar.push(c.innerText.split(' '));
                        break;
                    case 'TripletFeel':
                        switch (c.innerText) {
                            case 'NoTripletFeel':
                                masterBar.tripletFeel = TripletFeel.NoTripletFeel;
                                break;
                            case 'Triplet8th':
                                masterBar.tripletFeel = TripletFeel.Triplet8th;
                                break;
                            case 'Triplet16th':
                                masterBar.tripletFeel = TripletFeel.Triplet16th;
                                break;
                            case 'Dotted8th':
                                masterBar.tripletFeel = TripletFeel.Dotted8th;
                                break;
                            case 'Dotted16th':
                                masterBar.tripletFeel = TripletFeel.Dotted16th;
                                break;
                            case 'Scottish8th':
                                masterBar.tripletFeel = TripletFeel.Scottish8th;
                                break;
                            case 'Scottish16th':
                                masterBar.tripletFeel = TripletFeel.Scottish16th;
                                break;
                        }
                        break;
                    case 'Key':
                        masterBar.keySignature = parseInt(c.findChildElement('AccidentalCount').innerText);
                        let mode = c.findChildElement('Mode');
                        if (mode) {
                            switch (mode.innerText.toLowerCase()) {
                                case 'major':
                                    masterBar.keySignatureType = KeySignatureType.Major;
                                    break;
                                case 'minor':
                                    masterBar.keySignatureType = KeySignatureType.Minor;
                                    break;
                            }
                        }
                        break;
                    case 'Fermatas':
                        this.parseFermatas(masterBar, c);
                        break;
                }
            }
        }
        this._masterBars.push(masterBar);
    }
    parseFermatas(masterBar, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Fermata':
                        this.parseFermata(masterBar, c);
                        break;
                }
            }
        }
    }
    parseFermata(masterBar, node) {
        let offset = 0;
        let fermata = new Fermata();
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Type':
                        switch (c.innerText) {
                            case 'Short':
                                fermata.type = FermataType.Short;
                                break;
                            case 'Medium':
                                fermata.type = FermataType.Medium;
                                break;
                            case 'Long':
                                fermata.type = FermataType.Long;
                                break;
                        }
                        break;
                    case 'Length':
                        fermata.length = parseFloat(c.innerText);
                        break;
                    case 'Offset':
                        let parts = c.innerText.split('/');
                        if (parts.length === 2) {
                            let numerator = parseInt(parts[0]);
                            let denominator = parseInt(parts[1]);
                            offset = ((numerator / denominator) * MidiUtils.QuarterTime) | 0;
                        }
                        break;
                }
            }
        }
        masterBar.addFermata(offset, fermata);
    }
    //
    // <Bars>...</Bars>
    //
    parseBars(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Bar':
                        this.parseBar(c);
                        break;
                }
            }
        }
    }
    parseBar(node) {
        let bar = new Bar();
        let barId = node.getAttribute('id');
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Voices':
                        this._voicesOfBar.set(barId, c.innerText.split(' '));
                        break;
                    case 'Clef':
                        switch (c.innerText) {
                            case 'Neutral':
                                bar.clef = Clef.Neutral;
                                break;
                            case 'G2':
                                bar.clef = Clef.G2;
                                break;
                            case 'F4':
                                bar.clef = Clef.F4;
                                break;
                            case 'C4':
                                bar.clef = Clef.C4;
                                break;
                            case 'C3':
                                bar.clef = Clef.C3;
                                break;
                        }
                        break;
                    case 'Ottavia':
                        switch (c.innerText) {
                            case '8va':
                                bar.clefOttava = Ottavia._8va;
                                break;
                            case '15ma':
                                bar.clefOttava = Ottavia._15ma;
                                break;
                            case '8vb':
                                bar.clefOttava = Ottavia._8vb;
                                break;
                            case '15mb':
                                bar.clefOttava = Ottavia._15mb;
                                break;
                        }
                        break;
                    case 'SimileMark':
                        switch (c.innerText) {
                            case 'Simple':
                                bar.simileMark = SimileMark.Simple;
                                break;
                            case 'FirstOfDouble':
                                bar.simileMark = SimileMark.FirstOfDouble;
                                break;
                            case 'SecondOfDouble':
                                bar.simileMark = SimileMark.SecondOfDouble;
                                break;
                        }
                        break;
                }
            }
        }
        this._barsById.set(barId, bar);
    }
    //
    // <Voices>...</Voices>
    //
    parseVoices(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Voice':
                        this.parseVoice(c);
                        break;
                }
            }
        }
    }
    parseVoice(node) {
        let voice = new Voice();
        let voiceId = node.getAttribute('id');
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Beats':
                        this._beatsOfVoice.set(voiceId, c.innerText.split(' '));
                        break;
                }
            }
        }
        this._voiceById.set(voiceId, voice);
    }
    //
    // <Beats>...</Beats>
    //
    parseBeats(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Beat':
                        this.parseBeat(c);
                        break;
                }
            }
        }
    }
    parseBeat(node) {
        let beat = new Beat();
        let beatId = node.getAttribute('id');
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Notes':
                        this._notesOfBeat.set(beatId, c.innerText.split(' '));
                        break;
                    case 'Rhythm':
                        this._rhythmOfBeat.set(beatId, c.getAttribute('ref'));
                        break;
                    case 'Fadding':
                        if (c.innerText === 'FadeIn') {
                            beat.fadeIn = true;
                        }
                        break;
                    case 'Tremolo':
                        switch (c.innerText) {
                            case '1/2':
                                beat.tremoloSpeed = Duration.Eighth;
                                break;
                            case '1/4':
                                beat.tremoloSpeed = Duration.Sixteenth;
                                break;
                            case '1/8':
                                beat.tremoloSpeed = Duration.ThirtySecond;
                                break;
                        }
                        break;
                    case 'Chord':
                        beat.chordId = c.innerText;
                        break;
                    case 'Hairpin':
                        switch (c.innerText) {
                            case 'Crescendo':
                                beat.crescendo = CrescendoType.Crescendo;
                                break;
                            case 'Decrescendo':
                                beat.crescendo = CrescendoType.Decrescendo;
                                break;
                        }
                        break;
                    case 'Arpeggio':
                        if (c.innerText === 'Up') {
                            beat.brushType = BrushType.ArpeggioUp;
                        }
                        else {
                            beat.brushType = BrushType.ArpeggioDown;
                        }
                        break;
                    case 'Properties':
                        this.parseBeatProperties(c, beat);
                        break;
                    case 'XProperties':
                        this.parseBeatXProperties(c, beat);
                        break;
                    case 'FreeText':
                        beat.text = c.innerText;
                        break;
                    case 'TransposedPitchStemOrientation':
                        switch (c.innerText) {
                            case 'Upward':
                                beat.preferredBeamDirection = BeamDirection.Up;
                                break;
                            case 'Downward':
                                beat.preferredBeamDirection = BeamDirection.Down;
                                break;
                        }
                        break;
                    case 'Dynamic':
                        switch (c.innerText) {
                            case 'PPP':
                                beat.dynamics = DynamicValue.PPP;
                                break;
                            case 'PP':
                                beat.dynamics = DynamicValue.PP;
                                break;
                            case 'P':
                                beat.dynamics = DynamicValue.P;
                                break;
                            case 'MP':
                                beat.dynamics = DynamicValue.MP;
                                break;
                            case 'MF':
                                beat.dynamics = DynamicValue.MF;
                                break;
                            case 'F':
                                beat.dynamics = DynamicValue.F;
                                break;
                            case 'FF':
                                beat.dynamics = DynamicValue.FF;
                                break;
                            case 'FFF':
                                beat.dynamics = DynamicValue.FFF;
                                break;
                        }
                        break;
                    case 'GraceNotes':
                        switch (c.innerText) {
                            case 'OnBeat':
                                beat.graceType = GraceType.OnBeat;
                                break;
                            case 'BeforeBeat':
                                beat.graceType = GraceType.BeforeBeat;
                                break;
                        }
                        break;
                    case 'Legato':
                        if (c.getAttribute('origin') === 'true') {
                            beat.isLegatoOrigin = true;
                        }
                        break;
                    case 'Whammy':
                        let whammyOrigin = new BendPoint(0, 0);
                        whammyOrigin.value = this.toBendValue(parseFloat(c.getAttribute('originValue')));
                        whammyOrigin.offset = this.toBendOffset(parseFloat(c.getAttribute('originOffset')));
                        beat.addWhammyBarPoint(whammyOrigin);
                        let whammyMiddle1 = new BendPoint(0, 0);
                        whammyMiddle1.value = this.toBendValue(parseFloat(c.getAttribute('middleValue')));
                        whammyMiddle1.offset = this.toBendOffset(parseFloat(c.getAttribute('middleOffset1')));
                        beat.addWhammyBarPoint(whammyMiddle1);
                        let whammyMiddle2 = new BendPoint(0, 0);
                        whammyMiddle2.value = this.toBendValue(parseFloat(c.getAttribute('middleValue')));
                        whammyMiddle2.offset = this.toBendOffset(parseFloat(c.getAttribute('middleOffset2')));
                        beat.addWhammyBarPoint(whammyMiddle2);
                        let whammyDestination = new BendPoint(0, 0);
                        whammyDestination.value = this.toBendValue(parseFloat(c.getAttribute('destinationValue')));
                        whammyDestination.offset = this.toBendOffset(parseFloat(c.getAttribute('destinationOffset')));
                        beat.addWhammyBarPoint(whammyDestination);
                        break;
                    case 'Ottavia':
                        switch (c.innerText) {
                            case '8va':
                                beat.ottava = Ottavia._8va;
                                break;
                            case '8vb':
                                beat.ottava = Ottavia._8vb;
                                break;
                            case '15ma':
                                beat.ottava = Ottavia._15ma;
                                break;
                            case '15mb':
                                beat.ottava = Ottavia._15mb;
                                break;
                        }
                        break;
                    case 'Lyrics':
                        beat.lyrics = this.parseBeatLyrics(c);
                        this._skipApplyLyrics = true;
                        break;
                }
            }
        }
        this._beatById.set(beatId, beat);
    }
    parseBeatLyrics(node) {
        const lines = [];
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Line':
                        lines.push(c.innerText);
                        break;
                }
            }
        }
        return lines;
    }
    parseBeatXProperties(node, beat) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'XProperty':
                        let id = c.getAttribute('id');
                        let value = 0;
                        switch (id) {
                            case '1124204545':
                                value = parseInt(c.findChildElement('Int').innerText);
                                beat.invertBeamDirection = value === 1;
                                break;
                            case '687935489':
                                value = parseInt(c.findChildElement('Int').innerText);
                                beat.brushDuration = value;
                                break;
                        }
                        break;
                }
            }
        }
    }
    parseBeatProperties(node, beat) {
        let isWhammy = false;
        let whammyOrigin = null;
        let whammyMiddleValue = null;
        let whammyMiddleOffset1 = null;
        let whammyMiddleOffset2 = null;
        let whammyDestination = null;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Property':
                        let name = c.getAttribute('name');
                        switch (name) {
                            case 'Brush':
                                if (c.findChildElement('Direction').innerText === 'Up') {
                                    beat.brushType = BrushType.BrushUp;
                                }
                                else {
                                    beat.brushType = BrushType.BrushDown;
                                }
                                break;
                            case 'PickStroke':
                                if (c.findChildElement('Direction').innerText === 'Up') {
                                    beat.pickStroke = PickStroke.Up;
                                }
                                else {
                                    beat.pickStroke = PickStroke.Down;
                                }
                                break;
                            case 'Slapped':
                                if (c.findChildElement('Enable')) {
                                    beat.slap = true;
                                }
                                break;
                            case 'Popped':
                                if (c.findChildElement('Enable')) {
                                    beat.pop = true;
                                }
                                break;
                            case 'VibratoWTremBar':
                                switch (c.findChildElement('Strength').innerText) {
                                    case 'Wide':
                                        beat.vibrato = VibratoType.Wide;
                                        break;
                                    case 'Slight':
                                        beat.vibrato = VibratoType.Slight;
                                        break;
                                }
                                break;
                            case 'WhammyBar':
                                isWhammy = true;
                                break;
                            case 'WhammyBarExtend':
                                // not clear what this is used for
                                break;
                            case 'WhammyBarOriginValue':
                                if (!whammyOrigin) {
                                    whammyOrigin = new BendPoint(0, 0);
                                }
                                whammyOrigin.value = this.toBendValue(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'WhammyBarOriginOffset':
                                if (!whammyOrigin) {
                                    whammyOrigin = new BendPoint(0, 0);
                                }
                                whammyOrigin.offset = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'WhammyBarMiddleValue':
                                whammyMiddleValue = this.toBendValue(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'WhammyBarMiddleOffset1':
                                whammyMiddleOffset1 = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'WhammyBarMiddleOffset2':
                                whammyMiddleOffset2 = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'WhammyBarDestinationValue':
                                if (!whammyDestination) {
                                    whammyDestination = new BendPoint(BendPoint.MaxPosition, 0);
                                }
                                whammyDestination.value = this.toBendValue(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'WhammyBarDestinationOffset':
                                if (!whammyDestination) {
                                    whammyDestination = new BendPoint(0, 0);
                                }
                                whammyDestination.offset = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                        }
                        break;
                }
            }
        }
        if (isWhammy) {
            if (!whammyOrigin) {
                whammyOrigin = new BendPoint(0, 0);
            }
            if (!whammyDestination) {
                whammyDestination = new BendPoint(BendPoint.MaxPosition, 0);
            }
            beat.addWhammyBarPoint(whammyOrigin);
            if (whammyMiddleOffset1 && whammyMiddleValue) {
                beat.addWhammyBarPoint(new BendPoint(whammyMiddleOffset1, whammyMiddleValue));
            }
            if (whammyMiddleOffset2 && whammyMiddleValue) {
                beat.addWhammyBarPoint(new BendPoint(whammyMiddleOffset2, whammyMiddleValue));
            }
            if (!whammyMiddleOffset1 && !whammyMiddleOffset2 && whammyMiddleValue) {
                beat.addWhammyBarPoint(new BendPoint((BendPoint.MaxPosition / 2) | 0, whammyMiddleValue));
            }
            beat.addWhammyBarPoint(whammyDestination);
        }
    }
    //
    // <Notes>...</Notes>
    //
    parseNotes(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Note':
                        this.parseNote(c);
                        break;
                }
            }
        }
    }
    parseNote(node) {
        let note = new Note();
        let noteId = node.getAttribute('id');
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Properties':
                        this.parseNoteProperties(c, note, noteId);
                        break;
                    case 'AntiAccent':
                        if (c.innerText.toLowerCase() === 'normal') {
                            note.isGhost = true;
                        }
                        break;
                    case 'LetRing':
                        note.isLetRing = true;
                        break;
                    case 'Trill':
                        note.trillValue = parseInt(c.innerText);
                        note.trillSpeed = Duration.Sixteenth;
                        break;
                    case 'Accent':
                        let accentFlags = parseInt(c.innerText);
                        if ((accentFlags & 0x01) !== 0) {
                            note.isStaccato = true;
                        }
                        if ((accentFlags & 0x04) !== 0) {
                            note.accentuated = AccentuationType.Heavy;
                        }
                        if ((accentFlags & 0x08) !== 0) {
                            note.accentuated = AccentuationType.Normal;
                        }
                        break;
                    case 'Tie':
                        if (c.getAttribute('destination').toLowerCase() === 'true') {
                            note.isTieDestination = true;
                        }
                        break;
                    case 'Vibrato':
                        switch (c.innerText) {
                            case 'Slight':
                                note.vibrato = VibratoType.Slight;
                                break;
                            case 'Wide':
                                note.vibrato = VibratoType.Wide;
                                break;
                        }
                        break;
                    case 'LeftFingering':
                        note.isFingering = true;
                        switch (c.innerText) {
                            case 'P':
                                note.leftHandFinger = Fingers.Thumb;
                                break;
                            case 'I':
                                note.leftHandFinger = Fingers.IndexFinger;
                                break;
                            case 'M':
                                note.leftHandFinger = Fingers.MiddleFinger;
                                break;
                            case 'A':
                                note.leftHandFinger = Fingers.AnnularFinger;
                                break;
                            case 'C':
                                note.leftHandFinger = Fingers.LittleFinger;
                                break;
                        }
                        break;
                    case 'RightFingering':
                        note.isFingering = true;
                        switch (c.innerText) {
                            case 'P':
                                note.rightHandFinger = Fingers.Thumb;
                                break;
                            case 'I':
                                note.rightHandFinger = Fingers.IndexFinger;
                                break;
                            case 'M':
                                note.rightHandFinger = Fingers.MiddleFinger;
                                break;
                            case 'A':
                                note.rightHandFinger = Fingers.AnnularFinger;
                                break;
                            case 'C':
                                note.rightHandFinger = Fingers.LittleFinger;
                                break;
                        }
                        break;
                    case 'InstrumentArticulation':
                        note.percussionArticulation = parseInt(c.innerText);
                        break;
                }
            }
        }
        this._noteById.set(noteId, note);
    }
    parseNoteProperties(node, note, noteId) {
        let isBended = false;
        let bendOrigin = null;
        let bendMiddleValue = null;
        let bendMiddleOffset1 = null;
        let bendMiddleOffset2 = null;
        let bendDestination = null;
        // GP6 had percussion as element+variation
        let element = -1;
        let variation = -1;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Property':
                        let name = c.getAttribute('name');
                        switch (name) {
                            case 'String':
                                note.string = parseInt(c.findChildElement('String').innerText) + 1;
                                break;
                            case 'Fret':
                                note.fret = parseInt(c.findChildElement('Fret').innerText);
                                break;
                            case 'Element':
                                element = parseInt(c.findChildElement('Element').innerText);
                                break;
                            case 'Variation':
                                variation = parseInt(c.findChildElement('Variation').innerText);
                                break;
                            case 'Tapped':
                                this._tappedNotes.set(noteId, true);
                                break;
                            case 'HarmonicType':
                                let htype = c.findChildElement('HType');
                                if (htype) {
                                    switch (htype.innerText) {
                                        case 'NoHarmonic':
                                            note.harmonicType = HarmonicType.None;
                                            break;
                                        case 'Natural':
                                            note.harmonicType = HarmonicType.Natural;
                                            break;
                                        case 'Artificial':
                                            note.harmonicType = HarmonicType.Artificial;
                                            break;
                                        case 'Pinch':
                                            note.harmonicType = HarmonicType.Pinch;
                                            break;
                                        case 'Tap':
                                            note.harmonicType = HarmonicType.Tap;
                                            break;
                                        case 'Semi':
                                            note.harmonicType = HarmonicType.Semi;
                                            break;
                                        case 'Feedback':
                                            note.harmonicType = HarmonicType.Feedback;
                                            break;
                                    }
                                }
                                break;
                            case 'HarmonicFret':
                                let hfret = c.findChildElement('HFret');
                                if (hfret) {
                                    note.harmonicValue = parseFloat(hfret.innerText);
                                }
                                break;
                            case 'Muted':
                                if (c.findChildElement('Enable')) {
                                    note.isDead = true;
                                }
                                break;
                            case 'PalmMuted':
                                if (c.findChildElement('Enable')) {
                                    note.isPalmMute = true;
                                }
                                break;
                            case 'Octave':
                                note.octave = parseInt(c.findChildElement('Number').innerText);
                                // when exporting GP6 from GP7 the tone might be missing
                                if (note.tone === -1) {
                                    note.tone = 0;
                                }
                                break;
                            case 'Tone':
                                note.tone = parseInt(c.findChildElement('Step').innerText);
                                break;
                            case 'ConcertPitch':
                                this.parseConcertPitch(c, note);
                                break;
                            case 'Bended':
                                isBended = true;
                                break;
                            case 'BendOriginValue':
                                if (!bendOrigin) {
                                    bendOrigin = new BendPoint(0, 0);
                                }
                                bendOrigin.value = this.toBendValue(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'BendOriginOffset':
                                if (!bendOrigin) {
                                    bendOrigin = new BendPoint(0, 0);
                                }
                                bendOrigin.offset = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'BendMiddleValue':
                                bendMiddleValue = this.toBendValue(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'BendMiddleOffset1':
                                bendMiddleOffset1 = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'BendMiddleOffset2':
                                bendMiddleOffset2 = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'BendDestinationValue':
                                if (!bendDestination) {
                                    bendDestination = new BendPoint(BendPoint.MaxPosition, 0);
                                }
                                bendDestination.value = this.toBendValue(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'BendDestinationOffset':
                                if (!bendDestination) {
                                    bendDestination = new BendPoint(0, 0);
                                }
                                bendDestination.offset = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'HopoOrigin':
                                if (c.findChildElement('Enable')) {
                                    note.isHammerPullOrigin = true;
                                }
                                break;
                            case 'HopoDestination':
                                // NOTE: gets automatically calculated
                                // if (FindChildElement(node, "Enable"))
                                //     note.isHammerPullDestination = true;
                                break;
                            case 'LeftHandTapped':
                                note.isLeftHandTapped = true;
                                break;
                            case 'Slide':
                                let slideFlags = parseInt(c.findChildElement('Flags').innerText);
                                if ((slideFlags & 1) !== 0) {
                                    note.slideOutType = SlideOutType.Shift;
                                }
                                else if ((slideFlags & 2) !== 0) {
                                    note.slideOutType = SlideOutType.Legato;
                                }
                                else if ((slideFlags & 4) !== 0) {
                                    note.slideOutType = SlideOutType.OutDown;
                                }
                                else if ((slideFlags & 8) !== 0) {
                                    note.slideOutType = SlideOutType.OutUp;
                                }
                                if ((slideFlags & 16) !== 0) {
                                    note.slideInType = SlideInType.IntoFromBelow;
                                }
                                else if ((slideFlags & 32) !== 0) {
                                    note.slideInType = SlideInType.IntoFromAbove;
                                }
                                if ((slideFlags & 64) !== 0) {
                                    note.slideOutType = SlideOutType.PickSlideDown;
                                }
                                else if ((slideFlags & 128) !== 0) {
                                    note.slideOutType = SlideOutType.PickSlideUp;
                                }
                                break;
                        }
                        break;
                }
            }
        }
        if (isBended) {
            if (!bendOrigin) {
                bendOrigin = new BendPoint(0, 0);
            }
            if (!bendDestination) {
                bendDestination = new BendPoint(BendPoint.MaxPosition, 0);
            }
            note.addBendPoint(bendOrigin);
            if (bendMiddleOffset1 && bendMiddleValue) {
                note.addBendPoint(new BendPoint(bendMiddleOffset1, bendMiddleValue));
            }
            if (bendMiddleOffset2 && bendMiddleValue) {
                note.addBendPoint(new BendPoint(bendMiddleOffset2, bendMiddleValue));
            }
            if (!bendMiddleOffset1 && !bendMiddleOffset2 && bendMiddleValue) {
                note.addBendPoint(new BendPoint((BendPoint.MaxPosition / 2) | 0, bendMiddleValue));
            }
            note.addBendPoint(bendDestination);
        }
        // map GP6 element and variation combos to midi numbers
        if (element !== -1 && variation !== -1) {
            note.percussionArticulation = PercussionMapper.articulationFromElementVariation(element, variation);
        }
    }
    parseConcertPitch(node, note) {
        const pitch = node.findChildElement('Pitch');
        if (pitch) {
            for (let c of pitch.childNodes) {
                if (c.nodeType === XmlNodeType.Element) {
                    switch (c.localName) {
                        case 'Accidental':
                            switch (c.innerText) {
                                case 'x':
                                    note.accidentalMode = NoteAccidentalMode.ForceDoubleSharp;
                                    break;
                                case '#':
                                    note.accidentalMode = NoteAccidentalMode.ForceSharp;
                                    break;
                                case 'b':
                                    note.accidentalMode = NoteAccidentalMode.ForceFlat;
                                    break;
                                case 'bb':
                                    note.accidentalMode = NoteAccidentalMode.ForceDoubleFlat;
                                    break;
                            }
                            break;
                    }
                }
            }
        }
    }
    toBendValue(gpxValue) {
        return (gpxValue * GpifParser.BendPointValueFactor) | 0;
    }
    toBendOffset(gpxOffset) {
        return (gpxOffset * GpifParser.BendPointPositionFactor);
    }
    parseRhythms(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Rhythm':
                        this.parseRhythm(c);
                        break;
                }
            }
        }
    }
    parseRhythm(node) {
        let rhythm = new GpifRhythm();
        let rhythmId = node.getAttribute('id');
        rhythm.id = rhythmId;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'NoteValue':
                        switch (c.innerText) {
                            case 'Long':
                                rhythm.value = Duration.QuadrupleWhole;
                                break;
                            case 'DoubleWhole':
                                rhythm.value = Duration.DoubleWhole;
                                break;
                            case 'Whole':
                                rhythm.value = Duration.Whole;
                                break;
                            case 'Half':
                                rhythm.value = Duration.Half;
                                break;
                            case 'Quarter':
                                rhythm.value = Duration.Quarter;
                                break;
                            case 'Eighth':
                                rhythm.value = Duration.Eighth;
                                break;
                            case '16th':
                                rhythm.value = Duration.Sixteenth;
                                break;
                            case '32nd':
                                rhythm.value = Duration.ThirtySecond;
                                break;
                            case '64th':
                                rhythm.value = Duration.SixtyFourth;
                                break;
                            case '128th':
                                rhythm.value = Duration.OneHundredTwentyEighth;
                                break;
                            case '256th':
                                rhythm.value = Duration.TwoHundredFiftySixth;
                                break;
                        }
                        break;
                    case 'PrimaryTuplet':
                        rhythm.tupletNumerator = parseInt(c.getAttribute('num'));
                        rhythm.tupletDenominator = parseInt(c.getAttribute('den'));
                        break;
                    case 'AugmentationDot':
                        rhythm.dots = parseInt(c.getAttribute('count'));
                        break;
                }
            }
        }
        this._rhythmById.set(rhythmId, rhythm);
    }
    buildModel() {
        // build score
        for (let i = 0, j = this._masterBars.length; i < j; i++) {
            let masterBar = this._masterBars[i];
            this.score.addMasterBar(masterBar);
        }
        // add tracks to score
        for (let trackId of this._tracksMapping) {
            if (!trackId) {
                continue;
            }
            let track = this._tracksById.get(trackId);
            this.score.addTrack(track);
        }
        // process all masterbars
        for (let barIds of this._barsOfMasterBar) {
            // add all bars of masterbar vertically to all tracks
            let staffIndex = 0;
            for (let barIndex = 0, trackIndex = 0; barIndex < barIds.length && trackIndex < this.score.tracks.length; barIndex++) {
                let barId = barIds[barIndex];
                if (barId !== GpifParser.InvalidId) {
                    let bar = this._barsById.get(barId);
                    let track = this.score.tracks[trackIndex];
                    let staff = track.staves[staffIndex];
                    staff.addBar(bar);
                    if (this._voicesOfBar.has(barId)) {
                        // add voices to bars
                        for (let voiceId of this._voicesOfBar.get(barId)) {
                            if (voiceId !== GpifParser.InvalidId) {
                                let voice = this._voiceById.get(voiceId);
                                bar.addVoice(voice);
                                if (this._beatsOfVoice.has(voiceId)) {
                                    // add beats to voices
                                    for (let beatId of this._beatsOfVoice.get(voiceId)) {
                                        if (beatId !== GpifParser.InvalidId) {
                                            // important! we clone the beat because beats get reused
                                            // in gp6, our model needs to have unique beats.
                                            let beat = BeatCloner.clone(this._beatById.get(beatId));
                                            voice.addBeat(beat);
                                            let rhythmId = this._rhythmOfBeat.get(beatId);
                                            let rhythm = this._rhythmById.get(rhythmId);
                                            // set beat duration
                                            beat.duration = rhythm.value;
                                            beat.dots = rhythm.dots;
                                            beat.tupletNumerator = rhythm.tupletNumerator;
                                            beat.tupletDenominator = rhythm.tupletDenominator;
                                            // add notes to beat
                                            if (this._notesOfBeat.has(beatId)) {
                                                for (let noteId of this._notesOfBeat.get(beatId)) {
                                                    if (noteId !== GpifParser.InvalidId) {
                                                        const note = NoteCloner.clone(this._noteById.get(noteId));
                                                        // reset midi value for non-percussion staves
                                                        if (staff.isPercussion) {
                                                            note.fret = -1;
                                                            note.string = -1;
                                                        }
                                                        else {
                                                            note.percussionArticulation = -1;
                                                        }
                                                        beat.addNote(note);
                                                        if (this._tappedNotes.has(noteId)) {
                                                            beat.tap = true;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                // invalid voice -> empty voice
                                let voice = new Voice();
                                bar.addVoice(voice);
                                let beat = new Beat();
                                beat.isEmpty = true;
                                beat.duration = Duration.Quarter;
                                voice.addBeat(beat);
                            }
                        }
                    }
                    // stave is full? -> next track
                    if (staffIndex === track.staves.length - 1) {
                        trackIndex++;
                        staffIndex = 0;
                    }
                    else {
                        staffIndex++;
                    }
                }
                else {
                    // no bar for track
                    trackIndex++;
                }
            }
        }
        // clear out percussion articulations where not needed 
        // and add automations
        for (let trackId of this._tracksMapping) {
            if (!trackId) {
                continue;
            }
            let track = this._tracksById.get(trackId);
            let hasPercussion = false;
            for (const staff of track.staves) {
                if (staff.isPercussion) {
                    hasPercussion = true;
                    break;
                }
            }
            if (!hasPercussion) {
                track.percussionArticulations = [];
            }
            if (this._automationsPerTrackIdAndBarIndex.has(trackId)) {
                const trackAutomations = this._automationsPerTrackIdAndBarIndex.get(trackId);
                for (const [barNumber, automations] of trackAutomations) {
                    if (track.staves.length > 0 && barNumber < track.staves[0].bars.length) {
                        const bar = track.staves[0].bars[barNumber];
                        if (bar.voices.length > 0 && bar.voices[0].beats.length > 0) {
                            const beat = bar.voices[0].beats[0];
                            for (const a of automations) {
                                beat.automations.push(a);
                            }
                        }
                    }
                }
            }
        }
        // build masterbar automations
        for (const [barNumber, automations] of this._masterTrackAutomations) {
            let masterBar = this.score.masterBars[barNumber];
            for (let i = 0, j = automations.length; i < j; i++) {
                let automation = automations[i];
                if (automation.type === AutomationType.Tempo) {
                    if (barNumber === 0) {
                        this.score.tempo = automation.value | 0;
                        if (automation.text) {
                            this.score.tempoLabel = automation.text;
                        }
                    }
                    masterBar.tempoAutomation = automation;
                }
            }
        }
    }
}
GpifParser.InvalidId = '-1';
/**
 * GPX range: 0-100
 * Internal range: 0 - 60
 */
GpifParser.BendPointPositionFactor = BendPoint.MaxPosition / 100.0;
/**
 * GPIF: 25 per quarternote
 * Internal Range: 1 per quarter note
 */
GpifParser.BendPointValueFactor = 1 / 25.0;
//# sourceMappingURL=GpifParser.js.map