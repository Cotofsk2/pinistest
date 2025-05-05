import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertNoteSchema, updateHouseStatusSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all houses with their notes
  app.get("/api/houses", async (req, res) => {
    try {
      const houses = await storage.getAllHouses();
      return res.status(200).json(houses);
    } catch (error) {
      console.error("Error fetching houses:", error);
      return res.status(500).json({ error: "Failed to fetch houses" });
    }
  });

  // Get a single house by ID
  app.get("/api/houses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid house ID" });
      }

      const house = await storage.getHouseById(id);
      if (!house) {
        return res.status(404).json({ error: "House not found" });
      }

      return res.status(200).json(house);
    } catch (error) {
      console.error("Error fetching house:", error);
      return res.status(500).json({ error: "Failed to fetch house" });
    }
  });

  // Update house status
  app.patch("/api/houses/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid house ID" });
      }

      const validatedData = updateHouseStatusSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ error: validatedData.error.errors });
      }

      const house = await storage.getHouseById(id);
      if (!house) {
        return res.status(404).json({ error: "House not found" });
      }

      const updatedHouse = await storage.updateHouseStatus(id, validatedData.data.status);
      return res.status(200).json(updatedHouse);
    } catch (error) {
      console.error("Error updating house status:", error);
      return res.status(500).json({ error: "Failed to update house status" });
    }
  });

  // Get all notes for a house
  app.get("/api/houses/:id/notes", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid house ID" });
      }

      const notes = await storage.getNotesByHouseId(id);
      return res.status(200).json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      return res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  // Add a note to a house
  app.post("/api/houses/:id/notes", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid house ID" });
      }

      const validationSchema = insertNoteSchema.omit({ id: true, houseId: true, createdAt: true });
      const validatedData = validationSchema.safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({ error: validatedData.error.errors });
      }

      const house = await storage.getHouseById(id);
      if (!house) {
        return res.status(404).json({ error: "House not found" });
      }

      const newNote = await storage.addNote(id, {
        ...validatedData.data,
        category: validatedData.data.category,
        houseId: id,
        createdBy: "system"
      });

      return res.status(201).json(newNote);
    } catch (error) {
      console.error("Error adding note:", error);
      return res.status(500).json({ error: "Failed to add note" });
    }
  });

  // Delete a note
  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid note ID" });
      }

      const note = await storage.getNoteById(id);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }

      await storage.deleteNote(id);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting note:", error);
      return res.status(500).json({ error: "Failed to delete note" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
