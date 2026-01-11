/**
 * file: app/actions.ts
 * description: Added phone number normalization to Register and Login actions.
 */

"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "./lib/supabaseClient";

// ============================================================================
// HELPER: PHONE NORMALIZATION
// ============================================================================
function normalizePhone(input: string): string {
  // 1. Remove all non-numeric characters
  const cleaned = input.replace(/\D/g, '');

  // 2. Handle US/Canada country codes (11 digits starting with 1)
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.substring(1);
  }

  return cleaned;
}

// ============================================================================
// 1. PRAISE SYSTEM
// ============================================================================

export type Praise = {
  id: number;
  name: string;
  role: string;
  subject: string;
  message: string;
  submittedAt?: string;
};

export async function getPraises(): Promise<Praise[]> {
  const { data, error } = await supabase
    .from('praises')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error("Supabase error (getPraises):", error);
    return [];
  }

  return data.map((p: any) => ({
    id: Number(p.id),
    name: p.name,
    role: p.role,
    subject: p.subject,
    message: p.message,
    submittedAt: p.submitted_at
  }));
}

export async function addPraise(newPraise: Praise) {
  const { error } = await supabase.from('praises').insert({
    id: newPraise.id, 
    name: newPraise.name,
    role: newPraise.role,
    subject: newPraise.subject,
    message: newPraise.message,
    submitted_at: newPraise.submittedAt || new Date().toISOString()
  });

  if (error) console.error("Supabase error (addPraise):", error);
  revalidatePath("/");
  return getPraises();
}

export async function deletePraise(id: number) {
  const { error } = await supabase.from('praises').delete().eq('id', id);
  if (error) console.error("Supabase error (deletePraise):", error);
  revalidatePath("/");
  return getPraises();
}


// ============================================================================
// 2. FEEDBACK SYSTEM
// ============================================================================

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
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error("Supabase error (getFeedback):", error);
    return [];
  }

  return data.map((f: any) => ({
    id: Number(f.id),
    name: f.name,
    role: f.role,
    subject: f.subject,
    message: f.message,
    read: f.read,
    submittedAt: f.submitted_at
  }));
}

export async function addFeedback(newFeedback: Feedback) {
  const { error } = await supabase.from('feedback').insert({
    id: newFeedback.id,
    name: newFeedback.name,
    role: newFeedback.role,
    subject: newFeedback.subject,
    message: newFeedback.message,
    read: false,
    submitted_at: newFeedback.submittedAt
  });

  if (error) console.error("Supabase error (addFeedback):", error);
  revalidatePath("/feedback");
  return getFeedback();
}

export async function deleteFeedback(id: number) {
  const { error } = await supabase.from('feedback').delete().eq('id', id);
  if (error) console.error("Supabase error (deleteFeedback):", error);
  revalidatePath("/feedback");
  return getFeedback();
}

export async function toggleFeedbackRead(id: number, isRead: boolean) {
  const { error } = await supabase.from('feedback').update({ read: isRead }).eq('id', id);
  if (error) console.error("Supabase error (toggleFeedbackRead):", error);
  revalidatePath("/feedback");
  return getFeedback();
}


// ============================================================================
// 3. USER SYSTEM
// ============================================================================

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
  const { data, error } = await supabase.from('users').select('*');
  
  if (error) {
    console.error("Supabase error (getUsers):", error);
    return [];
  }

  return data.map((u: any) => ({
    id: Number(u.id),
    firstName: u.first_name,
    lastName: u.last_name,
    alias: u.alias,
    dob: u.dob,
    role: u.role,
    phone: u.phone,
    profilePic: u.profile_pic,
    joinedAt: u.joined_at
  }));
}

export async function registerUser(formData: any): Promise<AuthResponse> {
  const CORRECT_CODE = process.env.DOOR_CODE || "0129";

  if (formData.doorCode !== CORRECT_CODE) {
    return { success: false, message: "❌ Incorrect Door Code. Access Denied." };
  }

  // NORMALIZE PHONE
  const cleanPhone = normalizePhone(formData.phone);

  const newUser = {
    id: Date.now(),
    first_name: formData.firstName,
    last_name: formData.lastName,
    alias: formData.alias || "",
    dob: formData.dob, 
    role: formData.role,
    phone: cleanPhone, // Save normalized phone
    profile_pic: formData.profilePic || "",
    joined_at: new Date().toISOString()
  };

  const { error } = await supabase.from('users').insert(newUser);

  if (error) {
    console.error("Register Error:", error);
    // Handle Unique Constraint Violation (P2002 equivalent in Supabase)
    if (error.code === '23505') {
       return { success: false, message: "This phone number is already registered." };
    }
    return { success: false, message: "Registration failed." };
  }
  
  revalidatePath("/mates");
  
  return { 
    success: true, 
    user: {
      id: Number(newUser.id),
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      alias: newUser.alias,
      dob: newUser.dob,
      role: newUser.role,
      phone: newUser.phone,
      profilePic: newUser.profile_pic,
      joinedAt: newUser.joined_at
    } 
  };
}

export async function loginUser(phone: string, doorCode: string): Promise<AuthResponse> {
  const CORRECT_CODE = process.env.DOOR_CODE || "0129";

  if (doorCode !== CORRECT_CODE) {
    return { success: false, message: "❌ Incorrect Door Code." };
  }

  // NORMALIZE PHONE
  const cleanPhone = normalizePhone(phone);

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', cleanPhone) // Check against normalized DB value
    .single();

  if (error || !data) {
    return { success: false, message: "User not found. Check phone number or join first." };
  }

  const user: User = {
    id: Number(data.id),
    firstName: data.first_name,
    lastName: data.last_name,
    alias: data.alias,
    dob: data.dob,
    role: data.role,
    phone: data.phone,
    profilePic: data.profile_pic,
    joinedAt: data.joined_at
  };

  return { success: true, user };
}


// ============================================================================
// 4. COMMON ROOM POSTS SYSTEM
// ============================================================================

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
  replies?: Reply[];
  image?: string; 
  video?: string; 
};

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      replies (*)
    `)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error("Supabase error (getPosts):", error);
    return [];
  }

  return data.map((p: any) => ({
    id: Number(p.id),
    author: p.author,
    content: p.content,
    timestamp: p.timestamp,
    image: p.image_url,
    video: p.video_url,
    editCount: 0,
    replies: (p.replies || []).map((r: any) => ({
      id: Number(r.id),
      author: r.author,
      content: r.content,
      timestamp: r.timestamp
    })).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }));
}

export async function addPost(newPost: Post) {
  const { error } = await supabase.from('posts').insert({
    id: newPost.id,
    author: newPost.author,
    content: newPost.content,
    timestamp: newPost.timestamp,
    image_url: newPost.image || null,
    video_url: newPost.video || null
  });

  if (error) console.error("Supabase error (addPost):", error);
  revalidatePath("/common-room");
  return getPosts();
}

export async function addReply(postId: number, content: string, author: string) {
  const newReply = {
    id: Date.now(),
    post_id: postId,
    author: author,
    content: content,
    timestamp: new Date().toISOString()
  };

  const { error } = await supabase.from('replies').insert(newReply);

  if (error) {
    console.error("Supabase error (addReply):", error);
    return { success: false, message: "Failed to reply" };
  }

  revalidatePath("/common-room");
  return { success: true };
}

export async function editPost(postId: number, newContent: string) {
  const { error } = await supabase
    .from('posts')
    .update({ content: newContent })
    .eq('id', postId);

  if (error) return { success: false, message: "Failed to edit" };
  revalidatePath("/common-room");
  return { success: true };
}

export async function deletePost(id: number) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) console.error("Supabase error (deletePost):", error);
  revalidatePath("/common-room");
  return []; 
}


// ============================================================================
// 5. CHAT SYSTEM
// ============================================================================

export type ChatMessage = {
  id: number;
  author: string;
  text: string;
  timestamp: string;
};

export async function getChats(): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .order('timestamp', { ascending: true }) 
    .limit(100);

  if (error) return [];

  return data.map((c: any) => ({
    id: Number(c.id),
    author: c.author,
    text: c.text,
    timestamp: c.timestamp
  }));
}

export async function addChat(text: string, author: string) {
  const newChat = {
    id: Date.now(),
    author,
    text,
    timestamp: new Date().toISOString()
  };

  await supabase.from('chats').insert(newChat);
  return getChats();
}