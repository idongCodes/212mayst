"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function Notifications() {
  const [welcomeMessages, setWelcomeMessages] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    console.log('Initializing notifications page...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key exists:', !!supabaseKey);
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const loadInitialData = async () => {
      try {
        console.log('Loading initial data...');
        
        // Load users for welcome messages
        const usersResponse = await fetch('/api/users');
        if (usersResponse.ok) {
          const allUsers = await usersResponse.json();
          console.log('Loaded users:', allUsers.length);
          
          // Create welcome messages for each user
          const welcomeMsgs = allUsers.map((user: any) => {
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
          
          setWelcomeMessages(welcomeMsgs);
          console.log('Set welcome messages:', welcomeMsgs.length);
        } else {
          console.error('Failed to load users:', usersResponse.status);
        }

        // Load existing chat messages
        const { data: existingMessages, error } = await supabase
          .from('chats')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error loading chat messages:', error);
        } else if (existingMessages) {
          console.log('Loaded existing messages:', existingMessages.length);
          const chatMsgs = existingMessages.map((msg: any) => {
            const displayName = msg.author;
            const msgDate = new Date(msg.timestamp);
            return {
              id: `chat-${msg.id}`,
              type: 'chat',
              user: displayName,
              message: `${displayName} sent a message`,
              date: msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              time: msgDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              timestamp: msg.timestamp
            };
          });
          setChatMessages(chatMsgs);
          console.log('Set chat messages:', chatMsgs.length);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();

    // Listen for new chat messages
    console.log('Setting up chat subscription...');
    const channel = supabase
      .channel('notifications-chat')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chats',
          filter: `id=gt.0`
        },
        (payload) => {
          console.log('New chat message received:', payload);
          const displayName = payload.new.author;
          const msgDate = new Date(payload.new.timestamp);
          const newNotification = {
            id: `chat-${payload.new.id}`,
            type: 'chat',
            user: displayName,
            message: `${displayName} sent a message`,
            date: msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: msgDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            timestamp: payload.new.timestamp
          };
          
          setChatMessages(prev => [newNotification, ...prev]);
          console.log('Added new chat notification');
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscription...');
      supabase.removeChannel(channel);
    };
  }, []);

  // Combine and sort all notifications by timestamp
  useEffect(() => {
    const all = [...welcomeMessages, ...chatMessages];
    const sorted = all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setAllNotifications(sorted);
  }, [welcomeMessages, chatMessages]);

  // Handle scroll to load more
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;
    
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (!isLoadingMore && displayCount < allNotifications.length) {
        loadMoreNotifications();
      }
    }
  };

  const loadMoreNotifications = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + 10, allNotifications.length));
      setIsLoadingMore(false);
    }, 500);
  };

  const displayedNotifications = allNotifications.slice(0, displayCount);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem', textAlign: 'center' }}>
          📢 Notifications
        </h1>
        
        {displayedNotifications.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No notifications yet</p>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>When users join the app or send messages, notifications will appear here</p>
          </div>
        ) : (
          <div 
            style={{ 
              height: '70vh', 
              overflowY: 'auto', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              backgroundColor: 'white'
            }}
            onScroll={handleScroll}
          >
            {displayedNotifications.map((msg, index) => (
              <div 
                key={msg.id} 
                style={{ 
                  backgroundColor: msg.type === 'chat' ? '#fef3c7' : '#f0f9ff', 
                  border: `1px solid ${msg.type === 'chat' ? '#fde68a' : '#e0f2fe'}`, 
                  borderRadius: '0', 
                  padding: '1rem',
                  borderLeft: `4px solid ${msg.type === 'chat' ? '#f59e0b' : '#3b82f6'}`,
                  width: '100%',
                  opacity: index === displayCount - 1 ? 0.5 : 1,
                  animation: index === displayCount - 1 ? 'fadeIn 0.5s ease-in' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: msg.type === 'chat' ? '#d97706' : '#1e40af', marginBottom: '0.25rem' }}>
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
            
            {displayCount < allNotifications.length && (
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                color: '#64748b',
                fontSize: '0.9rem',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0'
              }}>
                {isLoadingMore ? 'Loading more...' : `Showing ${displayCount} of ${allNotifications.length} notifications`}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}