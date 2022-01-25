import { JsonHelper } from "@src/io/JsonHelper";
import { BendPointSerializer } from "@src/generated/model/BendPointSerializer";
import { AccentuationType } from "@src/model/AccentuationType";
import { BendType } from "@src/model/BendType";
import { BendStyle } from "@src/model/BendStyle";
import { BendPoint } from "@src/model/BendPoint";
import { HarmonicType } from "@src/model/HarmonicType";
import { SlideInType } from "@src/model/SlideInType";
import { SlideOutType } from "@src/model/SlideOutType";
import { VibratoType } from "@src/model/VibratoType";
import { Fingers } from "@src/model/Fingers";
import { Duration } from "@src/model/Duration";
import { NoteAccidentalMode } from "@src/model/NoteAccidentalMode";
import { DynamicValue } from "@src/model/DynamicValue";
export class NoteSerializer {
    static fromJson(obj, m) {
        if (!m) {
            return;
        }
        JsonHelper.forEach(m, (v, k) => this.setProperty(obj, k.toLowerCase(), v));
    }
    static toJson(obj) {
        if (!obj) {
            return null;
        }
        const o = new Map();
        o.set("id", obj.id);
        o.set("accentuated", obj.accentuated);
        o.set("bendType", obj.bendType);
        o.set("bendStyle", obj.bendStyle);
        o.set("isContinuedBend", obj.isContinuedBend);
        o.set("bendPoints", obj.bendPoints.map(i => BendPointSerializer.toJson(i)));
        o.set("fret", obj.fret);
        o.set("string", obj.string);
        o.set("octave", obj.octave);
        o.set("tone", obj.tone);
        o.set("percussionArticulation", obj.percussionArticulation);
        o.set("isVisible", obj.isVisible);
        o.set("isLeftHandTapped", obj.isLeftHandTapped);
        o.set("isHammerPullOrigin", obj.isHammerPullOrigin);
        o.set("hammerPullOriginNoteId", obj.hammerPullOriginNoteId);
        o.set("hammerPullDestinationNoteId", obj.hammerPullDestinationNoteId);
        o.set("isSlurDestination", obj.isSlurDestination);
        o.set("slurOriginNoteId", obj.slurOriginNoteId);
        o.set("slurDestinationNoteId", obj.slurDestinationNoteId);
        o.set("harmonicType", obj.harmonicType);
        o.set("harmonicValue", obj.harmonicValue);
        o.set("isGhost", obj.isGhost);
        o.set("isLetRing", obj.isLetRing);
        o.set("isPalmMute", obj.isPalmMute);
        o.set("isDead", obj.isDead);
        o.set("isStaccato", obj.isStaccato);
        o.set("slideInType", obj.slideInType);
        o.set("slideOutType", obj.slideOutType);
        o.set("vibrato", obj.vibrato);
        o.set("tieOriginNoteId", obj.tieOriginNoteId);
        o.set("tieDestinationNoteId", obj.tieDestinationNoteId);
        o.set("isTieDestination", obj.isTieDestination);
        o.set("leftHandFinger", obj.leftHandFinger);
        o.set("rightHandFinger", obj.rightHandFinger);
        o.set("isFingering", obj.isFingering);
        o.set("trillValue", obj.trillValue);
        o.set("trillSpeed", obj.trillSpeed);
        o.set("durationPercent", obj.durationPercent);
        o.set("accidentalMode", obj.accidentalMode);
        o.set("dynamics", obj.dynamics);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "id":
                obj.id = v;
                return true;
            case "accentuated":
                obj.accentuated = JsonHelper.parseEnum(v, AccentuationType);
                return true;
            case "bendtype":
                obj.bendType = JsonHelper.parseEnum(v, BendType);
                return true;
            case "bendstyle":
                obj.bendStyle = JsonHelper.parseEnum(v, BendStyle);
                return true;
            case "iscontinuedbend":
                obj.isContinuedBend = v;
                return true;
            case "bendpoints":
                obj.bendPoints = [];
                for (const o of v) {
                    const i = new BendPoint();
                    BendPointSerializer.fromJson(i, o);
                    obj.addBendPoint(i);
                }
                return true;
            case "fret":
                obj.fret = v;
                return true;
            case "string":
                obj.string = v;
                return true;
            case "octave":
                obj.octave = v;
                return true;
            case "tone":
                obj.tone = v;
                return true;
            case "percussionarticulation":
                obj.percussionArticulation = v;
                return true;
            case "isvisible":
                obj.isVisible = v;
                return true;
            case "islefthandtapped":
                obj.isLeftHandTapped = v;
                return true;
            case "ishammerpullorigin":
                obj.isHammerPullOrigin = v;
                return true;
            case "hammerpulloriginnoteid":
                obj.hammerPullOriginNoteId = v;
                return true;
            case "hammerpulldestinationnoteid":
                obj.hammerPullDestinationNoteId = v;
                return true;
            case "isslurdestination":
                obj.isSlurDestination = v;
                return true;
            case "sluroriginnoteid":
                obj.slurOriginNoteId = v;
                return true;
            case "slurdestinationnoteid":
                obj.slurDestinationNoteId = v;
                return true;
            case "harmonictype":
                obj.harmonicType = JsonHelper.parseEnum(v, HarmonicType);
                return true;
            case "harmonicvalue":
                obj.harmonicValue = v;
                return true;
            case "isghost":
                obj.isGhost = v;
                return true;
            case "isletring":
                obj.isLetRing = v;
                return true;
            case "ispalmmute":
                obj.isPalmMute = v;
                return true;
            case "isdead":
                obj.isDead = v;
                return true;
            case "isstaccato":
                obj.isStaccato = v;
                return true;
            case "slideintype":
                obj.slideInType = JsonHelper.parseEnum(v, SlideInType);
                return true;
            case "slideouttype":
                obj.slideOutType = JsonHelper.parseEnum(v, SlideOutType);
                return true;
            case "vibrato":
                obj.vibrato = JsonHelper.parseEnum(v, VibratoType);
                return true;
            case "tieoriginnoteid":
                obj.tieOriginNoteId = v;
                return true;
            case "tiedestinationnoteid":
                obj.tieDestinationNoteId = v;
                return true;
            case "istiedestination":
                obj.isTieDestination = v;
                return true;
            case "lefthandfinger":
                obj.leftHandFinger = JsonHelper.parseEnum(v, Fingers);
                return true;
            case "righthandfinger":
                obj.rightHandFinger = JsonHelper.parseEnum(v, Fingers);
                return true;
            case "isfingering":
                obj.isFingering = v;
                return true;
            case "trillvalue":
                obj.trillValue = v;
                return true;
            case "trillspeed":
                obj.trillSpeed = JsonHelper.parseEnum(v, Duration);
                return true;
            case "durationpercent":
                obj.durationPercent = v;
                return true;
            case "accidentalmode":
                obj.accidentalMode = JsonHelper.parseEnum(v, NoteAccidentalMode);
                return true;
            case "dynamics":
                obj.dynamics = JsonHelper.parseEnum(v, DynamicValue);
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=NoteSerializer.js.map