import { BeatBounds } from "@src/rendering/utils/BeatBounds";
import { NoteBounds } from "@src/rendering/utils/NoteBounds";
import { Note } from "@src/model/Note";
import { Bounds } from "@src/rendering/utils/Bounds";
describe('BeatBounds', () => {
    it('findNoteAtPos', () => {
        const beatBounds = new BeatBounds();
        const notes = [new Note(), new Note(), new Note()];
        const note1Bounds = new NoteBounds();
        note1Bounds.note = notes[0];
        note1Bounds.noteHeadBounds = new Bounds();
        note1Bounds.noteHeadBounds.x = 574;
        note1Bounds.noteHeadBounds.y = 1089;
        note1Bounds.noteHeadBounds.w = 7;
        note1Bounds.noteHeadBounds.h = 13;
        beatBounds.addNote(note1Bounds);
        const note2Bounds = new NoteBounds();
        note2Bounds.note = notes[1];
        note2Bounds.noteHeadBounds = new Bounds();
        note2Bounds.noteHeadBounds.x = 574;
        note2Bounds.noteHeadBounds.y = 1100;
        note2Bounds.noteHeadBounds.w = 7;
        note2Bounds.noteHeadBounds.h = 13;
        beatBounds.addNote(note2Bounds);
        const note3Bounds = new NoteBounds();
        note3Bounds.note = notes[2];
        note3Bounds.noteHeadBounds = new Bounds();
        note3Bounds.noteHeadBounds.x = 574;
        note3Bounds.noteHeadBounds.y = 1111;
        note3Bounds.noteHeadBounds.w = 7;
        note3Bounds.noteHeadBounds.h = 13;
        beatBounds.addNote(note3Bounds);
        // Test X axis
        expect(beatBounds.findNoteAtPos(573, 1090)).toBeNull();
        expect(beatBounds.findNoteAtPos(574, 1090)).toBe(notes[0]);
        expect(beatBounds.findNoteAtPos(581, 1090)).toBe(notes[0]);
        expect(beatBounds.findNoteAtPos(582, 1090)).toBeNull();
        // Test Y axis
        expect(beatBounds.findNoteAtPos(580, 1088)).toBeNull();
        expect(beatBounds.findNoteAtPos(580, 1089)).toBe(notes[0]);
        expect(beatBounds.findNoteAtPos(580, 1102)).toBe(notes[0]);
        expect(beatBounds.findNoteAtPos(580, 1103)).toBe(notes[1]);
        expect(beatBounds.findNoteAtPos(580, 1113)).toBe(notes[1]);
        expect(beatBounds.findNoteAtPos(580, 1114)).toBe(notes[2]);
        expect(beatBounds.findNoteAtPos(580, 1124)).toBe(notes[2]);
        expect(beatBounds.findNoteAtPos(580, 1125)).toBeNull();
    });
});
//# sourceMappingURL=BeatBound.test.js.map