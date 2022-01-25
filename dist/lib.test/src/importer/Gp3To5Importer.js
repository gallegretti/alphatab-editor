import { GeneralMidi } from '@src/midi/GeneralMidi';
import { ScoreImporter } from '@src/importer/ScoreImporter';
import { UnsupportedFormatError } from '@src/importer/UnsupportedFormatError';
import { IOHelper } from '@src/io/IOHelper';
import { AccentuationType } from '@src/model/AccentuationType';
import { Automation, AutomationType } from '@src/model/Automation';
import { Bar } from '@src/model/Bar';
import { Beat } from '@src/model/Beat';
import { BendPoint } from '@src/model/BendPoint';
import { BrushType } from '@src/model/BrushType';
import { Chord } from '@src/model/Chord';
import { Clef } from '@src/model/Clef';
import { Color } from '@src/model/Color';
import { Duration } from '@src/model/Duration';
import { DynamicValue } from '@src/model/DynamicValue';
import { GraceType } from '@src/model/GraceType';
import { HarmonicType } from '@src/model/HarmonicType';
import { Lyrics } from '@src/model/Lyrics';
import { MasterBar } from '@src/model/MasterBar';
import { Note } from '@src/model/Note';
import { NoteAccidentalMode } from '@src/model/NoteAccidentalMode';
import { PickStroke } from '@src/model/PickStroke';
import { PlaybackInformation } from '@src/model/PlaybackInformation';
import { Score } from '@src/model/Score';
import { Section } from '@src/model/Section';
import { SlideInType } from '@src/model/SlideInType';
import { SlideOutType } from '@src/model/SlideOutType';
import { Track } from '@src/model/Track';
import { TripletFeel } from '@src/model/TripletFeel';
import { VibratoType } from '@src/model/VibratoType';
import { Voice } from '@src/model/Voice';
import { Logger } from '@src/Logger';
import { ModelUtils } from '@src/model/ModelUtils';
import { Tuning } from '@src/model/Tuning';
export class Gp3To5Importer extends ScoreImporter {
    constructor() {
        super();
        this._versionNumber = 0;
        this._globalTripletFeel = TripletFeel.NoTripletFeel;
        this._lyricsTrack = 0;
        this._lyrics = [];
        this._barCount = 0;
        this._trackCount = 0;
        this._playbackInfos = [];
        this._beatTextChunksByTrack = new Map();
    }
    get name() {
        return 'Guitar Pro 3-5';
    }
    readScore() {
        this.readVersion();
        this._score = new Score();
        // basic song info
        this.readScoreInformation();
        // triplet feel before Gp5
        if (this._versionNumber < 500) {
            this._globalTripletFeel = GpBinaryHelpers.gpReadBool(this.data)
                ? TripletFeel.Triplet8th
                : TripletFeel.NoTripletFeel;
        }
        // beat lyrics
        if (this._versionNumber >= 400) {
            this.readLyrics();
        }
        // rse master settings since GP5.1
        if (this._versionNumber >= 510) {
            // master volume (4)
            // master effect (4)
            // master equalizer (10)
            // master equalizer preset (1)
            this.data.skip(19);
        }
        // page setup since GP5
        if (this._versionNumber >= 500) {
            this.readPageSetup();
            this._score.tempoLabel = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
        // tempo stuff
        this._score.tempo = IOHelper.readInt32LE(this.data);
        if (this._versionNumber >= 510) {
            GpBinaryHelpers.gpReadBool(this.data); // hide tempo?
        }
        // keysignature and octave
        IOHelper.readInt32LE(this.data);
        if (this._versionNumber >= 400) {
            this.data.readByte();
        }
        this.readPlaybackInfos();
        // repetition stuff
        if (this._versionNumber >= 500) {
            // "Coda" bar index (2)
            // "Double Coda" bar index (2)
            // "Segno" bar index (2)
            // "Segno Segno" bar index (2)
            // "Fine" bar index (2)
            // "Da Capo" bar index (2)
            // "Da Capo al Coda" bar index (2)
            // "Da Capo al Double Coda" bar index (2)
            // "Da Capo al Fine" bar index (2)
            // "Da Segno" bar index (2)
            // "Da Segno al Coda" bar index (2)
            // "Da Segno al Double Coda" bar index (2)
            // "Da Segno al Fine "bar index (2)
            // "Da Segno Segno" bar index (2)
            // "Da Segno Segno al Coda" bar index (2)
            // "Da Segno Segno al Double Coda" bar index (2)
            // "Da Segno Segno al Fine" bar index (2)
            // "Da Coda" bar index (2)
            // "Da Double Coda" bar index (2)
            this.data.skip(38);
            // unknown (4)
            this.data.skip(4);
        }
        // contents
        this._barCount = IOHelper.readInt32LE(this.data);
        this._trackCount = IOHelper.readInt32LE(this.data);
        this.readMasterBars();
        this.readTracks();
        this.readBars();
        // To be more in line with the GP7 structure we create an
        // initial tempo automation on the first masterbar
        if (this._score.masterBars.length > 0) {
            this._score.masterBars[0].tempoAutomation = Automation.buildTempoAutomation(false, 0, this._score.tempo, 2);
            this._score.masterBars[0].tempoAutomation.text = this._score.tempoLabel;
        }
        this._score.finish(this.settings);
        if (this._lyrics && this._lyricsTrack >= 0) {
            this._score.tracks[this._lyricsTrack].applyLyrics(this._lyrics);
        }
        return this._score;
    }
    readVersion() {
        let version = GpBinaryHelpers.gpReadStringByteLength(this.data, 30, this.settings.importer.encoding);
        if (!version.startsWith(Gp3To5Importer.VersionString)) {
            throw new UnsupportedFormatError('Unsupported format');
        }
        version = version.substr(Gp3To5Importer.VersionString.length + 1);
        let dot = version.indexOf(String.fromCharCode(46));
        this._versionNumber = 100 * parseInt(version.substr(0, dot)) + parseInt(version.substr(dot + 1));
        Logger.debug(this.name, 'Guitar Pro version ' + version + ' detected');
    }
    readScoreInformation() {
        var _a;
        this._score.title = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.subTitle = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.artist = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.album = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.words = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.music =
            this._versionNumber >= 500
                ? GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding)
                : this._score.words;
        this._score.copyright = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.tab = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.instructions = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        let noticeLines = IOHelper.readInt32LE(this.data);
        let notice = '';
        for (let i = 0; i < noticeLines; i++) {
            if (i > 0) {
                notice += '\r\n';
            }
            notice += (_a = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding)) === null || _a === void 0 ? void 0 : _a.toString();
        }
        this._score.notices = notice;
    }
    readLyrics() {
        this._lyrics = [];
        this._lyricsTrack = IOHelper.readInt32LE(this.data) - 1;
        for (let i = 0; i < 5; i++) {
            let lyrics = new Lyrics();
            lyrics.startBar = IOHelper.readInt32LE(this.data) - 1;
            lyrics.text = GpBinaryHelpers.gpReadStringInt(this.data, this.settings.importer.encoding);
            this._lyrics.push(lyrics);
        }
    }
    readPageSetup() {
        // Page Width (4)
        // Page Heigth (4)
        // Padding Left (4)
        // Padding Right (4)
        // Padding Top (4)
        // Padding Bottom (4)
        // Size Proportion(4)
        // Header and Footer display flags (2)
        this.data.skip(30);
        // title format
        // subtitle format
        // artist format
        // album format
        // words format
        // music format
        // words and music format
        // copyright format
        // pagpublic enumber format
        for (let i = 0; i < 10; i++) {
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
    }
    readPlaybackInfos() {
        this._playbackInfos = [];
        for (let i = 0; i < 64; i++) {
            let info = new PlaybackInformation();
            info.primaryChannel = i;
            info.secondaryChannel = i;
            info.program = IOHelper.readInt32LE(this.data);
            info.volume = this.data.readByte();
            info.balance = this.data.readByte();
            this.data.skip(6);
            this._playbackInfos.push(info);
        }
    }
    readMasterBars() {
        for (let i = 0; i < this._barCount; i++) {
            this.readMasterBar();
        }
    }
    readMasterBar() {
        let previousMasterBar = null;
        if (this._score.masterBars.length > 0) {
            previousMasterBar = this._score.masterBars[this._score.masterBars.length - 1];
        }
        let newMasterBar = new MasterBar();
        let flags = this.data.readByte();
        // time signature
        if ((flags & 0x01) !== 0) {
            newMasterBar.timeSignatureNumerator = this.data.readByte();
        }
        else if (previousMasterBar) {
            newMasterBar.timeSignatureNumerator = previousMasterBar.timeSignatureNumerator;
        }
        if ((flags & 0x02) !== 0) {
            newMasterBar.timeSignatureDenominator = this.data.readByte();
        }
        else if (previousMasterBar) {
            newMasterBar.timeSignatureDenominator = previousMasterBar.timeSignatureDenominator;
        }
        // repeatings
        newMasterBar.isRepeatStart = (flags & 0x04) !== 0;
        if ((flags & 0x08) !== 0) {
            newMasterBar.repeatCount = this.data.readByte() + (this._versionNumber >= 500 ? 0 : 1);
        }
        // alternate endings
        if ((flags & 0x10) !== 0) {
            if (this._versionNumber < 500) {
                let currentMasterBar = previousMasterBar;
                // get the already existing alternatives to ignore them
                let existentAlternatives = 0;
                while (currentMasterBar) {
                    // found another repeat ending?
                    if (currentMasterBar.isRepeatEnd && currentMasterBar !== previousMasterBar) {
                        break;
                    }
                    // found the opening?
                    if (currentMasterBar.isRepeatStart) {
                        break;
                    }
                    existentAlternatives = existentAlternatives | currentMasterBar.alternateEndings;
                    currentMasterBar = currentMasterBar.previousMasterBar;
                }
                // now calculate the alternative for this bar
                let repeatAlternative = 0;
                let repeatMask = this.data.readByte();
                for (let i = 0; i < 8; i++) {
                    // only add the repeating if it is not existing
                    let repeating = 1 << i;
                    if (repeatMask > i && (existentAlternatives & repeating) === 0) {
                        repeatAlternative = repeatAlternative | repeating;
                    }
                }
                newMasterBar.alternateEndings = repeatAlternative;
            }
            else {
                newMasterBar.alternateEndings = this.data.readByte();
            }
        }
        // marker
        if ((flags & 0x20) !== 0) {
            let section = new Section();
            section.text = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
            section.marker = '';
            GpBinaryHelpers.gpReadColor(this.data, false);
            newMasterBar.section = section;
        }
        // keysignature
        if ((flags & 0x40) !== 0) {
            newMasterBar.keySignature = IOHelper.readSInt8(this.data);
            newMasterBar.keySignatureType = this.data.readByte();
        }
        else if (previousMasterBar) {
            newMasterBar.keySignature = previousMasterBar.keySignature;
            newMasterBar.keySignatureType = previousMasterBar.keySignatureType;
        }
        if (this._versionNumber >= 500 && (flags & 0x03) !== 0) {
            this.data.skip(4);
        }
        // better alternate ending mask in GP5
        if (this._versionNumber >= 500 && (flags & 0x10) === 0) {
            newMasterBar.alternateEndings = this.data.readByte();
        }
        // tripletfeel
        if (this._versionNumber >= 500) {
            let tripletFeel = this.data.readByte();
            switch (tripletFeel) {
                case 1:
                    newMasterBar.tripletFeel = TripletFeel.Triplet8th;
                    break;
                case 2:
                    newMasterBar.tripletFeel = TripletFeel.Triplet16th;
                    break;
            }
            this.data.readByte();
        }
        else {
            newMasterBar.tripletFeel = this._globalTripletFeel;
        }
        newMasterBar.isDoubleBar = (flags & 0x80) !== 0;
        this._score.addMasterBar(newMasterBar);
    }
    readTracks() {
        for (let i = 0; i < this._trackCount; i++) {
            this.readTrack();
        }
    }
    readTrack() {
        let newTrack = new Track();
        newTrack.ensureStaveCount(1);
        this._score.addTrack(newTrack);
        let mainStaff = newTrack.staves[0];
        let flags = this.data.readByte();
        newTrack.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 40, this.settings.importer.encoding);
        if ((flags & 0x01) !== 0) {
            mainStaff.isPercussion = true;
        }
        let stringCount = IOHelper.readInt32LE(this.data);
        let tuning = [];
        for (let i = 0; i < 7; i++) {
            let stringTuning = IOHelper.readInt32LE(this.data);
            if (stringCount > i) {
                tuning.push(stringTuning);
            }
        }
        mainStaff.stringTuning.tunings = tuning;
        let port = IOHelper.readInt32LE(this.data);
        let index = IOHelper.readInt32LE(this.data) - 1;
        let effectChannel = IOHelper.readInt32LE(this.data) - 1;
        this.data.skip(4); // Fretcount
        if (index >= 0 && index < this._playbackInfos.length) {
            let info = this._playbackInfos[index];
            info.port = port;
            info.isSolo = (flags & 0x10) !== 0;
            info.isMute = (flags & 0x20) !== 0;
            info.secondaryChannel = effectChannel;
            if (GeneralMidi.isGuitar(info.program)) {
                mainStaff.displayTranspositionPitch = -12;
            }
            newTrack.playbackInfo = info;
        }
        mainStaff.capo = IOHelper.readInt32LE(this.data);
        newTrack.color = GpBinaryHelpers.gpReadColor(this.data, false);
        if (this._versionNumber >= 500) {
            // flags for
            //  0x01 -> show tablature
            //  0x02 -> show standard notation
            this.data.readByte();
            // flags for
            //  0x02 -> auto let ring
            //  0x04 -> auto brush
            this.data.readByte();
            // unknown
            this.data.skip(43);
        }
        // unknown
        if (this._versionNumber >= 510) {
            this.data.skip(4);
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
    }
    readBars() {
        for (let i = 0; i < this._barCount; i++) {
            for (let t = 0; t < this._trackCount; t++) {
                this.readBar(this._score.tracks[t]);
            }
        }
    }
    readBar(track) {
        let newBar = new Bar();
        let mainStaff = track.staves[0];
        if (mainStaff.isPercussion) {
            newBar.clef = Clef.Neutral;
        }
        mainStaff.addBar(newBar);
        let voiceCount = 1;
        if (this._versionNumber >= 500) {
            this.data.readByte();
            voiceCount = 2;
        }
        for (let v = 0; v < voiceCount; v++) {
            this.readVoice(track, newBar);
        }
    }
    readVoice(track, bar) {
        let beatCount = IOHelper.readInt32LE(this.data);
        if (beatCount === 0) {
            return;
        }
        let newVoice = new Voice();
        bar.addVoice(newVoice);
        for (let i = 0; i < beatCount; i++) {
            this.readBeat(track, bar, newVoice);
        }
    }
    readBeat(track, bar, voice) {
        let newBeat = new Beat();
        let flags = this.data.readByte();
        if ((flags & 0x01) !== 0) {
            newBeat.dots = 1;
        }
        if ((flags & 0x40) !== 0) {
            let type = this.data.readByte();
            newBeat.isEmpty = (type & 0x02) === 0;
        }
        voice.addBeat(newBeat);
        let duration = IOHelper.readSInt8(this.data);
        switch (duration) {
            case -2:
                newBeat.duration = Duration.Whole;
                break;
            case -1:
                newBeat.duration = Duration.Half;
                break;
            case 0:
                newBeat.duration = Duration.Quarter;
                break;
            case 1:
                newBeat.duration = Duration.Eighth;
                break;
            case 2:
                newBeat.duration = Duration.Sixteenth;
                break;
            case 3:
                newBeat.duration = Duration.ThirtySecond;
                break;
            case 4:
                newBeat.duration = Duration.SixtyFourth;
                break;
            default:
                newBeat.duration = Duration.Quarter;
                break;
        }
        if ((flags & 0x20) !== 0) {
            newBeat.tupletNumerator = IOHelper.readInt32LE(this.data);
            switch (newBeat.tupletNumerator) {
                case 1:
                    newBeat.tupletDenominator = 1;
                    break;
                case 3:
                    newBeat.tupletDenominator = 2;
                    break;
                case 5:
                case 6:
                case 7:
                    newBeat.tupletDenominator = 4;
                    break;
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    newBeat.tupletDenominator = 8;
                    break;
                case 2:
                case 4:
                case 8:
                    break;
                default:
                    newBeat.tupletNumerator = 1;
                    newBeat.tupletDenominator = 1;
                    break;
            }
        }
        if ((flags & 0x02) !== 0) {
            this.readChord(newBeat);
        }
        let beatTextAsLyrics = this.settings.importer.beatTextAsLyrics
            && track.index !== this._lyricsTrack; // detect if not lyrics track
        if ((flags & 0x04) !== 0) {
            const text = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
            if (beatTextAsLyrics) {
                const lyrics = new Lyrics();
                lyrics.text = text.trim();
                lyrics.finish(true);
                // push them in reverse order to the store for applying them 
                // to the next beats being read 
                const beatLyrics = [];
                for (let i = lyrics.chunks.length - 1; i >= 0; i--) {
                    beatLyrics.push(lyrics.chunks[i]);
                }
                this._beatTextChunksByTrack.set(track.index, beatLyrics);
            }
            else {
                newBeat.text = text;
            }
        }
        let allNoteHarmonicType = HarmonicType.None;
        if ((flags & 0x08) !== 0) {
            allNoteHarmonicType = this.readBeatEffects(newBeat);
        }
        if ((flags & 0x10) !== 0) {
            this.readMixTableChange(newBeat);
        }
        let stringFlags = this.data.readByte();
        for (let i = 6; i >= 0; i--) {
            if ((stringFlags & (1 << i)) !== 0 && 6 - i < bar.staff.tuning.length) {
                const note = this.readNote(track, bar, voice, newBeat, 6 - i);
                if (allNoteHarmonicType !== HarmonicType.None) {
                    note.harmonicType = allNoteHarmonicType;
                    if (note.harmonicType === HarmonicType.Natural) {
                        note.harmonicValue = this.deltaFretToHarmonicValue(note.fret);
                    }
                }
            }
        }
        if (this._versionNumber >= 500) {
            this.data.readByte();
            let flag = this.data.readByte();
            if ((flag & 0x08) !== 0) {
                this.data.readByte();
            }
        }
        if (beatTextAsLyrics && !newBeat.isRest &&
            this._beatTextChunksByTrack.has(track.index) &&
            this._beatTextChunksByTrack.get(track.index).length > 0) {
            newBeat.lyrics = [this._beatTextChunksByTrack.get(track.index).pop()];
        }
    }
    readChord(beat) {
        let chord = new Chord();
        let chordId = ModelUtils.newGuid();
        if (this._versionNumber >= 500) {
            this.data.skip(17);
            chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 21, this.settings.importer.encoding);
            this.data.skip(4);
            chord.firstFret = IOHelper.readInt32LE(this.data);
            for (let i = 0; i < 7; i++) {
                let fret = IOHelper.readInt32LE(this.data);
                if (i < beat.voice.bar.staff.tuning.length) {
                    chord.strings.push(fret);
                }
            }
            let numberOfBarres = this.data.readByte();
            let barreFrets = new Uint8Array(5);
            this.data.read(barreFrets, 0, barreFrets.length);
            for (let i = 0; i < numberOfBarres; i++) {
                chord.barreFrets.push(barreFrets[i]);
            }
            this.data.skip(26);
        }
        else {
            if (this.data.readByte() !== 0) {
                // gp4
                if (this._versionNumber >= 400) {
                    // Sharp (1)
                    // Unused (3)
                    // Root (1)
                    // Major/Minor (1)
                    // Nin,Eleven or Thirteen (1)
                    // Bass (4)
                    // Diminished/Augmented (4)
                    // Add (1)
                    this.data.skip(16);
                    chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 21, this.settings.importer.encoding);
                    // Unused (2)
                    // Fifth (1)
                    // Ninth (1)
                    // Eleventh (1)
                    this.data.skip(4);
                    chord.firstFret = IOHelper.readInt32LE(this.data);
                    for (let i = 0; i < 7; i++) {
                        let fret = IOHelper.readInt32LE(this.data);
                        if (i < beat.voice.bar.staff.tuning.length) {
                            chord.strings.push(fret);
                        }
                    }
                    let numberOfBarres = this.data.readByte();
                    let barreFrets = new Uint8Array(5);
                    this.data.read(barreFrets, 0, barreFrets.length);
                    for (let i = 0; i < numberOfBarres; i++) {
                        chord.barreFrets.push(barreFrets[i]);
                    }
                    // Barree end (5)
                    // Omission1,3,5,7,9,11,13 (7)
                    // Unused (1)
                    // Fingering (7)
                    // Show Diagram Fingering (1)
                    // ??
                    this.data.skip(26);
                }
                else {
                    // unknown
                    this.data.skip(25);
                    chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 34, this.settings.importer.encoding);
                    chord.firstFret = IOHelper.readInt32LE(this.data);
                    for (let i = 0; i < 6; i++) {
                        let fret = IOHelper.readInt32LE(this.data);
                        if (i < beat.voice.bar.staff.tuning.length) {
                            chord.strings.push(fret);
                        }
                    }
                    // unknown
                    this.data.skip(36);
                }
            }
            else {
                let strings = this._versionNumber >= 406 ? 7 : 6;
                chord.name = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
                chord.firstFret = IOHelper.readInt32LE(this.data);
                if (chord.firstFret > 0) {
                    for (let i = 0; i < strings; i++) {
                        let fret = IOHelper.readInt32LE(this.data);
                        if (i < beat.voice.bar.staff.tuning.length) {
                            chord.strings.push(fret);
                        }
                    }
                }
            }
        }
        if (chord.name) {
            beat.chordId = chordId;
            beat.voice.bar.staff.addChord(beat.chordId, chord);
        }
    }
    readBeatEffects(beat) {
        let flags = this.data.readByte();
        let flags2 = 0;
        if (this._versionNumber >= 400) {
            flags2 = this.data.readByte();
        }
        beat.fadeIn = (flags & 0x10) !== 0;
        if ((this._versionNumber < 400 && (flags & 0x01) !== 0) || (flags & 0x02) !== 0) {
            beat.vibrato = VibratoType.Slight;
        }
        beat.hasRasgueado = (flags2 & 0x01) !== 0;
        if ((flags & 0x20) !== 0 && this._versionNumber >= 400) {
            let slapPop = IOHelper.readSInt8(this.data);
            switch (slapPop) {
                case 1:
                    beat.tap = true;
                    break;
                case 2:
                    beat.slap = true;
                    break;
                case 3:
                    beat.pop = true;
                    break;
            }
        }
        else if ((flags & 0x20) !== 0) {
            let slapPop = IOHelper.readSInt8(this.data);
            switch (slapPop) {
                case 1:
                    beat.tap = true;
                    break;
                case 2:
                    beat.slap = true;
                    break;
                case 3:
                    beat.pop = true;
                    break;
            }
            this.data.skip(4);
        }
        if ((flags2 & 0x04) !== 0) {
            this.readTremoloBarEffect(beat);
        }
        if ((flags & 0x40) !== 0) {
            let strokeUp = 0;
            let strokeDown = 0;
            if (this._versionNumber < 500) {
                strokeDown = this.data.readByte();
                strokeUp = this.data.readByte();
            }
            else {
                strokeUp = this.data.readByte();
                strokeDown = this.data.readByte();
            }
            if (strokeUp > 0) {
                beat.brushType = BrushType.BrushUp;
                beat.brushDuration = Gp3To5Importer.toStrokeValue(strokeUp);
            }
            else if (strokeDown > 0) {
                beat.brushType = BrushType.BrushDown;
                beat.brushDuration = Gp3To5Importer.toStrokeValue(strokeDown);
            }
        }
        if ((flags2 & 0x02) !== 0) {
            switch (IOHelper.readSInt8(this.data)) {
                case 0:
                    beat.pickStroke = PickStroke.None;
                    break;
                case 1:
                    beat.pickStroke = PickStroke.Up;
                    break;
                case 2:
                    beat.pickStroke = PickStroke.Down;
                    break;
            }
        }
        if (this._versionNumber < 400) {
            if ((flags & 0x04) !== 0) {
                return HarmonicType.Natural;
            }
            else if ((flags & 0x08) !== 0) {
                return HarmonicType.Artificial;
            }
        }
        return HarmonicType.None;
    }
    readTremoloBarEffect(beat) {
        this.data.readByte(); // type
        IOHelper.readInt32LE(this.data); // value
        let pointCount = IOHelper.readInt32LE(this.data);
        if (pointCount > 0) {
            for (let i = 0; i < pointCount; i++) {
                let point = new BendPoint(0, 0);
                point.offset = IOHelper.readInt32LE(this.data); // 0...60
                point.value = (IOHelper.readInt32LE(this.data) / Gp3To5Importer.BendStep) | 0; // 0..12 (amount of quarters)
                GpBinaryHelpers.gpReadBool(this.data); // vibrato
                beat.addWhammyBarPoint(point);
            }
        }
    }
    static toStrokeValue(value) {
        switch (value) {
            case 1:
                return 30;
            case 2:
                return 30;
            case 3:
                return 60;
            case 4:
                return 120;
            case 5:
                return 240;
            case 6:
                return 480;
            default:
                return 0;
        }
    }
    readMixTableChange(beat) {
        let tableChange = new MixTableChange();
        tableChange.instrument = IOHelper.readSInt8(this.data);
        if (this._versionNumber >= 500) {
            this.data.skip(16); // Rse Info
        }
        tableChange.volume = IOHelper.readSInt8(this.data);
        tableChange.balance = IOHelper.readSInt8(this.data);
        let chorus = IOHelper.readSInt8(this.data);
        let reverb = IOHelper.readSInt8(this.data);
        let phaser = IOHelper.readSInt8(this.data);
        let tremolo = IOHelper.readSInt8(this.data);
        if (this._versionNumber >= 500) {
            tableChange.tempoName = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
        tableChange.tempo = IOHelper.readInt32LE(this.data);
        // durations
        if (tableChange.volume >= 0) {
            this.data.readByte();
        }
        if (tableChange.balance >= 0) {
            this.data.readByte();
        }
        if (chorus >= 0) {
            this.data.readByte();
        }
        if (reverb >= 0) {
            this.data.readByte();
        }
        if (phaser >= 0) {
            this.data.readByte();
        }
        if (tremolo >= 0) {
            this.data.readByte();
        }
        if (tableChange.tempo >= 0) {
            tableChange.duration = IOHelper.readSInt8(this.data);
            if (this._versionNumber >= 510) {
                this.data.readByte(); // hideTempo (bool)
            }
        }
        if (this._versionNumber >= 400) {
            this.data.readByte(); // all tracks flag
        }
        // unknown
        if (this._versionNumber >= 500) {
            this.data.readByte();
        }
        // unknown
        if (this._versionNumber >= 510) {
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
        if (tableChange.volume >= 0) {
            let volumeAutomation = new Automation();
            volumeAutomation.isLinear = true;
            volumeAutomation.type = AutomationType.Volume;
            volumeAutomation.value = tableChange.volume;
            beat.automations.push(volumeAutomation);
        }
        if (tableChange.balance >= 0) {
            let balanceAutomation = new Automation();
            balanceAutomation.isLinear = true;
            balanceAutomation.type = AutomationType.Balance;
            balanceAutomation.value = tableChange.balance;
            beat.automations.push(balanceAutomation);
        }
        if (tableChange.instrument >= 0) {
            let instrumentAutomation = new Automation();
            instrumentAutomation.isLinear = true;
            instrumentAutomation.type = AutomationType.Instrument;
            instrumentAutomation.value = tableChange.instrument;
            beat.automations.push(instrumentAutomation);
        }
        if (tableChange.tempo >= 0) {
            let tempoAutomation = new Automation();
            tempoAutomation.isLinear = true;
            tempoAutomation.type = AutomationType.Tempo;
            tempoAutomation.value = tableChange.tempo;
            beat.automations.push(tempoAutomation);
            beat.voice.bar.masterBar.tempoAutomation = tempoAutomation;
        }
    }
    readNote(track, bar, voice, beat, stringIndex) {
        let newNote = new Note();
        newNote.string = bar.staff.tuning.length - stringIndex;
        let flags = this.data.readByte();
        if ((flags & 0x02) !== 0) {
            newNote.accentuated = AccentuationType.Heavy;
        }
        else if ((flags & 0x40) !== 0) {
            newNote.accentuated = AccentuationType.Normal;
        }
        newNote.isGhost = (flags & 0x04) !== 0;
        if ((flags & 0x20) !== 0) {
            let noteType = this.data.readByte();
            if (noteType === 3) {
                newNote.isDead = true;
            }
            else if (noteType === 2) {
                newNote.isTieDestination = true;
            }
        }
        if ((flags & 0x01) !== 0 && this._versionNumber < 500) {
            this.data.readByte(); // duration
            this.data.readByte(); // tuplet
        }
        if ((flags & 0x10) !== 0) {
            let dynamicNumber = IOHelper.readSInt8(this.data);
            newNote.dynamics = this.toDynamicValue(dynamicNumber);
            beat.dynamics = newNote.dynamics;
        }
        if ((flags & 0x20) !== 0) {
            newNote.fret = IOHelper.readSInt8(this.data);
        }
        if ((flags & 0x80) !== 0) {
            newNote.leftHandFinger = IOHelper.readSInt8(this.data);
            newNote.rightHandFinger = IOHelper.readSInt8(this.data);
            newNote.isFingering = true;
        }
        let swapAccidentals = false;
        if (this._versionNumber >= 500) {
            if ((flags & 0x01) !== 0) {
                newNote.durationPercent = GpBinaryHelpers.gpReadDouble(this.data);
            }
            let flags2 = this.data.readByte();
            swapAccidentals = (flags2 & 0x02) !== 0;
        }
        beat.addNote(newNote);
        if ((flags & 0x08) !== 0) {
            this.readNoteEffects(track, voice, beat, newNote);
        }
        if (bar.staff.isPercussion) {
            newNote.percussionArticulation = newNote.fret;
            newNote.string = -1;
            newNote.fret = -1;
        }
        if (swapAccidentals) {
            const accidental = Tuning.defaultAccidentals[newNote.realValueWithoutHarmonic % 12];
            if (accidental === '#') {
                newNote.accidentalMode = NoteAccidentalMode.ForceFlat;
            }
            else if (accidental === 'b') {
                newNote.accidentalMode = NoteAccidentalMode.ForceSharp;
            }
            // Note: forcing no sign to sharp not supported
        }
        return newNote;
    }
    toDynamicValue(value) {
        switch (value) {
            case 1:
                return DynamicValue.PPP;
            case 2:
                return DynamicValue.PP;
            case 3:
                return DynamicValue.P;
            case 4:
                return DynamicValue.MP;
            case 5:
                return DynamicValue.MF;
            case 6:
                return DynamicValue.F;
            case 7:
                return DynamicValue.FF;
            case 8:
                return DynamicValue.FFF;
            default:
                return DynamicValue.F;
        }
    }
    readNoteEffects(track, voice, beat, note) {
        let flags = this.data.readByte();
        let flags2 = 0;
        if (this._versionNumber >= 400) {
            flags2 = this.data.readByte();
        }
        if ((flags & 0x01) !== 0) {
            this.readBend(note);
        }
        if ((flags & 0x10) !== 0) {
            this.readGrace(voice, note);
        }
        if ((flags2 & 0x04) !== 0) {
            this.readTremoloPicking(beat);
        }
        if ((flags2 & 0x08) !== 0) {
            this.readSlide(note);
        }
        else if (this._versionNumber < 400) {
            if ((flags & 0x04) !== 0) {
                note.slideOutType = SlideOutType.Shift;
            }
        }
        if ((flags2 & 0x10) !== 0) {
            this.readArtificialHarmonic(note);
        }
        if ((flags2 & 0x20) !== 0) {
            this.readTrill(note);
        }
        note.isLetRing = (flags & 0x08) !== 0;
        note.isHammerPullOrigin = (flags & 0x02) !== 0;
        if ((flags2 & 0x40) !== 0) {
            note.vibrato = VibratoType.Slight;
        }
        note.isPalmMute = (flags2 & 0x02) !== 0;
        note.isStaccato = (flags2 & 0x01) !== 0;
    }
    readBend(note) {
        this.data.readByte(); // type
        IOHelper.readInt32LE(this.data); // value
        let pointCount = IOHelper.readInt32LE(this.data);
        if (pointCount > 0) {
            for (let i = 0; i < pointCount; i++) {
                let point = new BendPoint(0, 0);
                point.offset = IOHelper.readInt32LE(this.data); // 0...60
                point.value = (IOHelper.readInt32LE(this.data) / Gp3To5Importer.BendStep) | 0; // 0..12 (amount of quarters)
                GpBinaryHelpers.gpReadBool(this.data); // vibrato
                note.addBendPoint(point);
            }
        }
    }
    readGrace(voice, note) {
        let graceBeat = new Beat();
        let graceNote = new Note();
        graceNote.string = note.string;
        graceNote.fret = IOHelper.readSInt8(this.data);
        graceBeat.duration = Duration.ThirtySecond;
        graceBeat.dynamics = this.toDynamicValue(IOHelper.readSInt8(this.data));
        let transition = IOHelper.readSInt8(this.data);
        switch (transition) {
            case 0:
                break;
            case 1:
                graceNote.slideOutType = SlideOutType.Legato;
                graceNote.slideTarget = note;
                break;
            case 2:
                break;
            case 3:
                graceNote.isHammerPullOrigin = true;
                break;
        }
        graceNote.dynamics = graceBeat.dynamics;
        this.data.skip(1); // duration
        if (this._versionNumber < 500) {
            graceBeat.graceType = GraceType.BeforeBeat;
        }
        else {
            let flags = this.data.readByte();
            graceNote.isDead = (flags & 0x01) !== 0;
            graceBeat.graceType = (flags & 0x02) !== 0 ? GraceType.OnBeat : GraceType.BeforeBeat;
        }
        voice.addGraceBeat(graceBeat);
        graceBeat.addNote(graceNote);
    }
    readTremoloPicking(beat) {
        let speed = this.data.readByte();
        switch (speed) {
            case 1:
                beat.tremoloSpeed = Duration.Eighth;
                break;
            case 2:
                beat.tremoloSpeed = Duration.Sixteenth;
                break;
            case 3:
                beat.tremoloSpeed = Duration.ThirtySecond;
                break;
        }
    }
    readSlide(note) {
        if (this._versionNumber >= 500) {
            let type = IOHelper.readSInt8(this.data);
            if ((type & 1) !== 0) {
                note.slideOutType = SlideOutType.Shift;
            }
            else if ((type & 2) !== 0) {
                note.slideOutType = SlideOutType.Legato;
            }
            else if ((type & 4) !== 0) {
                note.slideOutType = SlideOutType.OutDown;
            }
            else if ((type & 8) !== 0) {
                note.slideOutType = SlideOutType.OutUp;
            }
            if ((type & 16) !== 0) {
                note.slideInType = SlideInType.IntoFromBelow;
            }
            else if ((type & 32) !== 0) {
                note.slideInType = SlideInType.IntoFromAbove;
            }
        }
        else {
            let type = IOHelper.readSInt8(this.data);
            switch (type) {
                case 1:
                    note.slideOutType = SlideOutType.Shift;
                    break;
                case 2:
                    note.slideOutType = SlideOutType.Legato;
                    break;
                case 3:
                    note.slideOutType = SlideOutType.OutDown;
                    break;
                case 4:
                    note.slideOutType = SlideOutType.OutUp;
                    break;
                case -1:
                    note.slideInType = SlideInType.IntoFromBelow;
                    break;
                case -2:
                    note.slideInType = SlideInType.IntoFromAbove;
                    break;
            }
        }
    }
    readArtificialHarmonic(note) {
        let type = this.data.readByte();
        if (this._versionNumber >= 500) {
            switch (type) {
                case 1:
                    note.harmonicType = HarmonicType.Natural;
                    note.harmonicValue = this.deltaFretToHarmonicValue(note.fret);
                    break;
                case 2:
                    /*let _harmonicTone: number = */ this.data.readByte();
                    /*let _harmonicKey: number =  */ this.data.readByte();
                    /*let _harmonicOctaveOffset: number = */ this.data.readByte();
                    note.harmonicType = HarmonicType.Artificial;
                    break;
                case 3:
                    note.harmonicType = HarmonicType.Tap;
                    note.harmonicValue = this.deltaFretToHarmonicValue(this.data.readByte());
                    break;
                case 4:
                    note.harmonicType = HarmonicType.Pinch;
                    note.harmonicValue = 12;
                    break;
                case 5:
                    note.harmonicType = HarmonicType.Semi;
                    note.harmonicValue = 12;
                    break;
            }
        }
        else if (this._versionNumber >= 400) {
            switch (type) {
                case 1:
                    note.harmonicType = HarmonicType.Natural;
                    break;
                case 3:
                    note.harmonicType = HarmonicType.Tap;
                    break;
                case 4:
                    note.harmonicType = HarmonicType.Pinch;
                    break;
                case 5:
                    note.harmonicType = HarmonicType.Semi;
                    break;
                case 15:
                    note.harmonicType = HarmonicType.Artificial;
                    break;
                case 17:
                    note.harmonicType = HarmonicType.Artificial;
                    break;
                case 22:
                    note.harmonicType = HarmonicType.Artificial;
                    break;
            }
        }
    }
    deltaFretToHarmonicValue(deltaFret) {
        switch (deltaFret) {
            case 2:
                return 2.4;
            case 3:
                return 3.2;
            case 4:
            case 5:
            case 7:
            case 9:
            case 12:
            case 16:
            case 17:
            case 19:
            case 24:
                return deltaFret;
            case 8:
                return 8.2;
            case 10:
                return 9.6;
            case 14:
            case 15:
                return 14.7;
            case 21:
            case 22:
                return 21.7;
            default:
                return 12;
        }
    }
    readTrill(note) {
        note.trillValue = this.data.readByte() + note.stringTuning;
        switch (this.data.readByte()) {
            case 1:
                note.trillSpeed = Duration.Sixteenth;
                break;
            case 2:
                note.trillSpeed = Duration.ThirtySecond;
                break;
            case 3:
                note.trillSpeed = Duration.SixtyFourth;
                break;
        }
    }
}
Gp3To5Importer.VersionString = 'FICHIER GUITAR PRO ';
Gp3To5Importer.BendStep = 25;
export class GpBinaryHelpers {
    static gpReadDouble(data) {
        let bytes = new Uint8Array(8);
        data.read(bytes, 0, bytes.length);
        let array = new Float64Array(bytes.buffer);
        return array[0];
    }
    static gpReadFloat(data) {
        let bytes = new Uint8Array(4);
        bytes[3] = data.readByte();
        bytes[2] = data.readByte();
        bytes[2] = data.readByte();
        bytes[1] = data.readByte();
        let array = new Float32Array(bytes.buffer);
        return array[0];
    }
    static gpReadColor(data, readAlpha = false) {
        let r = data.readByte();
        let g = data.readByte();
        let b = data.readByte();
        let a = 255;
        if (readAlpha) {
            a = data.readByte();
        }
        else {
            data.skip(1);
        }
        return new Color(r, g, b, a);
    }
    static gpReadBool(data) {
        return data.readByte() !== 0;
    }
    /**
     * Skips an integer (4byte) and reads a string using
     * a bytesize
     */
    static gpReadStringIntUnused(data, encoding) {
        data.skip(4);
        return GpBinaryHelpers.gpReadString(data, data.readByte(), encoding);
    }
    /**
     * Reads an integer as size, and then the string itself
     */
    static gpReadStringInt(data, encoding) {
        return GpBinaryHelpers.gpReadString(data, IOHelper.readInt32LE(data), encoding);
    }
    /**
     * Reads an integer as size, skips a byte and reads the string itself
     */
    static gpReadStringIntByte(data, encoding) {
        let length = IOHelper.readInt32LE(data) - 1;
        data.readByte();
        return GpBinaryHelpers.gpReadString(data, length, encoding);
    }
    static gpReadString(data, length, encoding) {
        let b = new Uint8Array(length);
        data.read(b, 0, b.length);
        return IOHelper.toString(b, encoding);
    }
    static gpWriteString(data, s) {
        const encoded = IOHelper.stringToBytes(s);
        data.writeByte(s.length);
        data.write(encoded, 0, encoded.length);
    }
    /**
     * Reads a byte as size and the string itself.
     * Additionally it is ensured the specified amount of bytes is read.
     * @param data the data to read from.
     * @param length the amount of bytes to read
     * @param encoding The encoding to use to decode the byte into a string
     * @returns
     */
    static gpReadStringByteLength(data, length, encoding) {
        let stringLength = data.readByte();
        let s = GpBinaryHelpers.gpReadString(data, stringLength, encoding);
        if (stringLength < length) {
            data.skip(length - stringLength);
        }
        return s;
    }
}
/**
 * A mixtablechange describes several track changes.
 */
class MixTableChange {
    constructor() {
        this.volume = -1;
        this.balance = -1;
        this.instrument = -1;
        this.tempoName = '';
        this.tempo = -1;
        this.duration = -1;
    }
}
//# sourceMappingURL=Gp3To5Importer.js.map