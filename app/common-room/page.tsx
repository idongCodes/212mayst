/**
 * file: app/common-room/page.tsx
 * description: Added an invisible backdrop to close the emoji picker when clicking outside.
 */

"use client";

import React, { useState, useRef } from 'react';
import { Send, Camera, Image as ImageIcon, Smile } from 'lucide-react';

const COMMON_EMOJIS = [
  "😀", "😂", "😍", "🥳", "😎", "😭", "😡", "🤔",
  "👍", "👎", "🔥", "❤️", "✨", "🎉", "🏠", "🍺", 
  "🍕", "🌮", "👀", "🚀", "💡", "💪", "😴", "👋",
  "💯", "🙌", "💀", "💩", "🦄", "🌈", "🎈", "🎁"
];

export default function CommonRoom() {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Refs for file inputs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => cameraInputRef.current?.click();
  const handleUploadClick = () => uploadInputRef.current?.click();

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: 'var(--sandy-brown)',
            marginBottom: '1rem'
          }}>
            Welcome to the Common Room
          </h1>
          <p style={{ color: 'gray' }}>
            This is where we hang out. Pull up a chair!
          </p>
        </div>

        {/* Input Container */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '20px', 
          boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative' 
        }}>
          
          {/* Top Row: Input Wrapper & Post Button */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            
            {/* Relative wrapper for Input + Emoji Icon */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Hey, whats up?" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '12px 40px 12px 15px', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  fontSize: '1rem',
                  backgroundColor: '#f8fafc',
                  outline: 'none'
                }}
              />
              
              {/* Emoji Toggle Icon */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                <Smile size={20} />
              </button>

              {/* Emoji Picker Logic */}
              {showEmojiPicker && (
                <>
                  {/* Invisible Backdrop - Closes picker on click */}
                  <div 
                    onClick={() => setShowEmojiPicker(false)}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100vw',
                      height: '100vh',
                      zIndex: 40,
                      cursor: 'default'
                    }}
                  />

                  {/* Picker Popup */}
                  <div style={{
                    position: 'absolute',
                    top: '115%', 
                    right: 0, 
                    zIndex: 50, // Higher than backdrop
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    padding: '10px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(35px, 1fr))',
                    gap: '5px',
                    width: '100%',
                    minWidth: '250px',
                    maxWidth: '300px',
                    maxHeight: '200px', 
                    overflowY: 'auto'
                  }}>
                    {COMMON_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiClick(emoji)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          padding: '5px',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button 
              style={{ 
                backgroundColor: 'var(--sandy-brown)', 
                color: 'white', 
                border: 'none', 
                padding: '12px 20px', 
                borderRadius: '12px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              Post <Send size={18} />
            </button>
          </div>

          {/* Bottom Row: Media Icons */}
          <div style={{ display: 'flex', gap: '20px', paddingLeft: '5px' }}>
            <div 
              onClick={handleCameraClick}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }}
            >
              <Camera size={24} />
            </div>

            <div 
              onClick={handleUploadClick}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }}
            >
              <ImageIcon size={24} />
            </div>
          </div>

          {/* Hidden Inputs */}
          <input 
            type="file" 
            ref={cameraInputRef} 
            accept="image/*" 
            capture="environment" 
            hidden 
            onChange={(e) => console.log(e.target.files)} 
          />
          <input 
            type="file" 
            ref={uploadInputRef} 
            accept="image/*" 
            hidden 
            onChange={(e) => console.log(e.target.files)}
          />

        </div>
      </div>
    </main>
  );
}