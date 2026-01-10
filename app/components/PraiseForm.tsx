/**
 * file: app/components/PraiseForm.tsx
 * description: A component to submit Praise. Hides form for non-auth users.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Lock, Sparkles } from 'lucide-react';
import { addPraise } from '../actions';
import Link from 'next/link';

export default function PraiseForm() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('212user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !message.trim()) return;

    setLoading(true);
    await addPraise({
      id: Date.now(),
      name: user.alias || user.firstName,
      role: user.role,
      subject: "Praise", // Default subject
      message: message
    });
    setLoading(false);
    setMessage("");
    alert("Praise sent! 🎉");
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '1.5rem', 
      borderRadius: '20px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      marginTop: '2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <Heart fill="var(--light-green)" color="var(--light-green)" size={24} />
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>Give Praise</h3>
      </div>

      {/* RESTRICTED ACCESS */}
      {!user ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '1.5rem', 
          backgroundColor: '#f8fafc', 
          borderRadius: '12px',
          border: '1px dashed #cbd5e1'
        }}>
          <Lock size={24} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            <Link href="/login" style={{ color: 'var(--sky-blue)', fontWeight: 'bold', textDecoration: 'underline' }}>Log in</Link> to send praise to your housemates.
          </p>
        </div>
      ) : (
        /* AUTHENTICATED FORM */
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder={`Who is awesome today, ${user.firstName}?`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              outline: 'none',
              backgroundColor: '#f8fafc'
            }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              backgroundColor: 'var(--light-green)', 
              color: '#171717', 
              border: 'none', 
              padding: '12px', 
              borderRadius: '12px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? '...' : <Sparkles size={20} />}
          </button>
        </form>
      )}
    </div>
  );
}