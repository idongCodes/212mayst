/**
 * file: app/feedback/page.tsx
 * description: Removed submission form. Now strictly displays the list of previous feedback.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { User as UserIcon } from 'lucide-react';
import { getFeedback, Feedback } from '../actions';

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  useEffect(() => {
    const loadFeedback = async () => {
      const data = await getFeedback();
      setFeedbackList(data);
    };
    loadFeedback();
  }, []);

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
                  backgroundColor: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '20px', 
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.02)' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>{item.subject}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{formatDate(item.submittedAt)}</span>
                  </div>
                  
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