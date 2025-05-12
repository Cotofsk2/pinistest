import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enum definitions for house types and classifications
export const houseTypeEnum = pgEnum("house_type", ["indoor", "outdoor"]);
export const classificationEnum = pgEnum("classification", ["gold_standard", "gold_premium"]);
export const statusEnum = pgEnum("status", ["clean", "dirty", "occupied"]);
export const noteCategoryEnum = pgEnum("note_category", ["critical", "minor", "other"]);
export const noteAreaEnum = pgEnum("note_area", ["gasfiteria", "electricidad", "reposicion", "otro"]);
export const checksEnum = pgEnum("Checks", ["Check-in", "Check-out", "Check-in Check-out", "Nada"]);

// User table for authentication (keeps existing table)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Houses table
export const houses = pgTable("houses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: houseTypeEnum("type").notNull(),
  classification: classificationEnum("classification").notNull(),
  status: statusEnum("status").notNull().default("clean"),
  Checks: checksEnum("Checks").notNull().default("Nada"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Notes table
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  houseId: integer("house_id").references(() => houses.id, { onDelete: "cascade" }).notNull(),
  category: noteCategoryEnum("category").notNull(),
  area: noteAreaEnum("area").notNull(),
  content: text("content").notNull(),
  createdBy: text("created_by").default("system"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const housesRelations = relations(houses, ({ many }) => ({
  notes: many(notes),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  house: one(houses, { fields: [notes.houseId], references: [houses.id] }),
}));

// Define schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHouseSchema = createInsertSchema(houses, {
  name: (schema) => schema.min(1, "House name is required"),
  type: (schema) => schema.refine(val => val === "indoor" || val === "outdoor", "Type must be indoor or outdoor"),
  classification: (schema) => schema.refine(val => val === "gold_standard" || val === "gold_premium", "Classification must be gold_standard or gold_premium"),
  status: (schema) => schema.refine(val => ["clean", "dirty", "occupied"].includes(val), "Status must be clean, dirty, or occupied"),
});

export const updateHouseStatusSchema = z.object({
  status: z.enum(["clean", "dirty", "occupied"]).optional(),
  Checks: z.enum(["Check-in", "Check-out", "Check-in Check-out", "Nada"]).optional(),
}).refine(data => data.status || data.Checks, {
  message: "At least one of status or Checks must be provided"
});

export const insertNoteSchema = createInsertSchema(notes, {
  content: (schema) => schema.min(1, "Note content is required"),
  category: (schema) => schema.refine(val => ["critical", "minor", "other"].includes(val), "Category must be critical, minor, or other"),
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertHouse = z.infer<typeof insertHouseSchema>;
export type House = typeof houses.$inferSelect & { notes?: (typeof notes.$inferSelect)[] };
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type NoteArea = "gasfiteria" | "electricidad" | "reposicion" | "otro";
export type Note = typeof notes.$inferSelect;
export type UpdateHouseStatus = z.infer<typeof updateHouseStatusSchema>;
