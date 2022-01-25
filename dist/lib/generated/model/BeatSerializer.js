import { JsonHelper } from "@src/io/JsonHelper";
import { NoteSerializer } from "@src/generated/model/NoteSerializer";
import { AutomationSerializer } from "@src/generated/model/AutomationSerializer";
import { BendPointSerializer } from "@src/generated/model/BendPointSerializer";
import { Note } from "@src/model/Note";
import { BendStyle } from "@src/model/BendStyle";
import { Ottavia } from "@src/model/Ottavia";
import { Duration } from "@src/model/Duration";
import { Automation } from "@src/model/Automation";
import { BrushType } from "@src/model/BrushType";
import { WhammyType } from "@src/model/WhammyType";
import { BendPoint } from "@src/model/BendPoint";
import { VibratoType } from "@src/model/VibratoType";
import { GraceType } from "@src/model/GraceType";
import { PickStroke } from "@src/model/PickStroke";
import { CrescendoType } from "@src/model/CrescendoType";
import { DynamicValue } from "@src/model/DynamicValue";
import { BeamDirection } from "@src/rendering/utils/BeamDirection";
import { BeatBeamingMode } from "@src/model/Beat";
export class BeatSerializer {
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
        o.set("notes", obj.notes.map(i => NoteSerializer.toJson(i)));
        o.set("isEmpty", obj.isEmpty);
        o.set("whammyStyle", obj.whammyStyle);
        o.set("ottava", obj.ottava);
        o.set("isLegatoOrigin", obj.isLegatoOrigin);
        o.set("duration", obj.duration);
        o.set("automations", obj.automations.map(i => AutomationSerializer.toJson(i)));
        o.set("dots", obj.dots);
        o.set("fadeIn", obj.fadeIn);
        o.set("lyrics", obj.lyrics);
        o.set("hasRasgueado", obj.hasRasgueado);
        o.set("pop", obj.pop);
        o.set("slap", obj.slap);
        o.set("tap", obj.tap);
        o.set("text", obj.text);
        o.set("brushType", obj.brushType);
        o.set("brushDuration", obj.brushDuration);
        o.set("tupletDenominator", obj.tupletDenominator);
        o.set("tupletNumerator", obj.tupletNumerator);
        o.set("isContinuedWhammy", obj.isContinuedWhammy);
        o.set("whammyBarType", obj.whammyBarType);
        o.set("whammyBarPoints", obj.whammyBarPoints.map(i => BendPointSerializer.toJson(i)));
        o.set("vibrato", obj.vibrato);
        o.set("chordId", obj.chordId);
        o.set("graceType", obj.graceType);
        o.set("pickStroke", obj.pickStroke);
        o.set("tremoloSpeed", obj.tremoloSpeed);
        o.set("crescendo", obj.crescendo);
        o.set("displayStart", obj.displayStart);
        o.set("playbackStart", obj.playbackStart);
        o.set("displayDuration", obj.displayDuration);
        o.set("playbackDuration", obj.playbackDuration);
        o.set("dynamics", obj.dynamics);
        o.set("invertBeamDirection", obj.invertBeamDirection);
        o.set("preferredBeamDirection", obj.preferredBeamDirection);
        o.set("beamingMode", obj.beamingMode);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "id":
                obj.id = v;
                return true;
            case "notes":
                obj.notes = [];
                for (const o of v) {
                    const i = new Note();
                    NoteSerializer.fromJson(i, o);
                    obj.addNote(i);
                }
                return true;
            case "isempty":
                obj.isEmpty = v;
                return true;
            case "whammystyle":
                obj.whammyStyle = JsonHelper.parseEnum(v, BendStyle);
                return true;
            case "ottava":
                obj.ottava = JsonHelper.parseEnum(v, Ottavia);
                return true;
            case "islegatoorigin":
                obj.isLegatoOrigin = v;
                return true;
            case "duration":
                obj.duration = JsonHelper.parseEnum(v, Duration);
                return true;
            case "automations":
                obj.automations = [];
                for (const o of v) {
                    const i = new Automation();
                    AutomationSerializer.fromJson(i, o);
                    obj.automations.push(i);
                }
                return true;
            case "dots":
                obj.dots = v;
                return true;
            case "fadein":
                obj.fadeIn = v;
                return true;
            case "lyrics":
                obj.lyrics = v;
                return true;
            case "hasrasgueado":
                obj.hasRasgueado = v;
                return true;
            case "pop":
                obj.pop = v;
                return true;
            case "slap":
                obj.slap = v;
                return true;
            case "tap":
                obj.tap = v;
                return true;
            case "text":
                obj.text = v;
                return true;
            case "brushtype":
                obj.brushType = JsonHelper.parseEnum(v, BrushType);
                return true;
            case "brushduration":
                obj.brushDuration = v;
                return true;
            case "tupletdenominator":
                obj.tupletDenominator = v;
                return true;
            case "tupletnumerator":
                obj.tupletNumerator = v;
                return true;
            case "iscontinuedwhammy":
                obj.isContinuedWhammy = v;
                return true;
            case "whammybartype":
                obj.whammyBarType = JsonHelper.parseEnum(v, WhammyType);
                return true;
            case "whammybarpoints":
                obj.whammyBarPoints = [];
                for (const o of v) {
                    const i = new BendPoint();
                    BendPointSerializer.fromJson(i, o);
                    obj.addWhammyBarPoint(i);
                }
                return true;
            case "vibrato":
                obj.vibrato = JsonHelper.parseEnum(v, VibratoType);
                return true;
            case "chordid":
                obj.chordId = v;
                return true;
            case "gracetype":
                obj.graceType = JsonHelper.parseEnum(v, GraceType);
                return true;
            case "pickstroke":
                obj.pickStroke = JsonHelper.parseEnum(v, PickStroke);
                return true;
            case "tremolospeed":
                obj.tremoloSpeed = JsonHelper.parseEnum(v, Duration);
                return true;
            case "crescendo":
                obj.crescendo = JsonHelper.parseEnum(v, CrescendoType);
                return true;
            case "displaystart":
                obj.displayStart = v;
                return true;
            case "playbackstart":
                obj.playbackStart = v;
                return true;
            case "displayduration":
                obj.displayDuration = v;
                return true;
            case "playbackduration":
                obj.playbackDuration = v;
                return true;
            case "dynamics":
                obj.dynamics = JsonHelper.parseEnum(v, DynamicValue);
                return true;
            case "invertbeamdirection":
                obj.invertBeamDirection = v;
                return true;
            case "preferredbeamdirection":
                obj.preferredBeamDirection = JsonHelper.parseEnum(v, BeamDirection);
                return true;
            case "beamingmode":
                obj.beamingMode = JsonHelper.parseEnum(v, BeatBeamingMode);
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=BeatSerializer.js.map