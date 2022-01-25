import { BeatTickLookup } from '@src/midi/BeatTickLookup';
import { ControllerType } from '@src/midi/ControllerType';
import { MidiPlaybackController } from '@src/midi/MidiPlaybackController';
import { MasterBarTickLookup } from '@src/midi/MasterBarTickLookup';
import { MidiTickLookup } from '@src/midi/MidiTickLookup';
import { MidiUtils } from '@src/midi/MidiUtils';
import { AccentuationType } from '@src/model/AccentuationType';
import { AutomationType } from '@src/model/Automation';
import { BendPoint } from '@src/model/BendPoint';
import { BendStyle } from '@src/model/BendStyle';
import { BendType } from '@src/model/BendType';
import { BrushType } from '@src/model/BrushType';
import { Duration } from '@src/model/Duration';
import { GraceType } from '@src/model/GraceType';
import { SimileMark } from '@src/model/SimileMark';
import { SlideInType } from '@src/model/SlideInType';
import { SlideOutType } from '@src/model/SlideOutType';
import { TripletFeel } from '@src/model/TripletFeel';
import { VibratoType } from '@src/model/VibratoType';
import { WhammyType } from '@src/model/WhammyType';
import { NotationMode } from '@src/NotationSettings';
import { Settings } from '@src/Settings';
import { Logger } from '@src/Logger';
import { SynthConstants } from '@src/synth/SynthConstants';
import { PercussionMapper } from '@src/model/PercussionMapper';
export class MidiNoteDuration {
    constructor() {
        this.noteOnly = 0;
        this.untilTieOrSlideEnd = 0;
        this.letRingEnd = 0;
    }
}
class TripletFeelDurations {
    constructor() {
        this.firstBeatDuration = 0;
        this.secondBeatStartOffset = 0;
        this.secondBeatDuration = 0;
    }
}
/**
 * This generator creates a midi file using a score.
 */
export class MidiFileGenerator {
    /**
     * Initializes a new instance of the {@link MidiFileGenerator} class.
     * @param score The score for which the midi file should be generated.
     * @param settings The settings ot use for generation.
     * @param handler The handler that should be used for generating midi events.
     */
    constructor(score, settings, handler) {
        this._currentTempo = 0;
        this._currentBarRepeatLookup = null;
        this._programsPerChannel = new Map();
        /**
         * Gets a lookup object which can be used to quickly find beats and bars
         * at a given midi tick position.
         */
        this.tickLookup = new MidiTickLookup();
        this._currentTripletFeel = null;
        this._score = score;
        this._settings = !settings ? new Settings() : settings;
        this._currentTempo = this._score.tempo;
        this._handler = handler;
    }
    /**
     * Starts the generation of the midi file.
     */
    generate() {
        // initialize tracks
        for (const track of this._score.tracks) {
            this.generateTrack(track);
        }
        Logger.debug('Midi', 'Begin midi generation');
        const controller = new MidiPlaybackController(this._score);
        let previousMasterBar = null;
        // store the previous played bar for repeats
        while (!controller.finished) {
            const index = controller.index;
            const bar = this._score.masterBars[index];
            const currentTick = controller.currentTick;
            controller.processCurrent();
            if (controller.shouldPlay) {
                this.generateMasterBar(bar, previousMasterBar, currentTick);
                for (const track of this._score.tracks) {
                    for (const staff of track.staves) {
                        if (index < staff.bars.length) {
                            this.generateBar(staff.bars[index], currentTick);
                        }
                    }
                }
            }
            controller.moveNext();
            previousMasterBar = bar;
        }
        for (const track of this._score.tracks) {
            this._handler.finishTrack(track.index, controller.currentTick);
        }
        this.tickLookup.finish();
        Logger.debug('Midi', 'Midi generation done');
    }
    generateTrack(track) {
        // channel
        this.generateChannel(track, track.playbackInfo.primaryChannel, track.playbackInfo);
        if (track.playbackInfo.primaryChannel !== track.playbackInfo.secondaryChannel) {
            this.generateChannel(track, track.playbackInfo.secondaryChannel, track.playbackInfo);
        }
    }
    addProgramChange(track, tick, channel, program) {
        if (!this._programsPerChannel.has(channel) || this._programsPerChannel.get(channel) !== program) {
            this._handler.addProgramChange(track.index, tick, channel, program);
            this._programsPerChannel.set(channel, program);
        }
    }
    generateChannel(track, channel, playbackInfo) {
        let volume = MidiFileGenerator.toChannelShort(playbackInfo.volume);
        let balance = MidiFileGenerator.toChannelShort(playbackInfo.balance);
        this._handler.addControlChange(track.index, 0, channel, ControllerType.VolumeCoarse, volume);
        this._handler.addControlChange(track.index, 0, channel, ControllerType.PanCoarse, balance);
        this._handler.addControlChange(track.index, 0, channel, ControllerType.ExpressionControllerCoarse, 127);
        // set parameter that is being updated (0) -> PitchBendRangeCoarse
        this._handler.addControlChange(track.index, 0, channel, ControllerType.RegisteredParameterFine, 0);
        this._handler.addControlChange(track.index, 0, channel, ControllerType.RegisteredParameterCourse, 0);
        // Set PitchBendRangeCoarse to 12
        this._handler.addControlChange(track.index, 0, channel, ControllerType.DataEntryFine, 0);
        this._handler.addControlChange(track.index, 0, channel, ControllerType.DataEntryCoarse, MidiFileGenerator.PitchBendRangeInSemitones);
        this.addProgramChange(track, 0, channel, playbackInfo.program);
    }
    static toChannelShort(data) {
        const value = Math.max(-32768, Math.min(32767, data * 8 - 1));
        return Math.max(value, -1) + 1;
    }
    generateMasterBar(masterBar, previousMasterBar, currentTick) {
        // time signature
        if (!previousMasterBar ||
            previousMasterBar.timeSignatureDenominator !== masterBar.timeSignatureDenominator ||
            previousMasterBar.timeSignatureNumerator !== masterBar.timeSignatureNumerator) {
            this._handler.addTimeSignature(currentTick, masterBar.timeSignatureNumerator, masterBar.timeSignatureDenominator);
        }
        // tempo
        if (!previousMasterBar) {
            this._handler.addTempo(currentTick, masterBar.score.tempo);
            this._currentTempo = masterBar.score.tempo;
        }
        else if (masterBar.tempoAutomation) {
            this._handler.addTempo(currentTick, masterBar.tempoAutomation.value);
            this._currentTempo = masterBar.tempoAutomation.value;
        }
        const masterBarLookup = new MasterBarTickLookup();
        masterBarLookup.masterBar = masterBar;
        masterBarLookup.start = currentTick;
        masterBarLookup.tempo = this._currentTempo;
        masterBarLookup.end = masterBarLookup.start + masterBar.calculateDuration();
        this.tickLookup.addMasterBar(masterBarLookup);
    }
    generateBar(bar, barStartTick) {
        let playbackBar = this.getPlaybackBar(bar);
        this._currentBarRepeatLookup = null;
        for (const v of playbackBar.voices) {
            this.generateVoice(v, barStartTick, bar);
        }
    }
    getPlaybackBar(bar) {
        switch (bar.simileMark) {
            case SimileMark.Simple:
                if (bar.previousBar) {
                    bar = this.getPlaybackBar(bar.previousBar);
                }
                break;
            case SimileMark.FirstOfDouble:
                if (bar.previousBar && bar.previousBar.previousBar) {
                    bar = this.getPlaybackBar(bar.previousBar.previousBar);
                }
                break;
            case SimileMark.SecondOfDouble:
                if (bar.previousBar && bar.previousBar.previousBar) {
                    bar = this.getPlaybackBar(bar.previousBar.previousBar);
                }
                break;
        }
        return bar;
    }
    generateVoice(voice, barStartTick, realBar) {
        if (voice.isEmpty && (!voice.bar.isEmpty || voice.index !== 0)) {
            return;
        }
        for (const b of voice.beats) {
            this.generateBeat(b, barStartTick, realBar);
        }
    }
    generateBeat(beat, barStartTick, realBar) {
        let beatStart = beat.playbackStart;
        let audioDuration = beat.playbackDuration;
        if (beat.voice.bar.isEmpty) {
            audioDuration = beat.voice.bar.masterBar.calculateDuration();
        }
        else if (beat.voice.bar.masterBar.tripletFeel !== TripletFeel.NoTripletFeel &&
            this._settings.player.playTripletFeel) {
            if (this._currentTripletFeel) {
                beatStart -= this._currentTripletFeel.secondBeatStartOffset;
                audioDuration = this._currentTripletFeel.secondBeatDuration;
                this._currentTripletFeel = null;
            }
            else {
                this._currentTripletFeel = MidiFileGenerator.calculateTripletFeelInfo(beatStart, audioDuration, beat);
                if (this._currentTripletFeel) {
                    audioDuration = this._currentTripletFeel.firstBeatDuration;
                }
            }
        }
        const beatLookup = new BeatTickLookup();
        beatLookup.start = barStartTick + beatStart;
        const realTickOffset = !beat.nextBeat
            ? audioDuration
            : beat.nextBeat.absolutePlaybackStart - beat.absolutePlaybackStart;
        beatLookup.end = barStartTick + beatStart;
        beatLookup.highlightBeat(beat);
        beatLookup.end += realTickOffset > audioDuration ? realTickOffset : audioDuration;
        // in case of normal playback register playback
        if (realBar === beat.voice.bar) {
            beatLookup.beat = beat;
            this.tickLookup.addBeat(beatLookup);
        }
        else {
            beatLookup.isEmptyBar = true;
            beatLookup.beat = realBar.voices[0].beats[0];
            if (!this._currentBarRepeatLookup) {
                this._currentBarRepeatLookup = beatLookup;
                this.tickLookup.addBeat(this._currentBarRepeatLookup);
            }
            else {
                this._currentBarRepeatLookup.end = beatLookup.end;
            }
        }
        const track = beat.voice.bar.staff.track;
        for (const automation of beat.automations) {
            this.generateAutomation(beat, automation, barStartTick);
        }
        if (beat.isRest) {
            this._handler.addRest(track.index, barStartTick + beatStart, track.playbackInfo.primaryChannel);
        }
        else {
            let brushInfo = this.getBrushInfo(beat);
            for (const n of beat.notes) {
                this.generateNote(n, barStartTick + beatStart, audioDuration, brushInfo);
            }
        }
        if (beat.vibrato !== VibratoType.None) {
            let phaseLength = 240;
            let bendAmplitude = 3;
            switch (beat.vibrato) {
                case VibratoType.Slight:
                    phaseLength = this._settings.player.vibrato.beatSlightLength;
                    bendAmplitude = this._settings.player.vibrato.beatSlightAmplitude;
                    break;
                case VibratoType.Wide:
                    phaseLength = this._settings.player.vibrato.beatWideLength;
                    bendAmplitude = this._settings.player.vibrato.beatWideAmplitude;
                    break;
            }
            this.generateVibratorWithParams(barStartTick + beatStart, beat.playbackDuration, phaseLength, bendAmplitude, (tick, value) => {
                this._handler.addBend(beat.voice.bar.staff.track.index, tick, track.playbackInfo.secondaryChannel, value);
            });
        }
    }
    static calculateTripletFeelInfo(beatStart, audioDuration, beat) {
        let initialDuration;
        switch (beat.voice.bar.masterBar.tripletFeel) {
            case TripletFeel.Triplet8th:
            case TripletFeel.Dotted8th:
            case TripletFeel.Scottish8th:
                initialDuration = Duration.Eighth;
                break;
            case TripletFeel.Triplet16th:
            case TripletFeel.Dotted16th:
            case TripletFeel.Scottish16th:
                initialDuration = Duration.Sixteenth;
                break;
            default:
                // not possible
                return null;
        }
        const interval = MidiUtils.toTicks(initialDuration);
        // it must be a plain note with the expected duration
        // without dots, triplets, grace notes etc.
        if (audioDuration !== interval) {
            return null;
        }
        // check if the beat is aligned in respect to the duration
        // e.g. the eighth notes on a 4/4 time signature must start exactly on the following
        // times to get a triplet feel applied
        // 0 480 960 1440 1920 2400 2880 3360
        if (beatStart % interval !== 0) {
            return null;
        }
        // ensure next beat matches spec
        if (!beat.nextBeat || beat.nextBeat.voice !== beat.voice || beat.playbackDuration !== interval) {
            return null;
        }
        // looks like we have a triplet feel combination start here!
        const durations = new TripletFeelDurations();
        switch (beat.voice.bar.masterBar.tripletFeel) {
            case TripletFeel.Triplet8th:
                durations.firstBeatDuration = MidiUtils.applyTuplet(MidiUtils.toTicks(Duration.Quarter), 3, 2);
                durations.secondBeatDuration = MidiUtils.applyTuplet(MidiUtils.toTicks(Duration.Eighth), 3, 2);
                break;
            case TripletFeel.Dotted8th:
                durations.firstBeatDuration = MidiUtils.applyDot(MidiUtils.toTicks(Duration.Eighth), false);
                durations.secondBeatDuration = MidiUtils.toTicks(Duration.Sixteenth);
                break;
            case TripletFeel.Scottish8th:
                durations.firstBeatDuration = MidiUtils.toTicks(Duration.Sixteenth);
                durations.secondBeatDuration = MidiUtils.applyDot(MidiUtils.toTicks(Duration.Eighth), false);
                break;
            case TripletFeel.Triplet16th:
                durations.firstBeatDuration = MidiUtils.applyTuplet(MidiUtils.toTicks(Duration.Eighth), 3, 2);
                durations.secondBeatDuration = MidiUtils.applyTuplet(MidiUtils.toTicks(Duration.Sixteenth), 3, 2);
                break;
            case TripletFeel.Dotted16th:
                durations.firstBeatDuration = MidiUtils.applyDot(MidiUtils.toTicks(Duration.Sixteenth), false);
                durations.secondBeatDuration = MidiUtils.toTicks(Duration.ThirtySecond);
                break;
            case TripletFeel.Scottish16th:
                durations.firstBeatDuration = MidiUtils.toTicks(Duration.ThirtySecond);
                durations.secondBeatDuration = MidiUtils.applyDot(MidiUtils.toTicks(Duration.Sixteenth), false);
                break;
        }
        // calculate the number of ticks the second beat can start earlier
        durations.secondBeatStartOffset = audioDuration - durations.firstBeatDuration;
        return durations;
    }
    generateNote(note, beatStart, beatDuration, brushInfo) {
        const track = note.beat.voice.bar.staff.track;
        const staff = note.beat.voice.bar.staff;
        let noteKey = note.realValue;
        if (note.isPercussion) {
            const articulation = PercussionMapper.getArticulation(note);
            if (articulation) {
                noteKey = articulation.outputMidiNumber;
            }
        }
        const brushOffset = note.isStringed && note.string <= brushInfo.length ? brushInfo[note.string - 1] : 0;
        const noteStart = beatStart + brushOffset;
        const noteDuration = this.getNoteDuration(note, beatDuration);
        noteDuration.untilTieOrSlideEnd -= brushOffset;
        noteDuration.noteOnly -= brushOffset;
        noteDuration.letRingEnd -= brushOffset;
        const dynamicValue = MidiFileGenerator.getDynamicValue(note);
        const channel = note.hasBend || note.beat.hasWhammyBar || note.beat.vibrato !== VibratoType.None
            ? track.playbackInfo.secondaryChannel
            : track.playbackInfo.primaryChannel;
        let initialBend = 0;
        if (note.hasBend) {
            initialBend = MidiFileGenerator.getPitchWheel(note.bendPoints[0].value);
        }
        else if (note.beat.hasWhammyBar) {
            initialBend = MidiFileGenerator.getPitchWheel(note.beat.whammyBarPoints[0].value);
        }
        else if (note.isTieDestination ||
            (note.slideOrigin && note.slideOrigin.slideOutType === SlideOutType.Legato)) {
            initialBend = -1;
        }
        else {
            initialBend = MidiFileGenerator.getPitchWheel(0);
        }
        if (initialBend >= 0) {
            this._handler.addNoteBend(track.index, noteStart, channel, noteKey, initialBend);
        }
        //
        // Fade in
        if (note.beat.fadeIn) {
            this.generateFadeIn(note, noteStart, noteDuration);
        }
        //
        // Trill
        if (note.isTrill && !staff.isPercussion) {
            this.generateTrill(note, noteStart, noteDuration, noteKey, dynamicValue, channel);
            // no further generation needed
            return;
        }
        //
        // Tremolo Picking
        if (note.beat.isTremolo) {
            this.generateTremoloPicking(note, noteStart, noteDuration, noteKey, dynamicValue, channel);
            // no further generation needed
            return;
        }
        //
        // All String Bending/Variation effects
        if (note.hasBend) {
            this.generateBend(note, noteStart, noteDuration, noteKey, channel);
        }
        else if (note.beat.hasWhammyBar && note.index === 0) {
            this.generateWhammy(note.beat, noteStart, noteDuration, channel);
        }
        else if (note.slideInType !== SlideInType.None || note.slideOutType !== SlideOutType.None) {
            this.generateSlide(note, noteStart, noteDuration, noteKey, dynamicValue, channel);
        }
        else if (note.vibrato !== VibratoType.None) {
            this.generateVibrato(note, noteStart, noteDuration, noteKey, channel);
        }
        // for tied notes, and target notes of legato slides we do not pick the note
        // the previous one is extended
        if (!note.isTieDestination && (!note.slideOrigin || note.slideOrigin.slideOutType !== SlideOutType.Legato)) {
            let noteSoundDuration = Math.max(noteDuration.untilTieOrSlideEnd, noteDuration.letRingEnd);
            this._handler.addNote(track.index, noteStart, noteSoundDuration, noteKey, dynamicValue, channel);
        }
    }
    getNoteDuration(note, duration) {
        const durationWithEffects = new MidiNoteDuration();
        durationWithEffects.noteOnly = duration;
        durationWithEffects.untilTieOrSlideEnd = duration;
        durationWithEffects.letRingEnd = duration;
        if (note.isDead) {
            durationWithEffects.noteOnly = this.applyStaticDuration(MidiFileGenerator.DefaultDurationDead, duration);
            durationWithEffects.untilTieOrSlideEnd = durationWithEffects.noteOnly;
            durationWithEffects.letRingEnd = durationWithEffects.noteOnly;
            return durationWithEffects;
        }
        if (note.isPalmMute) {
            durationWithEffects.noteOnly = this.applyStaticDuration(MidiFileGenerator.DefaultDurationPalmMute, duration);
            durationWithEffects.untilTieOrSlideEnd = durationWithEffects.noteOnly;
            durationWithEffects.letRingEnd = durationWithEffects.noteOnly;
            return durationWithEffects;
        }
        if (note.isStaccato) {
            durationWithEffects.noteOnly = (duration / 2) | 0;
            durationWithEffects.untilTieOrSlideEnd = durationWithEffects.noteOnly;
            durationWithEffects.letRingEnd = durationWithEffects.noteOnly;
            return durationWithEffects;
        }
        if (note.isTieOrigin) {
            const endNote = note.tieDestination;
            // for the initial start of the tie calculate absolute duration from start to end note
            if (endNote) {
                if (!note.isTieDestination) {
                    const startTick = note.beat.absolutePlaybackStart;
                    const tieDestinationDuration = this.getNoteDuration(endNote, endNote.beat.playbackDuration);
                    const endTick = endNote.beat.absolutePlaybackStart + tieDestinationDuration.untilTieOrSlideEnd;
                    durationWithEffects.untilTieOrSlideEnd = endTick - startTick;
                }
                else {
                    // for continuing ties, take the current duration + the one from the destination
                    // this branch will be entered as part of the recusion of the if branch
                    const tieDestinationDuration = this.getNoteDuration(endNote, endNote.beat.playbackDuration);
                    durationWithEffects.untilTieOrSlideEnd = duration + tieDestinationDuration.untilTieOrSlideEnd;
                }
            }
        }
        else if (note.slideOutType === SlideOutType.Legato) {
            const endNote = note.slideTarget;
            if (endNote) {
                const startTick = note.beat.absolutePlaybackStart;
                const slideTargetDuration = this.getNoteDuration(endNote, endNote.beat.playbackDuration);
                const endTick = endNote.beat.absolutePlaybackStart + slideTargetDuration.untilTieOrSlideEnd;
                durationWithEffects.untilTieOrSlideEnd = endTick - startTick;
            }
        }
        if (note.isLetRing && this._settings.notation.notationMode === NotationMode.GuitarPro) {
            // LetRing ends when:
            // - rest
            let lastLetRingBeat = note.beat;
            let letRingEnd = 0;
            const maxDuration = note.beat.voice.bar.masterBar.calculateDuration();
            while (lastLetRingBeat.nextBeat) {
                let next = lastLetRingBeat.nextBeat;
                if (next.isRest) {
                    break;
                }
                // note on the same string
                if (note.isStringed && next.hasNoteOnString(note.string)) {
                    break;
                }
                lastLetRingBeat = lastLetRingBeat.nextBeat;
                letRingEnd =
                    lastLetRingBeat.absolutePlaybackStart -
                        note.beat.absolutePlaybackStart +
                        lastLetRingBeat.playbackDuration;
                if (letRingEnd > maxDuration) {
                    letRingEnd = maxDuration;
                    break;
                }
            }
            if (lastLetRingBeat === note.beat) {
                durationWithEffects.letRingEnd = duration;
            }
            else {
                durationWithEffects.letRingEnd = letRingEnd;
            }
        }
        else {
            durationWithEffects.letRingEnd = durationWithEffects.untilTieOrSlideEnd;
        }
        return durationWithEffects;
    }
    applyStaticDuration(duration, maximum) {
        const value = ((this._currentTempo * duration) / BendPoint.MaxPosition) | 0;
        return Math.min(value, maximum);
    }
    static getDynamicValue(note) {
        let dynamicValue = note.dynamics;
        // more silent on hammer destination
        if (!note.beat.voice.bar.staff.isPercussion && note.hammerPullOrigin) {
            dynamicValue--;
        }
        // more silent on ghost notes
        if (note.isGhost) {
            dynamicValue--;
        }
        // louder on accent
        switch (note.accentuated) {
            case AccentuationType.Normal:
                dynamicValue++;
                break;
            case AccentuationType.Heavy:
                dynamicValue += 2;
                break;
        }
        if (dynamicValue < 0) {
            dynamicValue = 0;
        }
        return dynamicValue;
    }
    generateFadeIn(note, noteStart, noteDuration) {
        const track = note.beat.voice.bar.staff.track;
        const endVolume = MidiFileGenerator.toChannelShort(track.playbackInfo.volume);
        const volumeFactor = endVolume / noteDuration.noteOnly;
        const tickStep = 120;
        const steps = (noteDuration.noteOnly / tickStep) | 0;
        const endTick = noteStart + noteDuration.noteOnly;
        for (let i = steps - 1; i >= 0; i--) {
            const tick = endTick - i * tickStep;
            const volume = (tick - noteStart) * volumeFactor;
            if (i === steps - 1) {
                this._handler.addControlChange(track.index, noteStart, track.playbackInfo.primaryChannel, ControllerType.VolumeCoarse, volume);
                this._handler.addControlChange(track.index, noteStart, track.playbackInfo.secondaryChannel, ControllerType.VolumeCoarse, volume);
            }
            this._handler.addControlChange(track.index, tick, track.playbackInfo.primaryChannel, ControllerType.VolumeCoarse, volume);
            this._handler.addControlChange(track.index, tick, track.playbackInfo.secondaryChannel, ControllerType.VolumeCoarse, volume);
        }
    }
    generateVibrato(note, noteStart, noteDuration, noteKey, channel) {
        let phaseLength = 0;
        let bendAmplitude = 0;
        switch (note.vibrato) {
            case VibratoType.Slight:
                phaseLength = this._settings.player.vibrato.noteSlightLength;
                bendAmplitude = this._settings.player.vibrato.noteSlightAmplitude;
                break;
            case VibratoType.Wide:
                phaseLength = this._settings.player.vibrato.noteWideLength;
                bendAmplitude = this._settings.player.vibrato.noteWideAmplitude;
                break;
            default:
                return;
        }
        const track = note.beat.voice.bar.staff.track;
        this.generateVibratorWithParams(noteStart, noteDuration.noteOnly, phaseLength, bendAmplitude, (tick, value) => {
            this._handler.addNoteBend(track.index, tick, channel, noteKey, value);
        });
    }
    generateVibratorWithParams(noteStart, noteDuration, phaseLength, bendAmplitude, addBend) {
        const resolution = 16;
        const phaseHalf = (phaseLength / 2) | 0;
        // 1st Phase stays at bend 0,
        // then we have a sine wave with the given amplitude and phase length
        noteStart += phaseLength;
        const noteEnd = noteStart + noteDuration;
        while (noteStart < noteEnd) {
            let phase = 0;
            const phaseDuration = noteStart + phaseLength < noteEnd ? phaseLength : noteEnd - noteStart;
            while (phase < phaseDuration) {
                let bend = bendAmplitude * Math.sin((phase * Math.PI) / phaseHalf);
                addBend((noteStart + phase) | 0, MidiFileGenerator.getPitchWheel(bend));
                phase += resolution;
            }
            noteStart += phaseLength;
        }
    }
    /**
     * Calculates the midi pitch wheel value for the give bend value.
     */
    static getPitchWheel(bendValue) {
        // bend values are 1/4 notes therefore we only take half a semitone value per bend value
        return SynthConstants.DefaultPitchWheel + (bendValue / 2) * MidiFileGenerator.PitchValuePerSemitone;
    }
    generateSlide(note, noteStart, noteDuration, noteKey, dynamicValue, channel) {
        let duration = note.slideOutType === SlideOutType.Legato ? noteDuration.noteOnly : noteDuration.untilTieOrSlideEnd;
        let playedBendPoints = [];
        let track = note.beat.voice.bar.staff.track;
        const simpleSlidePitchOffset = this._settings.player.slide.simpleSlidePitchOffset;
        const simpleSlideDurationOffset = Math.floor(BendPoint.MaxPosition * this._settings.player.slide.simpleSlideDurationRatio);
        const shiftSlideDurationOffset = Math.floor(BendPoint.MaxPosition * this._settings.player.slide.shiftSlideDurationRatio);
        // Shift Slide: Play note, move up to target note, play end note
        // Legato Slide: Play note, move up to target note, no pick on end note, just keep it ringing
        // 2 bend points: one on 0/0, dy/MaxPos.
        // Slide into from above/below: Play note on lower pitch, slide into it quickly at start
        // Slide out above/blow: Play note on normal pitch, slide out quickly at end
        switch (note.slideInType) {
            case SlideInType.IntoFromAbove:
                playedBendPoints.push(new BendPoint(0, simpleSlidePitchOffset));
                playedBendPoints.push(new BendPoint(simpleSlideDurationOffset, 0));
                break;
            case SlideInType.IntoFromBelow:
                playedBendPoints.push(new BendPoint(0, -simpleSlidePitchOffset));
                playedBendPoints.push(new BendPoint(simpleSlideDurationOffset, 0));
                break;
        }
        switch (note.slideOutType) {
            case SlideOutType.Legato:
            case SlideOutType.Shift:
                playedBendPoints.push(new BendPoint(shiftSlideDurationOffset, 0));
                // normal note values are in 1/2 tones, bends are in 1/4 tones
                const dy = (note.slideTarget.realValue - note.realValue) * 2;
                playedBendPoints.push(new BendPoint(BendPoint.MaxPosition, dy));
                break;
            case SlideOutType.OutDown:
                playedBendPoints.push(new BendPoint(BendPoint.MaxPosition - simpleSlideDurationOffset, 0));
                playedBendPoints.push(new BendPoint(BendPoint.MaxPosition, -simpleSlidePitchOffset));
                break;
            case SlideOutType.OutUp:
                playedBendPoints.push(new BendPoint(BendPoint.MaxPosition - simpleSlideDurationOffset, 0));
                playedBendPoints.push(new BendPoint(BendPoint.MaxPosition, simpleSlidePitchOffset));
                break;
        }
        this.generateWhammyOrBend(noteStart, duration, playedBendPoints, (tick, value) => {
            this._handler.addNoteBend(track.index, tick, channel, noteKey, value);
        });
    }
    generateBend(note, noteStart, noteDuration, noteKey, channel) {
        let bendPoints = note.bendPoints;
        let track = note.beat.voice.bar.staff.track;
        const addBend = (tick, value) => {
            this._handler.addNoteBend(track.index, tick, channel, noteKey, value);
        };
        // if bend is extended on next tied note, we directly bend to the final bend value
        let finalBendValue = null;
        // Bends are spread across all tied notes unless they have a bend on their own.
        let duration;
        if (note.isTieOrigin && this._settings.notation.extendBendArrowsOnTiedNotes) {
            let endNote = note;
            while (endNote.isTieOrigin && !endNote.tieDestination.hasBend) {
                endNote = endNote.tieDestination;
            }
            duration =
                endNote.beat.absolutePlaybackStart -
                    note.beat.absolutePlaybackStart +
                    this.getNoteDuration(endNote, endNote.beat.playbackDuration).noteOnly;
        }
        else if (note.isTieOrigin && note.beat.graceType !== GraceType.None) {
            switch (note.tieDestination.bendType) {
                case BendType.Bend:
                case BendType.BendRelease:
                case BendType.PrebendBend:
                    finalBendValue = note.tieDestination.bendPoints[1].value;
                    break;
                case BendType.Prebend:
                case BendType.PrebendRelease:
                    finalBendValue = note.tieDestination.bendPoints[0].value;
                    break;
            }
            duration = Math.max(noteDuration.noteOnly, MidiUtils.millisToTicks(this._settings.player.songBookBendDuration, this._currentTempo));
        }
        else {
            duration = noteDuration.noteOnly;
        }
        // ensure prebends are slightly before the actual note.
        if (bendPoints[0].value > 0 && !note.isContinuedBend && noteStart > 0) {
            noteStart--;
        }
        const bendDuration = Math.min(duration, MidiUtils.millisToTicks(this._settings.player.songBookBendDuration, this._currentTempo));
        let playedBendPoints = [];
        switch (note.bendType) {
            case BendType.Custom:
                playedBendPoints = bendPoints;
                break;
            case BendType.Bend:
            case BendType.Release:
                switch (note.bendStyle) {
                    case BendStyle.Default:
                        playedBendPoints = bendPoints;
                        break;
                    case BendStyle.Gradual:
                        playedBendPoints.push(new BendPoint(0, note.bendPoints[0].value));
                        if (!finalBendValue || finalBendValue < note.bendPoints[1].value) {
                            finalBendValue = note.bendPoints[1].value;
                        }
                        playedBendPoints.push(new BendPoint(BendPoint.MaxPosition, finalBendValue));
                        break;
                    case BendStyle.Fast:
                        if (!finalBendValue || finalBendValue < note.bendPoints[1].value) {
                            finalBendValue = note.bendPoints[1].value;
                        }
                        if (note.beat.graceType === GraceType.BendGrace) {
                            this.generateSongBookWhammyOrBend(noteStart, duration, true, [note.bendPoints[0].value, finalBendValue], bendDuration, addBend);
                        }
                        else {
                            this.generateSongBookWhammyOrBend(noteStart, duration, false, [note.bendPoints[0].value, finalBendValue], bendDuration, addBend);
                        }
                        return;
                }
                break;
            case BendType.BendRelease:
                switch (note.bendStyle) {
                    case BendStyle.Default:
                        playedBendPoints = bendPoints;
                        break;
                    case BendStyle.Gradual:
                        playedBendPoints.push(new BendPoint(0, note.bendPoints[0].value));
                        playedBendPoints.push(new BendPoint((BendPoint.MaxPosition / 2) | 0, note.bendPoints[1].value));
                        playedBendPoints.push(new BendPoint(BendPoint.MaxPosition, note.bendPoints[2].value));
                        break;
                    case BendStyle.Fast:
                        this.generateSongBookWhammyOrBend(noteStart, duration, false, [note.bendPoints[0].value, note.bendPoints[1].value, note.bendPoints[2].value], bendDuration, addBend);
                        return;
                }
                break;
            case BendType.Hold:
                playedBendPoints = bendPoints;
                break;
            case BendType.Prebend:
                playedBendPoints = bendPoints;
                break;
            case BendType.PrebendBend:
                switch (note.bendStyle) {
                    case BendStyle.Default:
                        playedBendPoints = bendPoints;
                        break;
                    case BendStyle.Gradual:
                        playedBendPoints.push(new BendPoint(0, note.bendPoints[0].value));
                        playedBendPoints.push(new BendPoint(BendPoint.MaxPosition, note.bendPoints[1].value));
                        break;
                    case BendStyle.Fast:
                        const preBendValue = MidiFileGenerator.getPitchWheel(note.bendPoints[0].value);
                        addBend(noteStart, preBendValue | 0);
                        if (!finalBendValue || finalBendValue < note.bendPoints[1].value) {
                            finalBendValue = note.bendPoints[1].value;
                        }
                        this.generateSongBookWhammyOrBend(noteStart, duration, false, [note.bendPoints[0].value, finalBendValue], bendDuration, addBend);
                        return;
                }
                break;
            case BendType.PrebendRelease:
                switch (note.bendStyle) {
                    case BendStyle.Default:
                        playedBendPoints = bendPoints;
                        break;
                    case BendStyle.Gradual:
                        playedBendPoints.push(new BendPoint(0, note.bendPoints[0].value));
                        playedBendPoints.push(new BendPoint(BendPoint.MaxPosition, note.bendPoints[1].value));
                        break;
                    case BendStyle.Fast:
                        const preBendValue = MidiFileGenerator.getPitchWheel(note.bendPoints[0].value);
                        addBend(noteStart, preBendValue | 0);
                        this.generateSongBookWhammyOrBend(noteStart, duration, false, [note.bendPoints[0].value, note.bendPoints[1].value], bendDuration, addBend);
                        return;
                }
                break;
        }
        this.generateWhammyOrBend(noteStart, duration, playedBendPoints, addBend);
    }
    generateSongBookWhammyOrBend(noteStart, duration, bendAtBeginning, bendValues, bendDuration, addBend) {
        const startTick = bendAtBeginning ? noteStart : noteStart + duration - bendDuration;
        const ticksBetweenPoints = bendDuration / (bendValues.length - 1);
        for (let i = 0; i < bendValues.length - 1; i++) {
            const currentBendValue = MidiFileGenerator.getPitchWheel(bendValues[i]);
            const nextBendValue = MidiFileGenerator.getPitchWheel(bendValues[i + 1]);
            const tick = startTick + ticksBetweenPoints * i;
            this.generateBendValues(tick, ticksBetweenPoints, currentBendValue, nextBendValue, addBend);
        }
    }
    generateWhammy(beat, noteStart, noteDuration, channel) {
        const bendPoints = beat.whammyBarPoints;
        const track = beat.voice.bar.staff.track;
        const duration = noteDuration.noteOnly;
        // ensure prebends are slightly before the actual note.
        if (bendPoints[0].value > 0 && !beat.isContinuedWhammy) {
            noteStart--;
        }
        const addBend = (tick, value) => {
            this._handler.addBend(track.index, tick, channel, value);
        };
        let playedBendPoints = [];
        switch (beat.whammyBarType) {
            case WhammyType.Custom:
                playedBendPoints = bendPoints;
                break;
            case WhammyType.Dive:
                switch (beat.whammyStyle) {
                    case BendStyle.Default:
                        playedBendPoints = bendPoints;
                        break;
                    case BendStyle.Gradual:
                        playedBendPoints.push(new BendPoint(0, bendPoints[0].value));
                        playedBendPoints.push(new BendPoint(BendPoint.MaxPosition, bendPoints[1].value));
                        break;
                    case BendStyle.Fast:
                        const whammyDuration = Math.min(duration, MidiUtils.millisToTicks(this._settings.player.songBookBendDuration, this._currentTempo));
                        this.generateSongBookWhammyOrBend(noteStart, duration, false, [bendPoints[0].value, bendPoints[1].value], whammyDuration, addBend);
                        return;
                }
                break;
            case WhammyType.Dip:
                switch (beat.whammyStyle) {
                    case BendStyle.Default:
                        playedBendPoints = bendPoints;
                        break;
                    case BendStyle.Gradual:
                        playedBendPoints.push(new BendPoint(0, bendPoints[0].value));
                        playedBendPoints.push(new BendPoint((BendPoint.MaxPosition / 2) | 0, bendPoints[1].value));
                        playedBendPoints.push(new BendPoint(BendPoint.MaxPosition, bendPoints[2].value));
                        break;
                    case BendStyle.Fast:
                        const whammyDuration = Math.min(duration, MidiUtils.millisToTicks(this._settings.player.songBookDipDuration, this._currentTempo));
                        this.generateSongBookWhammyOrBend(noteStart, duration, true, [bendPoints[0].value, bendPoints[1].value, bendPoints[2].value], whammyDuration, addBend);
                        return;
                }
                break;
            case WhammyType.Hold:
                playedBendPoints = bendPoints;
                break;
            case WhammyType.Predive:
                playedBendPoints = bendPoints;
                break;
            case WhammyType.PrediveDive:
                switch (beat.whammyStyle) {
                    case BendStyle.Default:
                        playedBendPoints = bendPoints;
                        break;
                    case BendStyle.Gradual:
                        playedBendPoints.push(new BendPoint(0, bendPoints[0].value));
                        playedBendPoints.push(new BendPoint((BendPoint.MaxPosition / 2) | 0, bendPoints[0].value));
                        playedBendPoints.push(new BendPoint(BendPoint.MaxPosition, bendPoints[1].value));
                        break;
                    case BendStyle.Fast:
                        const preDiveValue = MidiFileGenerator.getPitchWheel(bendPoints[0].value);
                        this._handler.addBend(track.index, noteStart, channel, preDiveValue | 0);
                        const whammyDuration = Math.min(duration, MidiUtils.millisToTicks(this._settings.player.songBookBendDuration, this._currentTempo));
                        this.generateSongBookWhammyOrBend(noteStart, duration, false, [bendPoints[0].value, bendPoints[1].value], whammyDuration, addBend);
                        return;
                }
                break;
        }
        this.generateWhammyOrBend(noteStart, duration, playedBendPoints, addBend);
    }
    generateWhammyOrBend(noteStart, duration, playedBendPoints, addBend) {
        const ticksPerPosition = duration / BendPoint.MaxPosition;
        for (let i = 0; i < playedBendPoints.length - 1; i++) {
            const currentPoint = playedBendPoints[i];
            const nextPoint = playedBendPoints[i + 1];
            // calculate the midi pitchbend values start and end values
            const currentBendValue = MidiFileGenerator.getPitchWheel(currentPoint.value);
            const nextBendValue = MidiFileGenerator.getPitchWheel(nextPoint.value);
            // how many midi ticks do we have to spend between this point and the next one?
            const ticksBetweenPoints = ticksPerPosition * (nextPoint.offset - currentPoint.offset);
            // we will generate one pitchbend message for each value
            // for this we need to calculate how many ticks to offset per value
            const tick = noteStart + ticksPerPosition * currentPoint.offset;
            this.generateBendValues(tick, ticksBetweenPoints, currentBendValue, nextBendValue, addBend);
        }
    }
    generateBendValues(currentTick, ticksBetweenPoints, currentBendValue, nextBendValue, addBend) {
        const millisBetweenPoints = MidiUtils.ticksToMillis(ticksBetweenPoints, this._currentTempo);
        const numberOfSemitones = Math.abs(nextBendValue - currentBendValue) / MidiFileGenerator.PitchValuePerSemitone;
        const numberOfSteps = Math.max(MidiFileGenerator.MinBreakpointsPerSemitone * numberOfSemitones, millisBetweenPoints / MidiFileGenerator.MillisecondsPerBreakpoint);
        const ticksPerBreakpoint = ticksBetweenPoints / numberOfSteps;
        const pitchPerBreakpoint = (nextBendValue - currentBendValue) / numberOfSteps;
        for (let i = 0; i < numberOfSteps; i++) {
            addBend(currentTick | 0, Math.round(currentBendValue));
            currentBendValue += pitchPerBreakpoint;
            currentTick += ticksPerBreakpoint;
        }
        // final bend value if needed
        if (currentBendValue < nextBendValue) {
            addBend(currentTick | 0, nextBendValue);
        }
    }
    generateTrill(note, noteStart, noteDuration, noteKey, dynamicValue, channel) {
        const track = note.beat.voice.bar.staff.track;
        const trillKey = note.stringTuning + note.trillFret;
        let trillLength = MidiUtils.toTicks(note.trillSpeed);
        let realKey = true;
        let tick = noteStart;
        let end = noteStart + noteDuration.untilTieOrSlideEnd;
        while (tick + 10 < end) {
            // only the rest on last trill play
            if (tick + trillLength >= end) {
                trillLength = end - tick;
            }
            this._handler.addNote(track.index, tick, trillLength, realKey ? trillKey : noteKey, dynamicValue, channel);
            realKey = !realKey;
            tick += trillLength;
        }
    }
    generateTremoloPicking(note, noteStart, noteDuration, noteKey, dynamicValue, channel) {
        const track = note.beat.voice.bar.staff.track;
        let tpLength = MidiUtils.toTicks(note.beat.tremoloSpeed);
        let tick = noteStart;
        const end = noteStart + noteDuration.untilTieOrSlideEnd;
        while (tick + 10 < end) {
            // only the rest on last trill play
            if (tick + tpLength >= end) {
                tpLength = end - tick;
            }
            this._handler.addNote(track.index, tick, tpLength, noteKey, dynamicValue, channel);
            tick += tpLength;
        }
    }
    getBrushInfo(beat) {
        const brushInfo = new Int32Array(beat.voice.bar.staff.tuning.length);
        if (beat.brushType !== BrushType.None) {
            //
            // calculate the number of
            // a mask where the single bits indicate the strings used
            let stringUsed = 0;
            let stringCount = 0;
            for (const n of beat.notes) {
                if (n.isTieDestination) {
                    continue;
                }
                stringUsed |= 0x01 << (n.string - 1);
                stringCount++;
            }
            //
            // calculate time offset for all strings
            if (beat.notes.length > 0) {
                let brushMove = 0;
                const brushIncrement = (beat.brushDuration / (stringCount - 1)) | 0;
                for (let i = 0; i < beat.voice.bar.staff.tuning.length; i++) {
                    let index = beat.brushType === BrushType.ArpeggioDown || beat.brushType === BrushType.BrushDown
                        ? i
                        : brushInfo.length - 1 - i;
                    if ((stringUsed & (0x01 << index)) !== 0) {
                        brushInfo[index] = brushMove;
                        brushMove += brushIncrement;
                    }
                }
            }
        }
        return brushInfo;
    }
    generateAutomation(beat, automation, startMove) {
        switch (automation.type) {
            case AutomationType.Instrument:
                this.addProgramChange(beat.voice.bar.staff.track, beat.playbackStart + startMove, beat.voice.bar.staff.track.playbackInfo.primaryChannel, (automation.value | 0) & 0xff);
                this.addProgramChange(beat.voice.bar.staff.track, beat.playbackStart + startMove, beat.voice.bar.staff.track.playbackInfo.secondaryChannel, (automation.value | 0) & 0xff);
                break;
            case AutomationType.Balance:
                let balance = MidiFileGenerator.toChannelShort(automation.value);
                this._handler.addControlChange(beat.voice.bar.staff.track.index, beat.playbackStart + startMove, beat.voice.bar.staff.track.playbackInfo.primaryChannel, ControllerType.PanCoarse, balance);
                this._handler.addControlChange(beat.voice.bar.staff.track.index, beat.playbackStart + startMove, beat.voice.bar.staff.track.playbackInfo.secondaryChannel, ControllerType.PanCoarse, balance);
                break;
            case AutomationType.Volume:
                let volume = MidiFileGenerator.toChannelShort(automation.value);
                this._handler.addControlChange(beat.voice.bar.staff.track.index, beat.playbackStart + startMove, beat.voice.bar.staff.track.playbackInfo.primaryChannel, ControllerType.VolumeCoarse, volume);
                this._handler.addControlChange(beat.voice.bar.staff.track.index, beat.playbackStart + startMove, beat.voice.bar.staff.track.playbackInfo.secondaryChannel, ControllerType.VolumeCoarse, volume);
                break;
        }
    }
    prepareSingleBeat(beat) {
        // collect tempo and program at given beat
        let tempo = -1;
        let program = -1;
        // traverse to previous beats until we maybe hit the automations needed
        let currentBeat = beat;
        while (currentBeat && (tempo === -1 || program === -1)) {
            for (const automation of beat.automations) {
                switch (automation.type) {
                    case AutomationType.Instrument:
                        program = automation.value;
                        break;
                    case AutomationType.Tempo:
                        tempo = automation.value;
                        break;
                }
            }
            currentBeat = currentBeat.previousBeat;
        }
        const track = beat.voice.bar.staff.track;
        const masterBar = beat.voice.bar.masterBar;
        if (tempo === -1) {
            tempo = masterBar.score.tempo;
        }
        if (program === -1) {
            program = track.playbackInfo.program;
        }
        const volume = track.playbackInfo.volume;
        // setup channel
        this.generateTrack(track);
        this._handler.addTimeSignature(0, masterBar.timeSignatureNumerator, masterBar.timeSignatureDenominator);
        this._handler.addTempo(0, tempo);
        let volumeCoarse = MidiFileGenerator.toChannelShort(volume);
        this._handler.addControlChange(0, 0, track.playbackInfo.primaryChannel, ControllerType.VolumeCoarse, volumeCoarse);
        this._handler.addControlChange(0, 0, track.playbackInfo.secondaryChannel, ControllerType.VolumeCoarse, volumeCoarse);
    }
    generateSingleBeat(beat) {
        this.prepareSingleBeat(beat);
        this.generateBeat(beat, -beat.playbackStart /* to bring it to 0*/, beat.voice.bar);
    }
    generateSingleNote(note) {
        this.prepareSingleBeat(note.beat);
        this.generateNote(note, -note.beat.playbackStart, note.beat.playbackDuration, new Int32Array(note.beat.voice.bar.staff.tuning.length));
    }
}
MidiFileGenerator.DefaultDurationDead = 30;
MidiFileGenerator.DefaultDurationPalmMute = 80;
/**
 * Maximum semitones that are supported in bends in one direction (up or down)
 * GP has 8 full tones on whammys.
 */
MidiFileGenerator.PitchBendRangeInSemitones = 8 * 2;
/**
 * The value on how many pitch-values are used for one semitone
 */
MidiFileGenerator.PitchValuePerSemitone = SynthConstants.DefaultPitchWheel / MidiFileGenerator.PitchBendRangeInSemitones;
/**
 * The minimum number of breakpoints generated per semitone bend.
 */
MidiFileGenerator.MinBreakpointsPerSemitone = 6;
/**
 * How long until a new breakpoint is generated for a bend.
 */
MidiFileGenerator.MillisecondsPerBreakpoint = 150;
//# sourceMappingURL=MidiFileGenerator.js.map