/**
 * file: app/actions.ts
 * description: Added 'alias' to User type and updated registerUser to return the created user.
 */

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

// ... existing Praise functions ...
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

// --- FEEDBACK SYSTEM ---
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
    return [];
  }
}

export async function addFeedback(newFeedback: Feedback) {
  const list = await getFeedback();
  const updated = [newFeedback, ...list];
  await fs.writeFile(FEEDBACK_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/feedback");
  return updated;
}

// --- USER REGISTRATION SYSTEM ---
const USERS_DB_PATH = path.join(process.cwd(), "app", "users-db.json");

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  alias?: string; // <--- NEW OPTIONAL FIELD
  role: string;
  phone: string;
  joinedAt: string;
};

export async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

type RegisterResponse = {
  success: boolean;
  message?: string;
  user?: User; // <--- Return the user object on success
};

export async function registerUser(formData: any): Promise<RegisterResponse> {
  // 1. SECURITY CHECK: Verify Door Code
  if (formData.doorCode !== "0129") {
    return { success: false, message: "❌ Incorrect Door Code. Access Denied." };
  }

  // 2. Prepare User Data
  const newUser: User = {
    id: Date.now(),
    firstName: formData.firstName,
    lastName: formData.lastName,
    alias: formData.alias || "", // Store empty string if no alias provided
    role: formData.role,
    phone: formData.phone,
    joinedAt: new Date().toISOString()
  };

  // 3. Save to DB
  const users = await getUsers();
  const updatedUsers = [...users, newUser];
  await fs.writeFile(USERS_DB_PATH, JSON.stringify(updatedUsers, null, 2));
  
  // 4. Revalidate
  revalidatePath("/mates");
  return { success: true, user: newUser };
}

// --- COMMON ROOM POSTS ---
const POSTS_DB_PATH = path.join(process.cwd(), "app", "posts-db.json");

export type Post = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  editCount: number;
};

export async function getPosts(): Promise<Post[]> {
  try {
    const data = await fs.readFile(POSTS_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function addPost(newPost: Post) {
  const posts = await getPosts();
  const updated = [newPost, ...posts];
  await fs.writeFile(POSTS_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/common-room");
  return updated;
}

// NEW: Edit Post Action
export async function editPost(postId: number, newContent: string) {
  const posts = await getPosts();
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) {
    return { success: false, message: "Post not found" };
  }

  const post = posts[postIndex];

  // 1. Check Edit Count Limit (Max 1)
  const currentEdits = post.editCount || 0;
  if (currentEdits >= 1) {
    return { success: false, message: "🚫 Limit reached! You can only edit a post once." };
  }

  // 2. Check Time Limit (15 mins)
  const postTime = new Date(post.timestamp).getTime();
  const now = Date.now();
  const timeDiff = now - postTime;
  const fifteenMinutes = 15 * 60 * 1000;

  // Server-side validation of the timer
  if (timeDiff > fifteenMinutes) {
    return { success: false, message: "⏳ Time's up! You can only edit posts within 15 minutes." };
  }

  // Update content
  posts[postIndex].content = newContent;
  posts[postIndex].editCount = currentEdits + 1; // Increment count
  
  await fs.writeFile(POSTS_DB_PATH, JSON.stringify(posts, null, 2));
  revalidatePath("/common-room");
  return { success: true };
}