"use client";

import { useState, useEffect } from 'react';

export default function Notifications() {
  const [welcomeMessages, setWelcomeMessages] = useState<any[]>([]);

  useEffect(() => {
    const loadUsersAndMessages = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const allUsers = await response.json();
          
          // Create welcome messages for each user
          const messages = allUsers.map((user: any) => {
            const displayName = user.alias || user.firstName;
            console.log('User data:', user); // Debug log
            
            let joinDate;
            if (user.joinedAt) {
              joinDate = new Date(user.joinedAt);
              // Check if date is valid
              if (isNaN(joinDate.getTime())) {
                console.log('Invalid date for user:', user.id, user.joinedAt);
                joinDate = new Date(); // Fallback to current date
              }
            } else {
              joinDate = new Date(); // Fallback to current date
            }
            
            return {
              id: `welcome-${user.id}`,
              type: 'welcome',
              user: displayName,
              message: `${displayName} has joined the app`,
              date: joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              time: joinDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              timestamp: user.joinedAt
            };
          });
          
          setWelcomeMessages(messages);
        }
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsersAndMessages();
  }, []);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem', textAlign: 'center' }}>
          📢 Notifications
        </h1>
        
          {welcomeMessages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No notifications yet</p>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>When users join the app, their welcome messages will appear here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {welcomeMessages.map((msg) => (
                <div key={msg.id} style={{ 
                  backgroundColor: '#f0f9ff', 
                  border: '1px solid #e0f2fe', 
                  borderRadius: '0', 
                  padding: '1rem',
                  borderLeft: '4px solid #3b82f6',
                  width: '100%'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.25rem' }}>
                        {msg.user}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        {msg.message}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'right' }}>
                      <div>{msg.date}</div>
                      <div>{msg.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </main>
  );
}