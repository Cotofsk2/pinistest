export enum HouseType {
  INDOOR = "indoor",
  OUTDOOR = "outdoor"
}

export enum Classification {
  GOLD_STANDARD = "gold_standard",
  GOLD_PREMIUM = "gold_premium"
}

export type Status = "clean" | "dirty" | "occupied";
export type NoteCategory = "critical" | "minor" | "other";

export interface Note {
  id: number;
  houseId: number;
  category: NoteCategory;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface House {
  id: number;
  name: string;
  type: HouseType;
  classification: Classification;
  status: Status;
  notes?: Note[];
}
