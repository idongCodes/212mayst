"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; 
import { Music, Play, Pause, Minimize2, Loader } from 'lucide-react';

// Import ReactPlayer
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function GlobalPlayer() {
  const [hasMounted, setHasMounted] = useState(false);
  
  // DEFAULT URL: Lofi Girl 24/7
  const DEFAULT_URL = "https://www.youtube.com/live/jfKfPfyJRdk?si=yQKZIF99ziLj38wH";

  const [url, setUrl] = useState(DEFAULT_URL);
  const [inputUrl, setInputUrl] = useState(DEFAULT_URL);
  
  // CHANGE 1: Default to TRUE so it tries to play immediately
  const [playing, setPlaying] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const savedUrl = localStorage.getItem('player_url');
    if (savedUrl) {
      setUrl(savedUrl);
      setInputUrl(savedUrl);
    }
  }, []);

  if (!hasMounted) return null;

  const handlePlay = () => {
    if (url) setPlaying(!playing);
  };

  const handleLoadUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl) {
      setUrl(inputUrl);
      setPlaying(true);
      setIsReady(false); 
      localStorage.setItem('player_url', inputUrl);
    }
  };

  // --- RENDER HELPERS ---
  
  // The Hidden Player (moved out to be cleaner)
  // CHANGE 2: We removed 'display: none' and used off-screen positioning
  // This tricks the browser into loading the video because it thinks it is visible.
  const hiddenPlayer = (
    <div style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0, top: 0, left: 0 }}>
       <ReactPlayer 
         url={url} 
         playing={playing} 
         volume={0.8}
         onReady={() => setIsReady(true)}
         onEnded={() => setPlaying(false)}
         onPlay={() => setPlaying(true)}
         onPause={() => setPlaying(false)}
         // Error handling for autoplay blocks
         onError={(e) => console.log("Player Error (likely autoplay block):", e)}
         playsinline={true} 
         width="1px"
         height="1px"
       />
    </div>
  );

  // Minimized State
  if (!isExpanded) {
    return (
      <>
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            position: 'fixed',
            bottom: '7rem',
            right: '1.5rem',
            zIndex: 500,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'var(--sandy-brown)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
        >
          {playing ? (
            <div className="animate-spin-slow">
              <Music size={24} />
            </div>
          ) : (
            <Music size={24} />
          )}
        </button>
        {hiddenPlayer}
      </>
    );
  }

  // Expanded State
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '7rem',
        right: '1.5rem',
        zIndex: 500,
        width: '300px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '20px',
        padding: '1.5rem',
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music size={18} color="var(--sandy-brown)" />
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#171717' }}>House Vibe</span>
        </div>
        <button 
          onClick={() => setIsExpanded(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
        >
          <Minimize2 size={18} color="gray" />
        </button>
      </div>

      <form onSubmit={handleLoadUrl} style={{ marginBottom: '1rem', display: 'flex', gap: '5px' }}>
        <input 
          type="text" 
          placeholder="Paste YouTube Link..." 
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          style={{ 
            flex: 1, 
            padding: '8px 12px', 
            borderRadius: '10px', 
            border: '1px solid #e5e7eb', 
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
        <button 
            type="submit"
            style={{ 
                background: 'var(--sky-blue)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                padding: '0 10px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer'
            }}
        >
            Load
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <button
          onClick={handlePlay}
          disabled={!url}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: url ? 'var(--sandy-brown)' : '#e5e7eb',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: url ? 'pointer' : 'not-allowed',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}
        >
            {!isReady && url ? (
                <Loader size={24} className="animate-spin" />
            ) : playing ? (
                <Pause size={24} fill="white" />
            ) : (
                <Play size={24} fill="white" style={{ marginLeft: '4px' }} />
            )}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8rem', color: 'gray' }}>
        {url ? (playing ? "Now Playing" : "Paused") : "No track loaded"}
      </div>

      {hiddenPlayer}
    </div>
  );
}