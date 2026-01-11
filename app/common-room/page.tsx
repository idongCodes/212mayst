/**
 * file: app/common-room/page.tsx
 * description: UI passes User Phone to actions for secure Admin/Permission verification.
 */

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Camera, Image as ImageIcon, Video, Smile, User, Pencil, X, Check, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import { addPost, getPosts, editPost, deletePost, addReply, editReply, deleteReply, Post, Reply } from '../actions';
import { supabase } from '../lib/supabaseClient'; 
import Link from 'next/link';

const COMMON_EMOJIS = ["😀", "😂", "😍", "🥳", "😎", "😭", "😡", "🤔", "👍", "👎", "🔥", "❤️", "✨", "🎉", "🏠", "🍺", "🍕", "🌮", "👀", "🚀", "💡", "💪", "😴", "👋", "💯", "🙌", "💀", "💩", "🦄", "🌈", "🎈", "🎁"];
const MAX_CHARS = 250;
const MAX_FILE_SIZE_MB = 200;
const MAX_VIDEO_DURATION_SEC = 30;

export default function CommonRoom() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(""); 
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaError, setMediaError] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [saveReplyLoading, setSaveReplyLoading] = useState(false);

  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(false);
  
  const [authorName, setAuthorName] = useState("Guest");
  const [userPhone, setUserPhone] = useState(""); // <--- Store Phone for API calls
  const [isGuest, setIsGuest] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); 

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await getPosts();
      setPosts(data);
    };
    loadPosts();

    const storedUser = sessionStorage.getItem('212user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuthorName(user.alias || user.firstName);
      setUserPhone(user.phone); // <--- Capture Phone
      setIsGuest(false);
      
      // Admin Check via Session Flag (Mapped from DB)
      if (user.isAdmin) {
        setIsAdmin(true);
      }
    }
  }, []);

  useEffect(() => { if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; } }, [message]);
  useEffect(() => { if (replyTextareaRef.current) { replyTextareaRef.current.style.height = 'auto'; replyTextareaRef.current.style.height = `${replyTextareaRef.current.scrollHeight}px`; } }, [replyText, replyingToId]);
  useEffect(() => { if (editingId && editInputRef.current) editInputRef.current.focus(); }, [editingId]);

  const handleCameraClick = () => cameraInputRef.current?.click();
  const handleUploadClick = () => uploadInputRef.current?.click();
  const handleVideoClick = () => videoInputRef.current?.click();
  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaError("");
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) { setMediaError(`File too large (${fileSizeMB.toFixed(1)}MB). Max limit is ${MAX_FILE_SIZE_MB}MB.`); e.target.value = ""; return; }
    if (type === 'video') {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = () => { URL.revokeObjectURL(videoElement.src); if (videoElement.duration > MAX_VIDEO_DURATION_SEC + 1) { setMediaError(`Video too long (${Math.round(videoElement.duration)}s). Max ${MAX_VIDEO_DURATION_SEC} seconds.`); e.target.value = ""; return; } else { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); setMediaType('video'); } };
    } else { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); setMediaType('image'); }
  };

  const handlePostSubmit = async () => {
    if (!message.trim() && !selectedFile) return;
    setLoading(true);
    let mediaUrl = "";
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `posts/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, selectedFile);
      if (uploadError) { alert("Upload failed: " + uploadError.message); setLoading(false); return; }
      const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
      mediaUrl = data.publicUrl;
    }
    const newPost: Post = { id: Date.now(), author: authorName, content: message.trim(), timestamp: new Date().toISOString(), editCount: 0, replies: [], image: mediaType === 'image' ? mediaUrl : undefined, video: mediaType === 'video' ? mediaUrl : undefined };
    setPosts([newPost, ...posts]);
    setMessage(""); setSelectedFile(null); setPreviewUrl(""); setMediaType(null); setMediaError(""); setShowEmojiPicker(false);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await addPost(newPost);
    setLoading(false);
  };

  const handleEmojiClick = (emoji: string) => { if (message.length + emoji.length <= MAX_CHARS) setMessage(prev => prev + emoji); };
  const handleReplyEmojiClick = (emoji: string) => { if (replyText.length + emoji.length <= MAX_CHARS) setReplyText(prev => prev + emoji); };
  const handleReplySubmit = async (postId: number) => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    const newReply = { id: Date.now(), author: authorName, content: replyText.trim(), timestamp: new Date().toISOString(), editCount: 0 };
    const updatedPosts = posts.map(p => { if (p.id === postId) { return { ...p, replies: [...(p.replies || []), newReply] }; } return p; });
    setPosts(updatedPosts);
    setReplyText(""); setReplyingToId(null); setShowReplyEmojiPicker(false);
    await addReply(postId, newReply.content, authorName);
    setReplyLoading(false);
  };

  // --- PERMISSION CHECKS ---
  const isEditable = (item: Post | Reply) => {
    if (isAdmin) return true; // Admin/Self always editable if using phone check on server
    if (item.author === authorName) {
      if ((item.editCount || 0) >= 1) return false;
      return (Date.now() - new Date(item.timestamp).getTime()) < 15 * 60 * 1000;
    }
    return false;
  };

  const isDeletable = (item: Post | Reply) => {
    if (isAdmin) return true; 
    if (item.author !== authorName) return false;
    return (Date.now() - new Date(item.timestamp).getTime()) < 10 * 60 * 1000;
  };

  // --- ACTIONS (Pass userPhone) ---
  const startEditing = (post: Post) => { setEditingId(post.id); setEditText(post.content); setReplyingToId(null); setEditingReplyId(null); };
  const cancelEditing = () => { setEditingId(null); setEditText(""); };
  const saveEdit = async () => { 
    if (!editingId || !editText.trim()) return; 
    setSaveLoading(true); 
    // Pass userPhone for server verification
    const result = await editPost(editingId, editText.trim(), userPhone); 
    if (result.success) { setPosts(posts.map(p => p.id === editingId ? { ...p, content: editText.trim(), editCount: (p.editCount || 0) + 1 } : p)); setEditingId(null); setEditText(""); } else { alert(result.message); setEditingId(null); } setSaveLoading(false); 
  };
  
  const startEditingReply = (reply: Reply) => { setEditingReplyId(reply.id); setEditReplyText(reply.content); setEditingId(null); };
  const cancelEditingReply = () => { setEditingReplyId(null); setEditReplyText(""); };
  const saveReplyEdit = async () => { 
    if (!editingReplyId || !editReplyText.trim()) return; 
    setSaveReplyLoading(true); 
    const result = await editReply(editingReplyId, editReplyText.trim(), userPhone); 
    if (result.success) { setPosts(posts.map(p => ({ ...p, replies: p.replies?.map(r => r.id === editingReplyId ? { ...r, content: editReplyText.trim(), editCount: (r.editCount || 0) + 1 } : r) }))); setEditingReplyId(null); setEditReplyText(""); } else { alert(result.message); setEditingReplyId(null); } setSaveReplyLoading(false); 
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Delete post?")) return;
    setPosts(posts.filter(p => p.id !== id));
    // Pass userPhone for server verification
    const result = await deletePost(id, userPhone);
    if (!result.success) { alert(result.message); const data = await getPosts(); setPosts(data); }
  };

  const handleDeleteReply = async (id: number, postId: number) => {
    if (!confirm("Delete reply?")) return;
    setPosts(posts.map(p => p.id === postId ? { ...p, replies: p.replies?.filter(r => r.id !== id) } : p));
    const result = await deleteReply(id, userPhone);
    if (!result.success) { alert(result.message); const data = await getPosts(); setPosts(data); }
  };

  const formatDate = (isoString: string) => { const date = new Date(isoString); return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ', ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePostSubmit(); } };
  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, postId: number) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReplySubmit(postId); } };

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--sandy-brown)', marginBottom: '1rem' }}>{isGuest ? "Welcome to the Common Room" : `Welcome, ${authorName}`}</h1>
          {isGuest ? <p style={{ color: 'gray' }}>You are viewing as a guest. <Link href="/join" style={{ textDecoration: 'underline', color: 'var(--sky-blue)', fontWeight: 'bold' }}>Join the house</Link> to post with your name!</p> : <p style={{ color: 'gray' }}>This is where we hang out. Pull up a chair!</p>}
        </div>

        {/* Input Area */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <textarea ref={textareaRef} placeholder={`What's on your mind, ${authorName}?`} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} maxLength={MAX_CHARS} rows={1} style={{ width: '100%', padding: '12px 40px 12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', backgroundColor: '#f8fafc', outline: 'none', resize: 'none', overflow: 'hidden', minHeight: '48px', fontFamily: 'inherit', lineHeight: '1.5' }} />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: message.length >= MAX_CHARS ? '#ef4444' : '#94a3b8', marginTop: '4px', paddingRight: '5px' }}>{message.length}/{MAX_CHARS}</div>
              {previewUrl && ( <div className="animate-fade-in" style={{ marginTop: '10px', position: 'relative', width: 'fit-content' }}> {mediaType === 'image' ? ( <img src={previewUrl} alt="Preview" style={{ maxHeight: '150px', borderRadius: '12px', border: '2px solid #e2e8f0' }} /> ) : ( <video src={previewUrl} controls style={{ maxHeight: '200px', borderRadius: '12px', border: '2px solid #e2e8f0' }} /> )} <button onClick={() => { setSelectedFile(null); setPreviewUrl(""); setMediaType(null); }} style={{ position: 'absolute', top: -8, right: -8, backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', border: '2px solid white', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}><X size={14} /></button> </div> )}
              {mediaError && <div className="animate-slide-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', color: '#ef4444', fontSize: '0.85rem' }}><AlertCircle size={14} /> {mediaError}</div>}
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ position: 'absolute', right: '10px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 }}><Smile size={20} /></button>
              {showEmojiPicker && ( <div style={{ position: 'absolute', top: '110%', right: 0, zIndex: 50, backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(35px, 1fr))', gap: '5px', width: '100%', minWidth: '250px', maxWidth: '300px', maxHeight: '200px', overflowY: 'auto' }}>{COMMON_EMOJIS.map((emoji) => <button key={emoji} onClick={() => handleEmojiClick(emoji)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '5px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{emoji}</button>)}</div> )}
            </div>
            <button onClick={handlePostSubmit} disabled={loading || (!message.trim() && !selectedFile)} style={{ backgroundColor: 'var(--sandy-brown)', color: 'white', border: 'none', padding: '0 20px', height: '48px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', opacity: loading || (!message.trim() && !selectedFile) ? 0.7 : 1, alignSelf: 'flex-start' }}>{loading ? '...' : 'Post'} <Send size={18} /></button>
          </div>
          <div style={{ display: 'flex', gap: '20px', paddingLeft: '5px' }}>
            <div onClick={handleCameraClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }} title="Take Photo"><Camera size={24} /></div>
            <div onClick={handleUploadClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }} title="Upload Image"><ImageIcon size={24} /></div>
            <div onClick={handleVideoClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }} title="Upload Video (30s max)"><Video size={24} /></div>
          </div>
          <input type="file" ref={cameraInputRef} onChange={(e) => handleMediaSelect(e, 'image')} accept="image/*" capture="environment" hidden />
          <input type="file" ref={uploadInputRef} onChange={(e) => handleMediaSelect(e, 'image')} accept="image/*" hidden />
          <input type="file" ref={videoInputRef} onChange={(e) => handleMediaSelect(e, 'video')} accept="video/*" hidden />
        </div>

        {/* Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map((post) => (
            <div key={post.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9', display: 'flex', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><User size={20} color="#0284c7" /></div>
              <div style={{ flex: 1 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{post.author}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{formatDate(post.timestamp)}{(post.editCount || 0) > 0 && <span style={{ marginLeft: '4px', fontStyle: 'italic', fontSize: '0.7rem' }}>(Edited)</span>}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {!editingId && isEditable(post) && <button onClick={() => startEditing(post)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '5px' }} title="Edit Post"><Pencil size={16} /></button>}
                    {isDeletable(post) && <button onClick={() => handleDeletePost(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '5px' }} title="Delete Post"><Trash2 size={16} /></button>}
                  </div>
                </div>

                {/* Content */}
                {editingId === post.id ? (
                  <div className="animate-fade-in" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input ref={editInputRef} type="text" value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEdit()} maxLength={MAX_CHARS} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--sky-blue)', outline: 'none' }} />
                    <button onClick={saveEdit} disabled={saveLoading} style={{ background: 'var(--light-green)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: '#171717' }}><Check size={16} /></button>
                    <button onClick={cancelEditing} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
                  </div>
                ) : (
                  <>
                    <p style={{ margin: '0 0 10px 0', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{post.content}</p>
                    {post.image && ( <div style={{ marginBottom: '10px' }}> <img src={post.image} alt="Post Attachment" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px' }} /> </div> )}
                    {post.video && ( <div style={{ marginBottom: '10px' }}> <video src={post.video} controls style={{ width: '100%', maxHeight: '400px', borderRadius: '12px', backgroundColor: 'black' }} /> </div> )}
                    <button onClick={() => { setReplyingToId(replyingToId === post.id ? null : post.id); setShowReplyEmojiPicker(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sandy-brown)', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', padding: 0 }}><MessageSquare size={14} /> {replyingToId === post.id ? "Cancel Reply" : "Reply"}</button>
                  </>
                )}

                {/* Reply Input */}
                {replyingToId === post.id && (
                  <div className="animate-fade-in" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {showReplyEmojiPicker && ( <div style={{ marginBottom: '5px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))', gap: '5px', width: '100%', maxHeight: '150px', overflowY: 'auto' }}>{COMMON_EMOJIS.map((emoji) => <button key={emoji} onClick={() => handleReplyEmojiClick(emoji)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '5px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{emoji}</button>)}</div> )}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <textarea ref={replyTextareaRef} placeholder="Write a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => handleReplyKeyDown(e, post.id)} autoFocus rows={1} style={{ width: '100%', padding: '10px 40px 10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f8fafc', resize: 'none', overflow: 'hidden', minHeight: '40px', fontFamily: 'inherit' }} />
                        <button onClick={() => setShowReplyEmojiPicker(!showReplyEmojiPicker)} style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 }}><Smile size={18} /></button>
                      </div>
                      <button onClick={() => handleReplySubmit(post.id)} disabled={replyLoading} style={{ backgroundColor: 'var(--sky-blue)', color: 'white', border: 'none', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{replyLoading ? '...' : <Send size={16} />}</button>
                    </div>
                  </div>
                )}

                {/* Render Replies */}
                {post.replies && post.replies.length > 0 && (
                  <div style={{ marginTop: '1rem', borderLeft: '2px solid #f1f5f9', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {post.replies.map((reply) => (
                      <div key={reply.id} style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                             <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{reply.author}</span>
                             <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{formatDate(reply.timestamp)}{(reply.editCount || 0) > 0 && <span style={{ marginLeft: '4px', fontStyle: 'italic' }}>(Edited)</span>}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            {!editingReplyId && isEditable(reply) && <button onClick={() => startEditingReply(reply)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '2px' }} title="Edit Reply"><Pencil size={14} /></button>}
                            {isDeletable(reply) && <button onClick={() => handleDeleteReply(reply.id, post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }} title="Delete Reply"><Trash2 size={14} /></button>}
                          </div>
                        </div>
                        {editingReplyId === reply.id ? (
                           <div className="animate-fade-in" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                             <input type="text" value={editReplyText} onChange={(e) => setEditReplyText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveReplyEdit()} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid var(--sky-blue)', outline: 'none', fontSize: '0.9rem' }} />
                             <button onClick={saveReplyEdit} disabled={saveReplyLoading} style={{ background: 'var(--light-green)', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', color: '#171717' }}><Check size={14} /></button>
                             <button onClick={cancelEditingReply} style={{ background: '#e2e8f0', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', color: '#64748b' }}><X size={14} /></button>
                           </div>
                        ) : ( <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>{reply.content}</p> )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {posts.length === 0 && (<div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No posts yet. Be the first to say hi! 👋</div>)}
        </div>
      </div>
    </main>
  );
}