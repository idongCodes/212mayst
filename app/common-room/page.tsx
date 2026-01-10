/**
 * file: app/common-room/page.tsx
 * description: Posts now display date in mm/dd/yyyy format + time.
 */

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Camera, Image as ImageIcon, Smile, User, Pencil, X, Check, Trash2 } from 'lucide-react';
import { addPost, getPosts, editPost, deletePost, Post } from '../actions';
import Link from 'next/link';

const COMMON_EMOJIS = ["😀", "😂", "😍", "🥳", "😎", "😭", "😡", "🤔", "👍", "👎", "🔥", "❤️", "✨", "🎉", "🏠", "🍺", "🍕", "🌮", "👀", "🚀", "💡", "💪", "😴", "👋", "💯", "🙌", "💀", "💩", "🦄", "🌈", "🎈", "🎁"];
const MAX_CHARS = 250;

export default function CommonRoom() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [authorName, setAuthorName] = useState("Guest");
  const [isGuest, setIsGuest] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); 

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

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
      setIsGuest(false);
      if (user.alias === 'idongcodes') setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
    }
  }, [message]);

  useEffect(() => { if (editingId && editInputRef.current) editInputRef.current.focus(); }, [editingId]);

  const handleCameraClick = () => cameraInputRef.current?.click();
  const handleUploadClick = () => uploadInputRef.current?.click();
  const handleEmojiClick = (emoji: string) => { if (message.length + emoji.length <= MAX_CHARS) setMessage(prev => prev + emoji); };
  
  const handlePostSubmit = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const newPost: Post = { id: Date.now(), author: authorName, content: message.trim(), timestamp: new Date().toISOString(), editCount: 0 };
    setPosts([newPost, ...posts]);
    setMessage("");
    setShowEmojiPicker(false);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await addPost(newPost);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePostSubmit(); } };

  const isEditable = (post: Post) => {
    if ((post.editCount || 0) >= 1) return false;
    return (Date.now() - new Date(post.timestamp).getTime()) < 15 * 60 * 1000;
  };

  const startEditing = (post: Post) => { setEditingId(post.id); setEditText(post.content); };
  const cancelEditing = () => { setEditingId(null); setEditText(""); };
  
  const saveEdit = async () => {
    if (!editingId || !editText.trim()) return;
    setSaveLoading(true);
    const result = await editPost(editingId, editText.trim());
    if (result.success) {
      setPosts(posts.map(p => p.id === editingId ? { ...p, content: editText.trim(), editCount: (p.editCount || 0) + 1 } : p));
      setEditingId(null); setEditText("");
    } else {
      alert(result.message); setEditingId(null);
    }
    setSaveLoading(false);
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Admin: Delete this post?")) return;
    setPosts(posts.filter(p => p.id !== id));
    await deletePost(id);
  };

  // UPDATED DATE FORMATTER
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    // mm/dd/yyyy, hh:mm am/pm
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }) + ', ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header & Input UI (Unchanged) */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--sandy-brown)', marginBottom: '1rem' }}>
            {isGuest ? "Welcome to the Common Room" : `Welcome, ${authorName}`}
          </h1>
          {isGuest ? <p style={{ color: 'gray' }}>You are viewing as a guest. <Link href="/join" style={{ textDecoration: 'underline', color: 'var(--sky-blue)', fontWeight: 'bold' }}>Join the house</Link> to post with your name!</p> : <p style={{ color: 'gray' }}>This is where we hang out. Pull up a chair!</p>}
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <textarea ref={textareaRef} placeholder={`What's on your mind, ${authorName}?`} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} maxLength={MAX_CHARS} rows={1} style={{ width: '100%', padding: '12px 40px 12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', backgroundColor: '#f8fafc', outline: 'none', resize: 'none', overflow: 'hidden', minHeight: '48px', fontFamily: 'inherit', lineHeight: '1.5' }} />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: message.length >= MAX_CHARS ? '#ef4444' : '#94a3b8', marginTop: '4px', paddingRight: '5px' }}>{message.length}/{MAX_CHARS}</div>
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ position: 'absolute', right: '10px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 }}><Smile size={20} /></button>
              {showEmojiPicker && (
                <>
                  <div onClick={() => setShowEmojiPicker(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 40, cursor: 'default' }} />
                  <div style={{ position: 'absolute', top: '110%', right: 0, zIndex: 50, backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(35px, 1fr))', gap: '5px', width: '100%', minWidth: '250px', maxWidth: '300px', maxHeight: '200px', overflowY: 'auto' }}>
                    {COMMON_EMOJIS.map((emoji) => <button key={emoji} onClick={() => handleEmojiClick(emoji)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '5px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{emoji}</button>)}
                  </div>
                </>
              )}
            </div>
            <button onClick={handlePostSubmit} disabled={loading} style={{ backgroundColor: 'var(--sandy-brown)', color: 'white', border: 'none', padding: '0 20px', height: '48px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', opacity: loading ? 0.7 : 1, alignSelf: 'flex-start' }}>{loading ? '...' : 'Post'} <Send size={18} /></button>
          </div>
          <div style={{ display: 'flex', gap: '20px', paddingLeft: '5px' }}>
            <div onClick={handleCameraClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }}><Camera size={24} /></div>
            <div onClick={handleUploadClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }}><ImageIcon size={24} /></div>
          </div>
          <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" hidden />
          <input type="file" ref={uploadInputRef} accept="image/*" hidden />
        </div>

        {/* Feed with new Date Format */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map((post) => (
            <div key={post.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9', display: 'flex', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={20} color="#0284c7" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{post.author}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {formatDate(post.timestamp)}
                      {(post.editCount || 0) > 0 && <span style={{ marginLeft: '4px', fontStyle: 'italic', fontSize: '0.7rem' }}>(Edited)</span>}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {!editingId && post.author === authorName && isEditable(post) && (
                      <button onClick={() => startEditing(post)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '5px' }} title="Edit"><Pencil size={16} /></button>
                    )}
                    {isAdmin && (
                      <button onClick={() => handleDeletePost(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '5px' }} title="Admin Delete"><Trash2 size={16} /></button>
                    )}
                  </div>
                </div>
                {editingId === post.id ? (
                  <div className="animate-fade-in" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input ref={editInputRef} type="text" value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEdit()} maxLength={MAX_CHARS} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--sky-blue)', outline: 'none' }} />
                    <button onClick={saveEdit} disabled={saveLoading} style={{ background: 'var(--light-green)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: '#171717' }}><Check size={16} /></button>
                    <button onClick={cancelEditing} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
                  </div>
                ) : (
                  <p style={{ margin: 0, color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{post.content}</p>
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