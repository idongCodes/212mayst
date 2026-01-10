/**
 * file: app/chat/page.tsx
 * description: Chat page with INTELLIGENT auto-scroll (only scrolls if at bottom).
 */

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Image as ImageIcon, MessageCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addChat, getChats, ChatMessage } from '../actions';

// ... [Keep COMMON_EMOJIS and MOCK_GIFS arrays as is] ...
const COMMON_EMOJIS = ["😀", "😂", "😍", "🥳", "😎", "😭", "😡", "🤔", "👍", "👎", "🔥", "❤️", "✨", "🎉", "🏠", "🍺", "🍕", "🌮", "👀", "🚀", "💡", "💪", "😴", "👋"];
const MOCK_GIFS = [{ id: 1, label: "Hi!", color: "#fca5a5" }, { id: 2, label: "Party", color: "#fcd34d" }, { id: 3, label: "No", color: "#86efac" }, { id: 4, label: "Love", color: "#93c5fd" }, { id: 5, label: "Sad", color: "#d8b4fe" }, { id: 6, label: "Yes", color: "#fda4af" }];

export default function ChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  // 1. Auth Check
  useEffect(() => {
    const storedUser = sessionStorage.getItem('212user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  // 2. Poll for messages (Smart Update)
  useEffect(() => {
    const fetchMessages = async () => {
      const serverMessages = await getChats();
      setMessages(current => {
        if (JSON.stringify(current) !== JSON.stringify(serverMessages)) {
          return serverMessages;
        }
        return current;
      });
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // 3. Scroll Logic
  // Check if user is scrolling up manually
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // Consider "near bottom" if within 100px of bottom
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsNearBottom(distanceFromBottom < 100);
  };

  // Auto-scroll ONLY if user was already near bottom
  useEffect(() => {
    if (isNearBottom) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isNearBottom]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentUser) return;
    const textToSend = messageText.trim();
    setMessageText("");
    setShowEmojiPicker(false);
    setShowGifPicker(false);

    const authorName = currentUser.alias || currentUser.firstName;
    
    // Optimistic Update
    setMessages(prev => [...prev, { id: Date.now(), author: authorName, text: textToSend, timestamp: new Date().toISOString() }]);
    
    // Force scroll to bottom when I send a message
    setIsNearBottom(true);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    await addChat(textToSend, authorName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSendMessage(); };
  const handleEmojiClick = (emoji: string) => { setMessageText(prev => prev + emoji); };
  
  const handleGifClick = async (label: string) => { 
    if (!currentUser) return; 
    const authorName = currentUser.alias || currentUser.firstName; 
    const gifText = `[GIF: ${label}]`; 
    setMessages(prev => [...prev, { id: Date.now(), author: authorName, text: gifText, timestamp: new Date().toISOString() }]); 
    setShowGifPicker(false); 
    setIsNearBottom(true);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    await addChat(gifText, authorName); 
  };

  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : "?";

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', paddingBottom: '0' }}>
      
      {/* HEADER */}
      <div style={{ padding: '1rem', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', zIndex: 10 }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}><ArrowLeft size={24} color="#64748b" /></button>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>House Chat</h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Live • {messages.length} messages</p>
        </div>
        <div style={{ padding: '10px', backgroundColor: '#e0f2fe', borderRadius: '50%' }}><MessageCircle size={24} color="#0284c7" /></div>
      </div>

      {/* MESSAGES AREA */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
            <MessageCircle size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Quiet in here... say something!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = currentUser && (msg.author === (currentUser.alias || currentUser.firstName));
            return (
              <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%', display: 'flex', gap: '10px', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: isMe ? '#e0f2fe' : '#ffffff', color: isMe ? '#0284c7' : '#64748b', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', flexShrink: 0 }}>{getInitial(msg.author)}</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  {!isMe && <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', marginLeft: '4px' }}>{msg.author}</span>}
                  <div style={{ backgroundColor: isMe ? 'var(--sandy-brown)' : 'white', color: isMe ? 'white' : '#334155', padding: '12px 16px', borderRadius: '20px', borderTopRightRadius: isMe ? '4px' : '20px', borderTopLeftRadius: isMe ? '20px' : '4px', fontSize: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', lineHeight: '1.5', wordWrap: 'break-word' }}>{msg.text}</div>
                  <span style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '4px', margin: '0 4px' }}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA (Unchanged) */}
      <div style={{ padding: '1rem', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', zIndex: 10 }}>
        {showEmojiPicker && <div style={{ marginBottom: '10px', height: '150px', overflowY: 'auto', backgroundColor: '#f1f5f9', borderRadius: '12px', padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '5px' }}>{COMMON_EMOJIS.map(emoji => <button key={emoji} onClick={() => handleEmojiClick(emoji)} style={{ fontSize: '1.5rem', padding: '5px', border: 'none', background: 'none', cursor: 'pointer' }}>{emoji}</button>)}</div>}
        {showGifPicker && <div style={{ marginBottom: '10px', height: '150px', overflowY: 'auto', backgroundColor: '#f1f5f9', borderRadius: '12px', padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>{MOCK_GIFS.map(gif => <button key={gif.id} onClick={() => handleGifClick(gif.label)} style={{ height: '60px', backgroundColor: gif.color, borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'rgba(0,0,0,0.5)' }}>{gif.label}</button>)}</div>}
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '28px', border: '1px solid #e2e8f0', padding: '6px 6px 6px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <input type="text" placeholder="Type a message..." value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={handleKeyDown} style={{ flex: 1, padding: '10px 0', background: 'transparent', border: 'none', outline: 'none', fontSize: '1rem', color: '#1e293b' }} />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: showEmojiPicker ? 'var(--sandy-brown)' : '#94a3b8', padding: '8px' }}><Smile size={24} /></button>
            <button onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: showGifPicker ? 'var(--sandy-brown)' : '#94a3b8', padding: '8px' }}><ImageIcon size={24} /></button>
            <button onClick={handleSendMessage} style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--sandy-brown)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}><Send size={20} /></button>
          </div>
        </div>
      </div>

    </main>
  );
}