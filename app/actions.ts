/**
 * file: app/actions.ts
 * description: Replaced local JSON storage with Supabase Database operations.
 */

"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "./lib/supabaseClient";

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

  // Map DB snake_case to Frontend camelCase
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
    // Let DB handle ID and Timestamp automatically if possible, or pass them
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
  if (formData.doorCode !== "0129") {
    return { success: false, message: "❌ Incorrect Door Code. Access Denied." };
  }

  const newUser = {
    id: Date.now(), // Or let DB handle it
    first_name: formData.firstName,
    last_name: formData.lastName,
    alias: formData.alias || "",
    dob: formData.dob, 
    role: formData.role,
    phone: formData.phone,
    profile_pic: formData.profilePic || "",
    joined_at: new Date().toISOString()
  };

  const { error } = await supabase.from('users').insert(newUser);

  if (error) {
    console.error("Register Error:", error);
    return { success: false, message: "Registration failed. Phone might be taken." };
  }
  
  revalidatePath("/mates");
  
  // Return the user object formatted for frontend
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
  if (doorCode !== "0129") {
    return { success: false, message: "❌ Incorrect Door Code." };
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error || !data) {
    return { success: false, message: "User not found. Check phone number or join first." };
  }

  // Map back to frontend User type
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
  // Fetch Posts AND their Replies using relation
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      replies (*)
    `)
    .order('timestamp', { ascending: false }); // Newest posts first

  if (error) {
    console.error("Supabase error (getPosts):", error);
    return [];
  }

  // Transform data
  return data.map((p: any) => ({
    id: Number(p.id),
    author: p.author,
    content: p.content,
    timestamp: p.timestamp,
    image: p.image_url, // Map from DB column
    video: p.video_url, // Map from DB column
    editCount: 0, // Simplified for now
    // Sort replies oldest to newest
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
    image_url: newPost.image || null, // Map to DB column
    video_url: newPost.video || null  // Map to DB column
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
  // We can add validation logic here if needed (time checks etc)
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
  // We don't return the list here, the UI will likely refresh via revalidatePath or optimistic update
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
    .order('timestamp', { ascending: true }) // Oldest first
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
  
  // Return the full list to update local state if using polling
  return getChats();
}