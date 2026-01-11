// file: app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "./lib/supabaseClient";

// --- HELPER: PHONE NORMALIZATION ---
function normalizePhone(input: string): string {
  const cleaned = input.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.substring(1);
  }
  return cleaned;
}

// --- HELPER: VERIFY ADMIN STATUS ---
async function verifyAdmin(phone: string): Promise<boolean> {
  if (!phone) return false;
  const cleanPhone = normalizePhone(phone);
  
  const { data: user } = await supabase
    .from('users')
    .select('is_admin')
    .eq('phone', cleanPhone)
    .single();
    
  return user?.is_admin === true;
}

// ============================================================================
// 1. PRAISE (TESTIMONIALS) SYSTEM
// ============================================================================

export type Praise = {
  id: number;
  name: string;
  role: string;
  subject: string;
  message: string;
  submittedAt?: string;
  userImage?: string | null; // Added this field
};

export async function getPraises(): Promise<Praise[]> {
  // We explicitly select user_image here
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
    submittedAt: p.submitted_at,
    userImage: p.user_image // Map the DB column 'user_image' to our code 'userImage'
  }));
}

export async function addPraise(newPraise: Praise) {
  const { error } = await supabase.from('praises').insert({
    // If your DB autoincrements ID, you can remove 'id' here, 
    // otherwise keep it if you generate it on the frontend.
    id: newPraise.id, 
    name: newPraise.name,
    role: newPraise.role,
    subject: newPraise.subject,
    message: newPraise.message,
    submitted_at: newPraise.submittedAt || new Date().toISOString(),
    user_image: newPraise.userImage || null // Save the image URL to Supabase
  });

  if (error) console.error("Supabase error (addPraise):", error);
  revalidatePath("/");
  return getPraises();
}

// --- ADMIN EDIT PRAISE ---
export async function editPraise(id: number, newSubject: string, newMessage: string, requestorPhone: string) {
  const isAdmin = await verifyAdmin(requestorPhone);
  if (!isAdmin) return { success: false, message: "🚫 Unauthorized: Admins only." };

  const { error } = await supabase
    .from('praises')
    .update({ 
      subject: newSubject,
      message: newMessage
    })
    .eq('id', id);

  if (error) return { success: false, message: "Failed to edit testimonial." };
  revalidatePath("/");
  return { success: true };
}

// --- ADMIN DELETE PRAISE ---
export async function deletePraise(id: number, requestorPhone: string) {
  const isAdmin = await verifyAdmin(requestorPhone);
  if (!isAdmin) return { success: false, message: "🚫 Unauthorized: Admins only." };

  const { error } = await supabase.from('praises').delete().eq('id', id);
  if (error) return { success: false, message: "Database error." };
  revalidatePath("/");
  return { success: true };
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

  if (error) return [];

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
  isAdmin: boolean;
};

type AuthResponse = {
  success: boolean;
  message?: string;
  user?: User;
};

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return [];

  return data.map((u: any) => ({
    id: Number(u.id),
    firstName: u.first_name,
    lastName: u.last_name,
    alias: u.alias,
    dob: u.dob,
    role: u.role,
    phone: u.phone,
    profilePic: u.profile_pic,
    joinedAt: u.joined_at,
    isAdmin: u.is_admin || false
  }));
}

export async function registerUser(formData: any): Promise<AuthResponse> {
  const CORRECT_CODE = process.env.DOOR_CODE || "0129";

  if (formData.doorCode !== CORRECT_CODE) {
    return { success: false, message: "❌ Incorrect Door Code. Access Denied." };
  }

  const cleanPhone = normalizePhone(formData.phone);

  const newUser = {
    // id: Date.now(), // Supabase usually handles IDs automatically. Uncomment if needed.
    first_name: formData.firstName,
    last_name: formData.lastName,
    alias: formData.alias || "",
    dob: formData.dob, 
    role: formData.role,
    phone: cleanPhone,
    profile_pic: formData.profilePic || "",
    joined_at: new Date().toISOString(),
    is_admin: false
  };

  const { error, data } = await supabase.from('users').insert(newUser).select().single();

  if (error) {
    if (error.code === '23505') return { success: false, message: "Phone number already registered." };
    return { success: false, message: "Registration failed." };
  }
  
  revalidatePath("/mates");
  
  // Return the newly created user (with the ID assigned by Supabase if applicable)
  const createdUser = data || newUser;

  return { 
    success: true, 
    user: {
      id: Number(createdUser.id),
      firstName: createdUser.first_name,
      lastName: createdUser.last_name,
      alias: createdUser.alias,
      dob: createdUser.dob,
      role: createdUser.role,
      phone: createdUser.phone,
      profilePic: createdUser.profile_pic,
      joinedAt: createdUser.joined_at,
      isAdmin: false
    } 
  };
}

export async function loginUser(phone: string, doorCode: string): Promise<AuthResponse> {
  const CORRECT_CODE = process.env.DOOR_CODE || "0129";

  if (doorCode !== CORRECT_CODE) {
    return { success: false, message: "❌ Incorrect Door Code." };
  }

  const cleanPhone = normalizePhone(phone);

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', cleanPhone) 
    .single();

  if (error || !data) {
    return { success: false, message: "User not found. Check phone number or join first." };
  }

  return { 
    success: true, 
    user: {
      id: Number(data.id),
      firstName: data.first_name,
      lastName: data.last_name,
      alias: data.alias,
      dob: data.dob,
      role: data.role,
      phone: data.phone,
      profilePic: data.profile_pic,
      joinedAt: data.joined_at,
      isAdmin: data.is_admin || false
    }
  };
}


// ============================================================================
// 4. COMMON ROOM POSTS SYSTEM
// ============================================================================

export type Reply = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  editCount: number;
  authorProfilePic?: string; 
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
  authorProfilePic?: string;
};

export async function getPosts(): Promise<Post[]> {
  // 1. Fetch Posts and Replies
  const { data: postsData, error } = await supabase
    .from('posts')
    .select(`
      *,
      replies (*)
    `)
    .order('timestamp', { ascending: false });

  if (error) return [];

  // 2. Fetch Users to map Profile Pics
  const { data: users } = await supabase
    .from('users')
    .select('first_name, alias, profile_pic');

  // 3. Create a lookup map: "Name/Alias" -> "ProfilePicURL"
  const userMap: Record<string, string> = {};
  if (users) {
    users.forEach((u: any) => {
      if (u.alias) userMap[u.alias] = u.profile_pic;
      if (u.first_name) userMap[u.first_name] = u.profile_pic;
    });
  }

  // 4. Map posts and attach profile pics
  return postsData.map((p: any) => ({
    id: Number(p.id),
    author: p.author,
    content: p.content,
    timestamp: p.timestamp,
    image: p.image_url,
    video: p.video_url,
    editCount: p.edit_count || 0,
    authorProfilePic: userMap[p.author] || undefined, 
    replies: (p.replies || []).map((r: any) => ({
      id: Number(r.id),
      author: r.author,
      content: r.content,
      timestamp: r.timestamp,
      editCount: r.edit_count || 0,
      authorProfilePic: userMap[r.author] || undefined 
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
    video_url: newPost.video || null,
    edit_count: 0
  });

  if (error) console.error("Supabase error (addPost):", error);
  revalidatePath("/common-room");
  return getPosts();
}

export async function addReply(postId: number, content: string, author: string) {
  const newReply = {
    // id: Date.now(), // Uncomment if you are generating IDs manually
    post_id: postId,
    author: author,
    content: content,
    timestamp: new Date().toISOString(),
    edit_count: 0
  };

  const { error } = await supabase.from('replies').insert(newReply);
  if (error) return { success: false, message: "Failed to reply" };

  revalidatePath("/common-room");
  return { success: true };
}

// --- EDIT REPLY ---
export async function editReply(replyId: number, newContent: string, requestorPhone: string) {
  const { data: user } = await supabase.from('users').select('*').eq('phone', normalizePhone(requestorPhone)).single();
  if (!user) return { success: false, message: "User verification failed" };

  const { data: reply } = await supabase.from('replies').select('*').eq('id', replyId).single();
  if (!reply) return { success: false, message: "Reply not found" };

  const isAdmin = user.is_admin === true;
  
  if (!isAdmin) {
    if (reply.author !== user.alias && reply.author !== user.first_name) {
       return { success: false, message: "Unauthorized" }; 
    }
    if ((reply.edit_count || 0) >= 1) return { success: false, message: "Limit reached: You can only edit once." };
    const replyTime = new Date(reply.timestamp).getTime();
    if ((Date.now() - replyTime) > 15 * 60 * 1000) return { success: false, message: "Time's up: Only editable for 15 mins." };
  }

  const { error } = await supabase
    .from('replies')
    .update({ 
      content: newContent,
      edit_count: (reply.edit_count || 0) + 1
    })
    .eq('id', replyId);

  if (error) return { success: false, message: "Failed to edit reply" };
  revalidatePath("/common-room");
  return { success: true };
}

// --- EDIT POST ---
export async function editPost(postId: number, newContent: string, requestorPhone: string) {
  const { data: user } = await supabase.from('users').select('*').eq('phone', normalizePhone(requestorPhone)).single();
  if (!user) return { success: false, message: "User verification failed" };

  const { data: post } = await supabase.from('posts').select('*').eq('id', postId).single();
  if (!post) return { success: false, message: "Post not found" };

  const isAdmin = user.is_admin === true;

  if (!isAdmin) {
    if (post.author !== user.alias && post.author !== user.first_name) {
      return { success: false, message: "Unauthorized" };
    }
    if ((post.edit_count || 0) >= 1) return { success: false, message: "Limit reached: You can only edit once." };
    const postTime = new Date(post.timestamp).getTime();
    if ((Date.now() - postTime) > 15 * 60 * 1000) return { success: false, message: "Time's up: Only editable for 15 mins." }; 
  }

  const { error } = await supabase
    .from('posts')
    .update({ 
      content: newContent,
      edit_count: (post.edit_count || 0) + 1
    })
    .eq('id', postId);

  if (error) return { success: false, message: "Failed to edit" };
  revalidatePath("/common-room");
  return { success: true };
}

// --- DELETE POST ---
export async function deletePost(id: number, requestorPhone: string) {
  const { data: user } = await supabase.from('users').select('*').eq('phone', normalizePhone(requestorPhone)).single();
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single();
  
  if (!post || !user) return { success: false, message: "Not found" };

  const isAdmin = user.is_admin === true;
  const isAuthor = (post.author === user.alias) || (post.author === user.first_name);
  
  if (isAdmin) {
    // Admin Allowed
  } else if (isAuthor) {
    const postTime = new Date(post.timestamp).getTime();
    if ((Date.now() - postTime) > 10 * 60 * 1000) {
      return { success: false, message: "⏳ Too late! You can only delete within 10 minutes." };
    }
  } else {
    return { success: false, message: "🚫 Unauthorized." };
  }

  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) return { success: false, message: "Database error." };
  revalidatePath("/common-room");
  return { success: true };
}

// --- DELETE REPLY ---
export async function deleteReply(id: number, requestorPhone: string) {
  const { data: user } = await supabase.from('users').select('*').eq('phone', normalizePhone(requestorPhone)).single();
  const { data: reply } = await supabase.from('replies').select('*').eq('id', id).single();
  
  if (!reply || !user) return { success: false, message: "Not found" };

  const isAdmin = user.is_admin === true;
  const isAuthor = (reply.author === user.alias) || (reply.author === user.first_name);

  if (isAdmin) {
     // Allowed
  } else if (isAuthor) {
    const replyTime = new Date(reply.timestamp).getTime();
    if ((Date.now() - replyTime) > 10 * 60 * 1000) {
      return { success: false, message: "⏳ Too late! You can only delete within 10 minutes." };
    }
  } else {
    return { success: false, message: "🚫 Unauthorized." };
  }

  const { error } = await supabase.from('replies').delete().eq('id', id);
  if (error) return { success: false, message: "Database error." };

  revalidatePath("/common-room");
  return { success: true };
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
    // id: Date.now(),
    author,
    text,
    timestamp: new Date().toISOString()
  };

  await supabase.from('chats').insert(newChat);
  return getChats();
}