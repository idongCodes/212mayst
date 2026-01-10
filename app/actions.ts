/**
 * file: app/actions.ts
 * description: Server actions for Praise, Feedback, Users (Auth), and Common Room Posts.
 */

"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

// ============================================================================
// 1. PRAISE SYSTEM
// ============================================================================

const PRAISE_DB_PATH = path.join(process.cwd(), "app", "praise-db.json");

export type Praise = {
  id: number;
  name: string;
  role: string;
  subject: string;
  message: string;
  submittedAt?: string;
};

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
    // If file doesn't exist, create it with seed data
    await fs.writeFile(PRAISE_DB_PATH, JSON.stringify(PRAISE_SEED_DATA, null, 2));
    return PRAISE_SEED_DATA;
  }
}

export async function addPraise(newPraise: Praise) {
  const praises = await getPraises();

  // Ensure timestamp is present
  const praiseWithDate = {
    ...newPraise,
    submittedAt: newPraise.submittedAt || new Date().toISOString()
  };

  const updatedPraises = [newPraise, ...praises];
  await fs.writeFile(PRAISE_DB_PATH, JSON.stringify(updatedPraises, null, 2));
  revalidatePath("/"); // Refresh Home page
  return updatedPraises;
}

// DELETE PRAISE (Admin)
export async function deletePraise(id: number) {
  const praises = await getPraises();
  const updated = praises.filter(p => p.id !== id);
  await fs.writeFile(PRAISE_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/");
  return updated;
}


// ============================================================================
// 2. FEEDBACK SYSTEM
// ============================================================================

const FEEDBACK_DB_PATH = path.join(process.cwd(), "app", "feedback-db.json");

export type Feedback = {
  id: number;
  name: string;
  role: string;
  subject: string;
  message: string;
  submittedAt: string;
  read?: boolean; // Track read status
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
  // Ensure new feedback starts as unread
  const feedbackWithStatus = { ...newFeedback, read: false };
  const updated = [feedbackWithStatus, ...list];
  await fs.writeFile(FEEDBACK_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/feedback");
  return updated;
}

// DELETE FEEDBACK (Admin)
export async function deleteFeedback(id: number) {
  const list = await getFeedback();
  const updated = list.filter(f => f.id !== id);
  await fs.writeFile(FEEDBACK_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/feedback");
  return updated;
}

// TOGGLE READ STATUS (Admin)
export async function toggleFeedbackRead(id: number, isRead: boolean) {
  const list = await getFeedback();
  const updated = list.map(f => f.id === id ? { ...f, read: isRead } : f);
  await fs.writeFile(FEEDBACK_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/feedback");
  return updated;
}


// ============================================================================
// 3. USER SYSTEM (AUTH & REGISTRATION)
// ============================================================================

const USERS_DB_PATH = path.join(process.cwd(), "app", "users-db.json");

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  alias?: string; // Optional alias
  dob?: string;
  role: string;
  phone: string;
  joinedAt: string;
};

// Response type for Auth actions
type AuthResponse = {
  success: boolean;
  message?: string;
  user?: User;
};

export async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// REGISTER Action
export async function registerUser(formData: any): Promise<AuthResponse> {
  // 1. SECURITY CHECK: Verify Door Code
  if (formData.doorCode !== "0129") {
    return { success: false, message: "❌ Incorrect Door Code. Access Denied." };
  }

  // 2. Prepare User Data
  const newUser: User = {
    id: Date.now(),
    firstName: formData.firstName,
    lastName: formData.lastName,
    alias: formData.alias || "",
    dob: formData.dob, 
    role: formData.role,
    phone: formData.phone,
    joinedAt: new Date().toISOString()
  };

  // 3. Save to DB
  const users = await getUsers();
  const updatedUsers = [...users, newUser];
  await fs.writeFile(USERS_DB_PATH, JSON.stringify(updatedUsers, null, 2));
  
  revalidatePath("/mates");
  return { success: true, user: newUser };
}

// LOGIN Action
export async function loginUser(phone: string, doorCode: string): Promise<AuthResponse> {
  // 1. Verify Door Code
  if (doorCode !== "0129") {
    return { success: false, message: "❌ Incorrect Door Code." };
  }

  // 2. Find User by Phone
  const users = await getUsers();
  const user = users.find(u => u.phone === phone);

  if (!user) {
    return { success: false, message: "User not found. Check phone number or join first." };
  }

  return { success: true, user };
}


// ============================================================================
// 4. COMMON ROOM POSTS SYSTEM
// ============================================================================

const POSTS_DB_PATH = path.join(process.cwd(), "app", "posts-db.json");

export type Post = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  editCount: number; // Tracks number of edits (Limit: 1)
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
  
  // Enforce initial state
  const postWithDefaults = { 
    ...newPost, 
    editCount: 0 
  };
  
  const updated = [postWithDefaults, ...posts];
  await fs.writeFile(POSTS_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/common-room");
  return updated;
}

export async function editPost(postId: number, newContent: string) {
  const posts = await getPosts();
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) {
    return { success: false, message: "Post not found" };
  }

  const post = posts[postIndex];
  
  // CHECK 1: Edit Count Limit (Max 1)
  const currentEdits = post.editCount || 0;
  if (currentEdits >= 1) {
    return { success: false, message: "🚫 Limit reached! You can only edit a post once." };
  }

  // CHECK 2: Time Limit (15 mins)
  const postTime = new Date(post.timestamp).getTime();
  const now = Date.now();
  const fifteenMinutes = 15 * 60 * 1000;

  if ((now - postTime) > fifteenMinutes) {
    return { success: false, message: "⏳ Time's up! You can only edit posts within 15 minutes." };
  }

  // Apply Update
  posts[postIndex].content = newContent;
  posts[postIndex].editCount = currentEdits + 1; 
  
  await fs.writeFile(POSTS_DB_PATH, JSON.stringify(posts, null, 2));
  revalidatePath("/common-room");
  return { success: true };
}

// DELETE POST (Admin)
export async function deletePost(id: number) {
  const posts = await getPosts();
  const updated = posts.filter(p => p.id !== id);
  await fs.writeFile(POSTS_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/common-room");
  return updated;
}

// ============================================================================
// 5. CHAT SYSTEM (NEW)
// ============================================================================

const CHAT_DB_PATH = path.join(process.cwd(), "app", "chat-db.json");

export type ChatMessage = {
  id: number;
  author: string;
  text: string;
  timestamp: string;
};

export async function getChats(): Promise<ChatMessage[]> {
  try {
    const data = await fs.readFile(CHAT_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, start empty
    return [];
  }
}

export async function addChat(text: string, author: string) {
  const chats = await getChats();
  const newChat: ChatMessage = {
    id: Date.now(),
    author,
    text,
    timestamp: new Date().toISOString()
  };
  
  // Keep only last 100 messages to prevent file from getting too huge
  const updatedChats = [...chats, newChat].slice(-100); 
  
  await fs.writeFile(CHAT_DB_PATH, JSON.stringify(updatedChats, null, 2));
  // No revalidatePath needed since we poll/refresh client-side for chat
  return updatedChats;
}