import { db } from "@db";
import { eq, desc } from "drizzle-orm";
import { 
  houses, 
  notes, 
  House,
  Note,
  InsertNote,
  insertNoteSchema
} from "@shared/schema";

export const storage = {
  // House-related functions
  getAllHouses: async (): Promise<House[]> => {
    const allHouses = await db.query.houses.findMany({
      with: {
        notes: {
          orderBy: [desc(notes.createdAt)]
        }
      }
    });
    return allHouses;
  },

  getHouseById: async (id: number): Promise<House | undefined> => {
    const house = await db.query.houses.findFirst({
      where: eq(houses.id, id),
      with: {
        notes: {
          orderBy: [desc(notes.createdAt)]
        }
      }
    });
    return house;
  },

  updateHouseStatus: async (id: number, updates: { status?: "clean" | "dirty" | "occupied"; Checks?: string }): Promise<House> => {
    const [updatedHouse] = await db
      .update(houses)
      .set(updates)
      .where(eq(houses.id, id))
      .returning();

    const houseWithNotes = await db.query.houses.findFirst({
      where: eq(houses.id, id),
      with: {
        notes: true
      }
    });

    return houseWithNotes!;
  },

  // Note-related functions
  getNotesByHouseId: async (houseId: number): Promise<Note[]> => {
    const allNotes = await db.query.notes.findMany({
      where: eq(notes.houseId, houseId),
      orderBy: [desc(notes.createdAt)]
    });
    return allNotes;
  },

  getNoteById: async (id: number): Promise<Note | undefined> => {
    const note = await db.query.notes.findFirst({
      where: eq(notes.id, id)
    });
    return note;
  },

  addNote: async (houseId: number, noteData: Omit<InsertNote, "id" | "createdAt">): Promise<Note> => {
    try {
      const validAreas = ["gasfiteria", "electricidad", "reposicion", "otro"] as const;
      const area = validAreas.includes(noteData.area as any) ? noteData.area : "otro";

      const fullData = {
        ...noteData,
        houseId,
        area,
        createdBy: noteData.createdBy || "system"
      };

      console.log("Data to insert:", fullData);

      const parsedNote = insertNoteSchema.parse(fullData);
      const [newNote] = await db.insert(notes).values(parsedNote).returning();
      return newNote;
    } catch (error) {
      console.error("Error in addNote:", error);
      throw error;
    }
  },

  deleteNote: async (id: number): Promise<void> => {
    await db
      .delete(notes)
      .where(eq(notes.id, id));
  }
};