/**
 * file: app/components/FeedbackForm.tsx
 * description: Reusable Feedback form that locks itself for unauthenticated users.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Lock, Send, AlertTriangle } from 'lucide-react';
import { addFeedback } from '../actions';
import Link from 'next/link';

export default function FeedbackForm() {
  const [formData, setFormData] = useState({ subject: "", message: "" });
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
    if (!user) return;

    setLoading(true);
    await addFeedback({
      id: Date.now(),
      name: user.alias || user.firstName,
      role: user.role,
      subject: formData.subject,
      message: formData.message,
      submittedAt: new Date().toISOString()
    });
    setLoading(false);
    setFormData({ subject: "", message: "" });
    alert("Feedback submitted. Thank you!");
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
        <MessageSquare size={24} color="#f59e0b" />
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>House Feedback</h3>
      </div>

      {!user ? (
        // LOCKED STATE
        <div style={{ 
          textAlign: 'center', 
          padding: '1.5rem', 
          backgroundColor: '#fffbeb', 
          borderRadius: '12px',
          border: '1px dashed #fcd34d'
        }}>
          <Lock size={24} color="#d97706" style={{ marginBottom: '0.5rem' }} />
          <p style={{ margin: 0, color: '#b45309', fontSize: '0.9rem' }}>
            <Link href="/login" style={{ color: '#d97706', fontWeight: 'bold', textDecoration: 'underline' }}>Log in</Link> to submit issues or suggestions.
          </p>
        </div>
      ) : (
        // UNLOCKED FORM
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Subject (e.g. Wifi, Cleaning)"
            value={formData.subject}
            onChange={e => setFormData({...formData, subject: e.target.value})}
            required
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
          />
          <textarea 
            placeholder="Describe the issue..." 
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            required
            rows={3}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', resize: 'none' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              alignSelf: 'flex-end',
              backgroundColor: '#f59e0b', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex', alignItems: 'center', gap: '5px'
            }}
          >
            {loading ? '...' : <>Submit <Send size={16} /></>}
          </button>
        </form>
      )}
    </div>
  );
}