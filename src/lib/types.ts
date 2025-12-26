export type Stage = "WISHLIST" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type Feeling = "UP" | "NEUTRAL" | "DOWN";

export interface JobApplication {
  id: string;
  company: string;
  role: string | null;
  stage: Stage;
  appliedDate: Date | null;
  lastUpdate: Date;
  nextActionDate: Date | null;
  salaryRange: string | null;
  priority: Priority;
  feeling: Feeling;
  link: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const STAGES: Stage[] = [
  "WISHLIST",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

export const STAGE_LABELS: Record<Stage, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

export const FEELING_EMOJI: Record<Feeling, string> = {
  UP: "👍",
  NEUTRAL: "😐",
  DOWN: "👎",
};
