/**
 * file: app/components/Navigation.tsx
 * description: Replaced Chat polling with Supabase Realtime subscription.
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Armchair, Bed, Users, Bell, Info, MessageCircle, LogOut, LogIn, Minus, Maximize2, X, Send, Smile, Image as ImageIcon, Pencil, Check, Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { addChat, getChats, editChat, deleteChat, ChatMessage, getUsers } from "../actions"; 
import { supabase } from "../lib/supabaseClient"; // <--- Import Supabase Client
import ClickableUser from "./ClickableUser";

// Check if the environment is server-side
const isServerSide = typeof window === "undefined";

// Conditionally import revalidatePath based on the environment
const revalidatePath = isServerSide ? require('next/cache').revalidatePath : null;

const COMMON_EMOJIS = ["😀", "😂", "😍", "🥳", "😎", "😭", "😡", "🤔", "👍", "👎", "🔥", "❤️", "✨", "🎉", "🏠", "🍺", "🍕", "🌮", "👀", "🚀", "💡", "💪", "😴", "👋"];
const MOCK_GIFS = [{ id: 1, label: "Hi!", color: "#fca5a5" }, { id: 2, label: "Party", color: "#fcd34d" }, { id: 3, label: "No", color: "#86efac" }, { id: 4, label: "Love", color: "#93c5fd" }, { id: 5, label: "Sad", color: "#d8b4fe" }, { id: 6, label: "Yes", color: "#fda4af" }];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  
  const isChatPage = pathname === "/chat"; 
  const prevPathRef = useRef(pathname);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [userMap, setUserMap] = useState<Record<string, string>>({}); // Map: "Name" -> "PicUrl"
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editMessageText, setEditMessageText] = useState("");
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  // 1. Auth & Login Check
  useEffect(() => {
    const checkLogin = () => {
      const storedUser = sessionStorage.getItem('212user');
      if (storedUser) {
        setIsLoggedIn(true);
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        // Admin Check
        if (parsedUser.isAdmin || parsedUser.alias === 'idongcodes') setIsAdmin(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, [pathname]);

  // 2. Fetch User Avatars (Once on load)
  useEffect(() => {
    if (isLoggedIn) {
      const fetchUsers = async () => {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        
        const map: Record<string, string> = {};
        fetchedUsers.forEach(u => {
          if (u.profilePic) {
            map[u.firstName] = u.profilePic;
            if (u.alias) map[u.alias] = u.profilePic;
          }
        });
        setUserMap(map);
      };
      fetchUsers();
    }
  }, [isLoggedIn]);

  // 3. Auto-Open Chat logic
  useEffect(() => {
    if (prevPathRef.current === "/chat" && pathname !== "/chat") {
      setIsChatOpen(true);
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  // 4. SUPABASE REALTIME SUBSCRIPTION (Replaces Polling)
  useEffect(() => {
    if (!isLoggedIn) return;

    // A. Initial Load
    const loadInitialMessages = async () => {
      const initialChats = await getChats();
      setMessages(initialChats);
    };
    loadInitialMessages();

    // B. Subscribe to "chats" table changes
    const channel = supabase
      .channel('realtime-chats')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chats' },
        (payload) => {
          // Payload contains the new row data
          const newMsg = payload.new as any;
          
          setMessages((prev) => {
            // Avoid duplicates if we optimistically added it already
            if (prev.some(m => m.id === Number(newMsg.id))) return prev;
            
            return [...prev, {
              id: Number(newMsg.id),
              author: newMsg.author,
              text: newMsg.text,
              timestamp: newMsg.timestamp
            }];
          });

          // Scroll on new message if near bottom
          if (isNearBottom) {
             setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, isNearBottom]);

  // 5. Scroll Logic
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsNearBottom(distanceFromBottom < 100);
  };

  useEffect(() => { 
    if (isNearBottom && isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen, isNearBottom]);

  const handleLogout = () => { 
    sessionStorage.removeItem('212user'); 
    setIsLoggedIn(false); 
    router.push('/'); 
    revalidatePath('/'); 
    // Dispatch custom event for immediate UI updates
    window.dispatchEvent(new CustomEvent('user-logout'));
  };

  // Chat Edit/Delete Handlers
  const startEditingMessage = (msg: ChatMessage) => {
    setEditingMessageId(msg.id);
    setEditMessageText(msg.text);
  };

  const cancelEditingMessage = () => {
    setEditingMessageId(null);
    setEditMessageText("");
  };

  const saveEditedMessage = async () => {
    if (!editMessageText.trim() || !editingMessageId || !currentUser) return;
    
    const result = await editChat(editingMessageId, editMessageText, currentUser.phone);
    if (result.success) {
      setMessages(prev => prev.map(msg => 
        msg.id === editingMessageId 
          ? { ...msg, text: editMessageText }
          : msg
      ));
      cancelEditingMessage();
    }
  };

  const deleteMessage = async (id: number) => {
    if (!currentUser) return;
    
    if (confirm("Admin: Delete this message?")) {
      const result = await deleteChat(id, currentUser.phone);
      if (result.success) {
        setMessages(prev => prev.filter(msg => msg.id !== id));
      }
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentUser) return;
    const textToSend = messageText.trim();
    setMessageText(""); setShowEmojiPicker(false); setShowGifPicker(false);
    
    const authorName = currentUser.alias || currentUser.firstName;

    // Optimistic Update (Show immediately)
    const tempId = Date.now();
    setMessages(prev => [...prev, { id: tempId, author: authorName, text: textToSend, timestamp: new Date().toISOString() }]);
    
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
    
    const tempId = Date.now();
    setMessages(prev => [...prev, { id: tempId, author: authorName, text: gifText, timestamp: new Date().toISOString() }]); 
    
    setShowGifPicker(false); 
    setIsNearBottom(true);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    
    await addChat(gifText, authorName); 
  };

  const isActive = (path: string) => pathname === path;
  const getLinkStyle = (path: string) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive(path) ? 'var(--sandy-brown)' : '#9ca3af', fontWeight: isActive(path) ? 'bold' : 'normal', transition: 'color 0.2s ease', background: 'none', border: 'none', cursor: 'pointer', padding: 0 });
  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : "?";

  return (
    <>
      <nav style={{ position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', gap: '20px', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px', padding: '12px 25px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <Link href="/" style={getLinkStyle("/")} title="Home"><Home size={24} /></Link>
        {isLoggedIn && (
          <>
            <Link href="/common-room" style={getLinkStyle("/common-room")} title="Common Room"><Armchair size={24} /></Link>
            <Link href="/my-room" style={getLinkStyle("/my-room")} title="My Room"><Bed size={24} /></Link>
            <Link href="/mates" style={getLinkStyle("/mates")} title="Mates"><Users size={24} /></Link>
            <Link href="/notifications" style={getLinkStyle("/notifications")} title="Notifications"><Bell size={24} /></Link>
            <Link href="/about" style={getLinkStyle("/about")} title="About"><Info size={24} /></Link>
          </>
        )}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }}></div>
        {isLoggedIn ? (
          <button onClick={handleLogout} style={getLinkStyle("logout")} title="Log Out"><LogOut size={24} color="#ef4444" /></button>
        ) : (
          <Link href="/login" style={getLinkStyle("/login")} title="Log In"><LogIn size={24} color="var(--sky-blue)" /></Link>
        )}
      </nav>

      {/* CHAT POPUP */}
      {isLoggedIn && !isChatPage && (
        <>
          {isChatOpen && (
            <div className="animate-fade-in" style={{ position: 'fixed', bottom: '8rem', right: '1rem', width: '320px', height: '450px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', zIndex: 101, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              
              {/* TOP BAR */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 15px', backgroundColor: 'var(--sky-blue)', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle size={18} fill="rgba(255,255,255,0.2)" />
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>House Chat</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: 0 }}><Minus size={20} /></button>
                  <button onClick={() => router.push('/chat')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: 0 }}><Maximize2 size={18} /></button>
                </div>
              </div>

              {/* MESSAGES AREA */}
              <div 
                ref={chatContainerRef}
                onScroll={handleScroll}
                style={{ flex: 1, backgroundColor: '#f8fafc', padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                {messages.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '1rem' }}><MessageCircle size={32} color="var(--sandy-brown)" /></div>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>No messages yet.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = currentUser && (msg.author === (currentUser.alias || currentUser.firstName));
                    const avatarSrc = userMap[msg.author];
                    const isEditing = editingMessageId === msg.id;

                    return (
                      <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '85%', display: 'flex', gap: '8px', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                        
                        {/* AVATAR */}
                        <ClickableUser 
                          user={users.find(u => u.firstName === msg.author || u.alias === msg.author) || { firstName: msg.author, lastName: '' }} 
                          currentUser={currentUser}
                          style={{ 
                            width: '28px', height: '28px', borderRadius: '50%', 
                            backgroundColor: isMe ? '#e0f2fe' : '#f1f5f9', 
                            color: isMe ? '#0284c7' : '#64748b',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 'bold',
                            flexShrink: 0, border: '1px solid rgba(0,0,0,0.05)',
                            overflow: 'hidden' 
                          }}
                        >
                          {avatarSrc ? (
                            <img src={avatarSrc} alt={msg.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            getInitial(msg.author)
                          )}
                        </ClickableUser>

                        {/* MESSAGE */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', position: 'relative' }}>
                          {!isMe && (
                            <ClickableUser 
                              user={users.find(u => u.firstName === msg.author || u.alias === msg.author) || { firstName: msg.author, lastName: '' }} 
                              currentUser={currentUser}
                              style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', marginLeft: '4px', cursor: 'pointer' }}
                            >
                              {msg.author}
                            </ClickableUser>
                          )}
                          
                          {/* ADMIN CONTROLS */}
                          {isAdmin && !isEditing && (
                            <div style={{ position: 'absolute', top: '-8px', right: isMe ? 'auto' : '-8px', left: isMe ? '-8px' : 'auto', display: 'flex', gap: '4px', zIndex: 10 }}>
                              <button 
                                onClick={() => startEditingMessage(msg)} 
                                style={{ 
                                  background: 'white', 
                                  border: 'none', 
                                  borderRadius: '50%', 
                                  padding: '4px', 
                                  cursor: 'pointer', 
                                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }} 
                                title="Edit"
                              >
                                <Pencil size={12} color="#94a3b8" />
                              </button>
                              <button 
                                onClick={() => deleteMessage(msg.id)} 
                                style={{ 
                                  background: 'white', 
                                  border: 'none', 
                                  borderRadius: '50%', 
                                  padding: '4px', 
                                  cursor: 'pointer', 
                                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }} 
                                title="Delete"
                              >
                                <Trash2 size={12} color="#ef4444" />
                              </button>
                            </div>
                          )}

                          {/* MESSAGE CONTENT */}
                          {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                              <textarea
                                value={editMessageText}
                                onChange={(e) => setEditMessageText(e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '16px',
                                  border: '1px solid #cbd5e1',
                                  fontSize: '0.9rem',
                                  fontFamily: 'inherit',
                                  resize: 'vertical',
                                  minHeight: '40px',
                                  outline: 'none'
                                }}
                                autoFocus
                              />
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={cancelEditingMessage}
                                  style={{
                                    background: '#94a3b8',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '6px 12px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <X size={14} /> Cancel
                                </button>
                                <button 
                                  onClick={saveEditedMessage}
                                  style={{
                                    background: 'var(--sandy-brown)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '6px 12px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <Check size={14} /> Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ backgroundColor: isMe ? 'var(--sandy-brown)' : 'white', color: isMe ? 'white' : '#334155', padding: '8px 12px', borderRadius: '16px', borderTopRightRadius: isMe ? '4px' : '16px', borderTopLeftRadius: isMe ? '16px' : '4px', fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', wordWrap: 'break-word' }}>{msg.text}</div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* INPUT AREA */}
              {showEmojiPicker && <div style={{ height: '150px', overflowY: 'auto', backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0', padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>{COMMON_EMOJIS.map(emoji => <button key={emoji} onClick={() => handleEmojiClick(emoji)} style={{ fontSize: '1.2rem', padding: '5px', border: 'none', background: 'none', cursor: 'pointer' }}>{emoji}</button>)}</div>}
              {showGifPicker && <div style={{ height: '150px', overflowY: 'auto', backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0', padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>{MOCK_GIFS.map(gif => <button key={gif.id} onClick={() => handleGifClick(gif.label)} style={{ height: '60px', backgroundColor: gif.color, borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{gif.label} GIF</button>)}</div>}
              <div style={{ padding: '10px', borderTop: '1px solid #e2e8f0', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '4px', paddingLeft: '12px' }}>
                  <input type="text" placeholder="Type a message..." value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={handleKeyDown} style={{ flex: 1, padding: '8px 0', background: 'transparent', border: 'none', outline: 'none', fontSize: '0.9rem', color: '#1e293b', minWidth: 0 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: showEmojiPicker ? 'var(--sandy-brown)' : '#94a3b8', padding: '6px' }}><Smile size={20} /></button>
                    <button onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: showGifPicker ? 'var(--sandy-brown)' : '#94a3b8', padding: '6px' }}><ImageIcon size={20} /></button>
                    <button onClick={handleSendMessage} style={{ background: 'var(--sandy-brown)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', marginLeft: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexShrink: 0 }}><Send size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button onClick={() => setIsChatOpen(!isChatOpen)} style={{ position: 'fixed', bottom: '6rem', right: '1rem', zIndex: 100, height: '56px', width: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isChatOpen ? '#ef4444' : 'var(--light-green)', color: 'white', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '2px solid white', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
          </button>
        </>
      )}
    </>
  );
}