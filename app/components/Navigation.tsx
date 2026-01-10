/**
 * file: app/components/Navigation.tsx
 * description: Chat Popup with Send button moved INSIDE the input container.
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Armchair, Bed, Users, Bell, Info, MessageCircle, LogOut, LogIn, Minus, Maximize2, X, Send, Smile, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

const COMMON_EMOJIS = [
  "😀", "😂", "😍", "🥳", "😎", "😭", "😡", "🤔",
  "👍", "👎", "🔥", "❤️", "✨", "🎉", "🏠", "🍺", 
  "🍕", "🌮", "👀", "🚀", "💡", "💪", "😴", "👋"
];

const MOCK_GIFS = [
  { id: 1, label: "Hi!", color: "#fca5a5" },
  { id: 2, label: "Party", color: "#fcd34d" },
  { id: 3, label: "No", color: "#86efac" },
  { id: 4, label: "Love", color: "#93c5fd" },
  { id: 5, label: "Sad", color: "#d8b4fe" },
  { id: 6, label: "Yes", color: "#fda4af" },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Chat State
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const user = sessionStorage.getItem('212user');
      setIsLoggedIn(!!user);
    };
    checkLogin();
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('212user');
    setIsLoggedIn(false);
    router.push('/');
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const handleGifClick = (label: string) => {
    alert(`Sent GIF: ${label} (Mock Function)`);
    setShowGifPicker(false);
  };

  const isActive = (path: string) => pathname === path;

  const getLinkStyle = (path: string) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isActive(path) ? 'var(--sandy-brown)' : '#9ca3af',
    fontWeight: isActive(path) ? 'bold' : 'normal',
    transition: 'color 0.2s ease',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0
  });

  return (
    <>
      <nav 
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50px',
          padding: '12px 25px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}
      >
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

      {/* CHAT SYSTEM */}
      {isLoggedIn && (
        <>
          {/* POPUP WINDOW */}
          {isChatOpen && (
            <div 
              className="animate-fade-in"
              style={{
                position: 'fixed',
                bottom: '8rem', 
                right: '1rem',
                width: '320px',
                height: '450px',
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                zIndex: 101,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid #e2e8f0'
              }}
            >
              {/* TOP BAR */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 15px', backgroundColor: 'var(--sky-blue)', color: 'white',
                borderBottom: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle size={18} fill="rgba(255,255,255,0.2)" />
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>House Chat</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: 0 }}><Minus size={20} /></button>
                  <button onClick={() => router.push('/chat')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: 0 }}><Maximize2 size={18} /></button>
                </div>
              </div>

              {/* CONTENT AREA */}
              <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', gap: '1rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                   <MessageCircle size={32} color="var(--sandy-brown)" />
                </div>
                <p style={{ margin: 0, textAlign: 'center', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Quick Chat</strong><br/>Active conversations will appear here.</p>
              </div>

              {/* PICKER OVERLAYS */}
              {showEmojiPicker && (
                <div style={{ height: '150px', overflowY: 'auto', backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0', padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
                  {COMMON_EMOJIS.map(emoji => (
                    <button key={emoji} onClick={() => handleEmojiClick(emoji)} style={{ fontSize: '1.2rem', padding: '5px', border: 'none', background: 'none', cursor: 'pointer' }}>{emoji}</button>
                  ))}
                </div>
              )}

              {showGifPicker && (
                <div style={{ height: '150px', overflowY: 'auto', backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0', padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {MOCK_GIFS.map(gif => (
                    <button key={gif.id} onClick={() => handleGifClick(gif.label)} style={{ height: '60px', backgroundColor: gif.color, borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {gif.label} GIF
                    </button>
                  ))}
                </div>
              )}

              {/* UNIFIED INPUT AREA */}
              <div style={{ padding: '10px', borderTop: '1px solid #e2e8f0', backgroundColor: 'white' }}>
                
                {/* Single Capsule Container */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '24px', 
                  border: '1px solid #e2e8f0',
                  padding: '4px',
                  paddingLeft: '12px'
                }}>
                  
                  {/* Text Input */}
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.9rem',
                      color: '#1e293b',
                      minWidth: 0
                    }}
                  />
                  
                  {/* Action Group */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button 
                      onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: showEmojiPicker ? 'var(--sandy-brown)' : '#94a3b8', padding: '6px' }}
                    >
                      <Smile size={20} />
                    </button>
                    
                    <button 
                      onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: showGifPicker ? 'var(--sandy-brown)' : '#94a3b8', padding: '6px' }}
                    >
                      <ImageIcon size={20} />
                    </button>

                    {/* Send Button INSIDE container */}
                    <button 
                      style={{
                        background: 'var(--sandy-brown)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'white',
                        marginLeft: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Send size={14} />
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TOGGLE BUTTON */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            style={{
              position: 'fixed', bottom: '6rem', right: '1rem', zIndex: 100,
              height: '56px', width: '56px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: isChatOpen ? '#ef4444' : 'var(--light-green)', 
              color: 'white', borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '2px solid white',
              cursor: 'pointer', transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
          </button>
        </>
      )}
    </>
  );
}