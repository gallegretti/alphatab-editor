import { BarBounds } from '@src/rendering/utils/BarBounds';
import { BeatBounds } from '@src/rendering/utils/BeatBounds';
import { MasterBarBounds } from '@src/rendering/utils/MasterBarBounds';
import { NoteBounds } from '@src/rendering/utils/NoteBounds';
import { StaveGroupBounds } from '@src/rendering/utils/StaveGroupBounds';
export class BoundsLookup {
    constructor() {
        this._beatLookup = new Map();
        this._masterBarLookup = new Map();
        this._currentStaveGroup = null;
        /**
         * Gets a list of all individual stave groups contained in the rendered music notation.
         */
        this.staveGroups = [];
        /**
         * Gets or sets a value indicating whether this lookup was finished already.
         */
        this.isFinished = false;
    }
    /**
     * @target web
     */
    toJson() {
        let json = {};
        let staveGroups = [];
        json.staveGroups = staveGroups;
        for (let group of this.staveGroups) {
            let g = {};
            g.visualBounds = this.boundsToJson(group.visualBounds);
            g.realBounds = this.boundsToJson(group.realBounds);
            g.bars = [];
            for (let masterBar of group.bars) {
                let mb = {};
                mb.lineAlignedBounds = this.boundsToJson(masterBar.lineAlignedBounds);
                mb.visualBounds = this.boundsToJson(masterBar.visualBounds);
                mb.realBounds = this.boundsToJson(masterBar.realBounds);
                mb.index = masterBar.index;
                mb.bars = [];
                for (let bar of masterBar.bars) {
                    let b = {};
                    b.visualBounds = this.boundsToJson(bar.visualBounds);
                    b.realBounds = this.boundsToJson(bar.realBounds);
                    b.beats = [];
                    for (let beat of bar.beats) {
                        let bb = {};
                        bb.visualBounds = this.boundsToJson(beat.visualBounds);
                        bb.realBounds = this.boundsToJson(beat.realBounds);
                        let bbd = bb;
                        bbd.beatIndex = beat.beat.index;
                        bbd.voiceIndex = beat.beat.voice.index;
                        bbd.barIndex = beat.beat.voice.bar.index;
                        bbd.staffIndex = beat.beat.voice.bar.staff.index;
                        bbd.trackIndex = beat.beat.voice.bar.staff.track.index;
                        if (beat.notes) {
                            let notes = (bb.notes = []);
                            for (let note of beat.notes) {
                                let n = {};
                                let nd = n;
                                nd.index = note.note.index;
                                n.noteHeadBounds = this.boundsToJson(note.noteHeadBounds);
                                notes.push(n);
                            }
                        }
                        b.beats.push(bb);
                    }
                    mb.bars.push(b);
                }
                g.bars.push(mb);
            }
            staveGroups.push(g);
        }
        return json;
    }
    /**
     * @target web
     */
    static fromJson(json, score) {
        let lookup = new BoundsLookup();
        let staveGroups = json['staveGroups'];
        for (let staveGroup of staveGroups) {
            let sg = new StaveGroupBounds();
            sg.visualBounds = staveGroup.visualBounds;
            sg.realBounds = staveGroup.realBounds;
            lookup.addStaveGroup(sg);
            for (let masterBar of staveGroup.bars) {
                let mb = new MasterBarBounds();
                mb.index = masterBar.index;
                mb.isFirstOfLine = masterBar.isFirstOfLine;
                mb.lineAlignedBounds = masterBar.lineAlignedBounds;
                mb.visualBounds = masterBar.visualBounds;
                mb.realBounds = masterBar.realBounds;
                sg.addBar(mb);
                for (let bar of masterBar.bars) {
                    let b = new BarBounds();
                    b.visualBounds = bar.visualBounds;
                    b.realBounds = bar.realBounds;
                    mb.addBar(b);
                    for (let beat of bar.beats) {
                        let bb = new BeatBounds();
                        bb.visualBounds = beat.visualBounds;
                        bb.realBounds = beat.realBounds;
                        let bd = beat;
                        bb.beat =
                            score.tracks[bd.trackIndex].staves[bd.staffIndex].bars[bd.barIndex].voices[bd.voiceIndex].beats[bd.beatIndex];
                        if (beat.notes) {
                            bb.notes = [];
                            for (let note of beat.notes) {
                                let n = new NoteBounds();
                                let nd = note;
                                n.note = bb.beat.notes[nd.index];
                                n.noteHeadBounds = note.noteHeadBounds;
                                bb.addNote(n);
                            }
                        }
                        b.addBeat(bb);
                    }
                }
            }
        }
        return lookup;
    }
    /**
     * @target web
     */
    boundsToJson(bounds) {
        let json = {};
        json.x = bounds.x;
        json.y = bounds.y;
        json.w = bounds.w;
        json.h = bounds.h;
        return json;
    }
    /**
     * Finishes the lookup for optimized access.
     */
    finish() {
        for (let t of this.staveGroups) {
            t.finish();
        }
        this.isFinished = true;
    }
    /**
     * Adds a new note to the lookup.
     * @param bounds The note bounds to add.
     */
    addNote(bounds) {
        let beat = this.findBeat(bounds.note.beat);
        beat.addNote(bounds);
    }
    /**
     * Adds a new stave group to the lookup.
     * @param bounds The stave group bounds to add.
     */
    addStaveGroup(bounds) {
        bounds.index = this.staveGroups.length;
        bounds.boundsLookup = this;
        this.staveGroups.push(bounds);
        this._currentStaveGroup = bounds;
    }
    /**
     * Adds a new master bar to the lookup.
     * @param bounds The master bar bounds to add.
     */
    addMasterBar(bounds) {
        if (!bounds.staveGroupBounds) {
            bounds.staveGroupBounds = this._currentStaveGroup;
            this._masterBarLookup.set(bounds.index, bounds);
            this._currentStaveGroup.addBar(bounds);
        }
        else {
            this._masterBarLookup.set(bounds.index, bounds);
        }
    }
    /**
     * Adds a new beat to the lookup.
     * @param bounds The beat bounds to add.
     */
    addBeat(bounds) {
        this._beatLookup.set(bounds.beat.id, bounds);
    }
    /**
     * Tries to find the master bar bounds by a given index.
     * @param index The index of the master bar to find.
     * @returns The master bar bounds if it was rendered, or null if no boundary information is available.
     */
    findMasterBarByIndex(index) {
        if (this._masterBarLookup.has(index)) {
            return this._masterBarLookup.get(index);
        }
        return null;
    }
    /**
     * Tries to find the master bar bounds by a given master bar.
     * @param bar The master bar to find.
     * @returns The master bar bounds if it was rendered, or null if no boundary information is available.
     */
    findMasterBar(bar) {
        let id = bar.index;
        if (this._masterBarLookup.has(id)) {
            return this._masterBarLookup.get(id);
        }
        return null;
    }
    /**
     * Tries to find the bounds of a given beat.
     * @param beat The beat to find.
     * @returns The beat bounds if it was rendered, or null if no boundary information is available.
     */
    findBeat(beat) {
        let id = beat.id;
        if (this._beatLookup.has(id)) {
            return this._beatLookup.get(id);
        }
        return null;
    }
    /**
     * Tries to find a beat at the given absolute position.
     * @param x The absolute X-position of the beat to find.
     * @param y The absolute Y-position of the beat to find.
     * @returns The beat found at the given position or null if no beat could be found.
     */
    getBeatAtPos(x, y) {
        //
        // find a bar which matches in y-axis
        let bottom = 0;
        let top = this.staveGroups.length - 1;
        let staveGroupIndex = -1;
        while (bottom <= top) {
            let middle = ((top + bottom) / 2) | 0;
            let group = this.staveGroups[middle];
            // found?
            if (y >= group.realBounds.y && y <= group.realBounds.y + group.realBounds.h) {
                staveGroupIndex = middle;
                break;
            }
            // search in lower half
            if (y < group.realBounds.y) {
                top = middle - 1;
            }
            else {
                bottom = middle + 1;
            }
        }
        // no bar found
        if (staveGroupIndex === -1) {
            return null;
        }
        //
        // Find the matching bar in the row
        let staveGroup = this.staveGroups[staveGroupIndex];
        let bar = staveGroup.findBarAtPos(x);
        if (bar) {
            return bar.findBeatAtPos(x, y);
        }
        return null;
    }
    /**
     * Tries to find the note at the given position using the given beat for fast access.
     * Use {@link findBeat} to find a beat for a given position first.
     * @param beat The beat containing the note.
     * @param x The X-position of the note to find.
     * @param y The Y-position of the note to find.
     * @returns The note at the given position within the beat or null if no note could be found.
     */
    getNoteAtPos(beat, x, y) {
        let beatBounds = this.findBeat(beat);
        if (!beatBounds) {
            return null;
        }
        return beatBounds.findNoteAtPos(x, y);
    }
}
//# sourceMappingURL=BoundsLookup.js.map