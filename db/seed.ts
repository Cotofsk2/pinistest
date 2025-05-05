import { db } from "./index";
import { houses, notes, houseTypeEnum, classificationEnum, statusEnum, noteCategoryEnum } from "@shared/schema";

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Check if houses already exist to avoid duplicates
    const existingHouses = await db.query.houses.findMany();
    if (existingHouses.length > 0) {
      console.log(`Found ${existingHouses.length} existing houses, skipping house creation`);
    } else {
      // Create 34 indoor houses - all Gold Standard
      const indoorHouses = Array.from({ length: 34 }, (_, i) => ({
        name: `Casa ${i + 1}`,
        type: "indoor" as const,
        classification: "gold_standard" as const,
        status: ["clean", "dirty", "occupied"][Math.floor(Math.random() * 3)] as const,
      }));

      // Create 11 outdoor houses - 8 Gold Standard, 3 Gold Premium
      const outdoorHouses = Array.from({ length: 11 }, (_, i) => {
        const houseNumber = i + 1;
        // House 5, 8, and 11 are Gold Premium
        const isPremium = [5, 8, 11].includes(houseNumber);
        
        return {
          name: `Casa ${houseNumber} EXT`,
          type: "outdoor" as const,
          classification: isPremium ? "gold_premium" as const : "gold_standard" as const,
          status: ["clean", "dirty", "occupied"][Math.floor(Math.random() * 3)] as const,
        };
      });

      // Insert all houses
      const allHouses = [...indoorHouses, ...outdoorHouses];
      console.log(`Inserting ${allHouses.length} houses...`);
      await db.insert(houses).values(allHouses);
      console.log("Houses inserted successfully!");
    }

    // Check if we should add sample notes
    const existingNotes = await db.query.notes.findMany();
    if (existingNotes.length > 0) {
      console.log(`Found ${existingNotes.length} existing notes, skipping note creation`);
    } else {
      // Get all houses to add notes to
      const allHouses = await db.query.houses.findMany();
      
      // Sample notes
      const sampleNotes = [
        {
          houseId: allHouses.find(h => h.name === "Casa 1")?.id,
          category: "critical" as const,
          content: "La habitación necesita limpieza profunda antes del próximo check-in",
          createdBy: "Juan",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          houseId: allHouses.find(h => h.name === "Casa 3")?.id,
          category: "minor" as const,
          content: "Huésped solicitó toallas adicionales para mañana",
          createdBy: "Sara",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          houseId: allHouses.find(h => h.name === "Casa 4")?.id,
          category: "other" as const,
          content: "Nueva máquina de café instalada",
          createdBy: "Marcos",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          houseId: allHouses.find(h => h.name === "Casa 5 EXT")?.id,
          category: "critical" as const,
          content: "Inspección Premium requerida antes del check-in de mañana",
          createdBy: "Luisa",
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
        },
        {
          houseId: allHouses.find(h => h.name === "Casa 11 EXT")?.id,
          category: "minor" as const,
          content: "Filtro de aire acondicionado necesita reemplazo la próxima semana",
          createdBy: "Tomás",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        }
      ];
      
      // Filter out notes with undefined houseIds (in case a house wasn't found)
      const validNotes = sampleNotes.filter(note => note.houseId !== undefined);
      
      if (validNotes.length > 0) {
        console.log(`Inserting ${validNotes.length} sample notes...`);
        await db.insert(notes).values(validNotes);
        console.log("Notes inserted successfully!");
      }
    }

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
