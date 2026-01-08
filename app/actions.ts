"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

// --- PRAISE SYSTEM ---
const PRAISE_DB_PATH = path.join(process.cwd(), "app", "praise-db.json");

type Praise = {
  id: number;
  name: string;
  role: string;
  subject: string;
  message: string;
};

// ... existing praise seed data ...
const PRAISE_SEED_DATA: Praise[] = [
  { 
    id: 1, 
    name: "Idong", 
    role: "Tenant", 
    subject: "🚀 🥂", 
    message: "Excited to be working on this app. I hope you all enjoy it and come to use it daily 💪🏽" 
  }
];

export async function getPraises(): Promise<Praise[]> {
  try {
    const data = await fs.readFile(PRAISE_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    await fs.writeFile(PRAISE_DB_PATH, JSON.stringify(PRAISE_SEED_DATA, null, 2));
    return PRAISE_SEED_DATA;
  }
}

export async function addPraise(newPraise: Praise) {
  const praises = await getPraises();
  const updatedPraises = [newPraise, ...praises];
  await fs.writeFile(PRAISE_DB_PATH, JSON.stringify(updatedPraises, null, 2));
  revalidatePath("/");
  return updatedPraises;
}

// --- NEW: FEEDBACK SYSTEM ---
const FEEDBACK_DB_PATH = path.join(process.cwd(), "app", "feedback-db.json");

export type Feedback = {
  id: number;
  name: string;
  role: string;
  subject: string;
  message: string;
  submittedAt: string;
};

export async function getFeedback(): Promise<Feedback[]> {
  try {
    const data = await fs.readFile(FEEDBACK_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

export async function addFeedback(newFeedback: Feedback) {
  const list = await getFeedback();
  const updated = [newFeedback, ...list];
  await fs.writeFile(FEEDBACK_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/feedback"); // Refresh the feedback page
  return updated;
}