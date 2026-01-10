/**
 * file: app/feedback/page.tsx
 * description: Feedback list with Admin Toolbar (Read/Unread/Delete).
 */

"use client";

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Trash2, CheckCircle, Circle, Lock } from 'lucide-react';
import { getFeedback, deleteFeedback, toggleFeedbackRead, Feedback } from '../actions';

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Check Admin Status
    const storedUser = sessionStorage.getItem('212user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.alias === 'idongcodes') {
        setIsAdmin(true);
      }
    }

    // 2. Load Data
    const loadFeedback = async () => {
      const data = await getFeedback();
      setFeedbackList(data);
    };
    loadFeedback();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this feedback?")) return;
    setFeedbackList(feedbackList.filter(f => f.id !== id)); // Optimistic
    await deleteFeedback(id);
  };

  const handleToggleRead = async (id: number, currentStatus: boolean | undefined) => {
    const newStatus = !currentStatus;
    setFeedbackList(feedbackList.map(f => f.id === id ? { ...f, read: newStatus } : f)); // Optimistic
    await toggleFeedbackRead(id, newStatus);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem', paddingBottom: '8rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--sandy-brown)' }}>House Feedback</h1>
          <p style={{ color: 'gray' }}>A log of suggestions and reports.</p>
        </div>

        {/* FEEDBACK LIST VIEW */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedbackList.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem', fontStyle: 'italic' }}>
                No feedback submitted yet.
              </div>
            ) : (
              feedbackList.map((item) => (
                <div key={item.id} style={{ 
                  backgroundColor: item.read ? '#f8fafc' : 'white', // Dim if read
                  opacity: item.read ? 0.7 : 1,
                  padding: '1.5rem', 
                  borderRadius: '20px', 
                  border: item.read ? '1px solid #e2e8f0' : '1px solid #cbd5e1',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                  position: 'relative',
                  transition: 'all 0.3s'
                }}>
                  
                  {/* ADMIN TOOLBAR */}
                  {isAdmin && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      right: '10px', 
                      display: 'flex', 
                      gap: '8px',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      padding: '5px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <button 
                        onClick={() => handleToggleRead(item.id, item.read)}
                        title={item.read ? "Mark Unread" : "Mark Read"}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        {item.read ? <CheckCircle size={18} color="#10b981" /> : <Circle size={18} color="#94a3b8" />}
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Trash2 size={18} color="#ef4444" />
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', paddingRight: isAdmin ? '60px' : '0' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>{item.subject}</h4>
                  </div>
                   <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>{formatDate(item.submittedAt)}</span>
                  
                  <p style={{ color: '#475569', lineHeight: '1.5', margin: '0 0 1rem 0' }}>{item.message}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserIcon size={14} color="#0284c7" />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
                      {item.name} <span style={{ fontWeight: 'normal', opacity: 0.7 }}>({item.role})</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}