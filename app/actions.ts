/**
 * file: app/actions.ts
 * description: Fixed build error by adding missing 'Reply' type definition.
 */

"use server";

import fs from "fs/promises";
import path from "path";
import os from "os"; // Required for temp dir
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
    message: "Excited to be working on this app. I hope you all enjoy it and come to use it daily 💪🏽",
    submittedAt: new Date().toISOString()
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
  const praiseWithDate = {
    ...newPraise,
    submittedAt: newPraise.submittedAt || new Date().toISOString()
  };
  const updatedPraises = [praiseWithDate, ...praises];
  await fs.writeFile(PRAISE_DB_PATH, JSON.stringify(updatedPraises, null, 2));
  revalidatePath("/"); 
  return updatedPraises;
}

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
  read?: boolean; 
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
  const feedbackWithStatus = { ...newFeedback, read: false };
  const updated = [feedbackWithStatus, ...list];
  await fs.writeFile(FEEDBACK_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/feedback");
  return updated;
}

export async function deleteFeedback(id: number) {
  const list = await getFeedback();
  const updated = list.filter(f => f.id !== id);
  await fs.writeFile(FEEDBACK_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/feedback");
  return updated;
}

export async function toggleFeedbackRead(id: number, isRead: boolean) {
  const list = await getFeedback();
  const updated = list.map(f => f.id === id ? { ...f, read: isRead } : f);
  await fs.writeFile(FEEDBACK_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/feedback");
  return updated;
}


// ============================================================================
// 3. USER SYSTEM
// ============================================================================

const USERS_DB_PATH = path.join(process.cwd(), "app", "users-db.json");

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  alias?: string; 
  dob?: string;
  role: string;
  phone: string;
  joinedAt: string;
  profilePic?: string;
};

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

export async function registerUser(formData: any): Promise<AuthResponse> {
  if (formData.doorCode !== "0129") {
    return { success: false, message: "❌ Incorrect Door Code. Access Denied." };
  }

  const newUser: User = {
    id: Date.now(),
    firstName: formData.firstName,
    lastName: formData.lastName,
    alias: formData.alias || "",
    dob: formData.dob, 
    role: formData.role,
    phone: formData.phone,
    profilePic: formData.profilePic || "",
    joinedAt: new Date().toISOString()
  };

  const users = await getUsers();
  const updatedUsers = [...users, newUser];
  await fs.writeFile(USERS_DB_PATH, JSON.stringify(updatedUsers, null, 2));
  
  revalidatePath("/mates");
  return { success: true, user: newUser };
}

export async function loginUser(phone: string, doorCode: string): Promise<AuthResponse> {
  if (doorCode !== "0129") {
    return { success: false, message: "❌ Incorrect Door Code." };
  }
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

// --- FIXED: ADDED REPLY TYPE ---
export type Reply = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
};

export type Post = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  editCount: number; 
  replies?: Reply[]; // Now 'Reply' is defined above
  image?: string;
  video?: string;
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
  // Initialize replies array
  const postWithDefaults = { 
    ...newPost, 
    editCount: 0,
    replies: [] 
  };
  
  const updated = [postWithDefaults, ...posts];
  await fs.writeFile(POSTS_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/common-room");
  return updated;
}

export async function editPost(postId: number, newContent: string) {
  const posts = await getPosts();
  const idx = posts.findIndex(p => p.id === postId);

  if (idx === -1) return { success: false, message: "Post not found" };
  if ((posts[idx].editCount || 0) >= 1) return { success: false, message: "Limit reached" };
  if ((Date.now() - new Date(posts[idx].timestamp).getTime()) > 15 * 60 * 1000) return { success: false, message: "Time's up" };

  posts[idx].content = newContent;
  posts[idx].editCount = (posts[idx].editCount || 0) + 1; 
  
  await fs.writeFile(POSTS_DB_PATH, JSON.stringify(posts, null, 2));
  revalidatePath("/common-room");
  return { success: true };
}

export async function deletePost(id: number) {
  const posts = await getPosts();
  const updated = posts.filter(p => p.id !== id);
  await fs.writeFile(POSTS_DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath("/common-room");
  return updated;
}

// --- FIXED: ADDED ADD REPLY ACTION ---
export async function addReply(postId: number, content: string, author: string) {
  const posts = await getPosts();
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) {
    return { success: false, message: "Post not found" };
  }

  const newReply: Reply = {
    id: Date.now(),
    author,
    content,
    timestamp: new Date().toISOString()
  };

  if (!posts[postIndex].replies) {
    posts[postIndex].replies = [];
  }

  posts[postIndex].replies?.push(newReply);

  await fs.writeFile(POSTS_DB_PATH, JSON.stringify(posts, null, 2));
  revalidatePath("/common-room");
  return { success: true, updatedPost: posts[postIndex] };
}


// ============================================================================
// 5. CHAT SYSTEM (FILE BASED - TEMP DIR)
// ============================================================================

const CHAT_DB_PATH = path.join(os.tmpdir(), "chat-db.json");

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
  
  const updatedChats = [...chats, newChat].slice(-100); 
  
  try {
    await fs.writeFile(CHAT_DB_PATH, JSON.stringify(updatedChats, null, 2));
  } catch (error) {
    console.error("Failed to write chat DB:", error);
  }
  
  return updatedChats;
}