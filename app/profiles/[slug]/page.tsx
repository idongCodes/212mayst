/**
 * file: app/profiles/[slug]/page.tsx
 * description: User profile page similar to /my-room but for viewing other users
 */

"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Phone, Mail, MapPin, User, Home } from 'lucide-react';
import { getUsers } from '../../actions';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Parse slug to get first and last name
  const slug = params.slug as string;
  const [firstName, lastName] = slug.includes('-') 
    ? slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1))
    : [slug.charAt(0).toUpperCase() + slug.slice(1), ''];

  useEffect(() => {
    const initializeData = async () => {
      // Get current user for auth check
      const storedUser = sessionStorage.getItem('212user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        router.push('/login');
        return;
      }

      // Find user by first and last name (handle both cases)
      const users = await getUsers();
      const foundUser = users.find(u => {
        const userFirstName = u.firstName.toLowerCase();
        const userLastName = u.lastName ? u.lastName.toLowerCase() : '';
        
        if (lastName) {
          // Two-name slug: match both first and last
          return userFirstName === firstName.toLowerCase() && userLastName === lastName.toLowerCase();
        } else {
          // Single-name slug: match first name only
          return userFirstName === firstName.toLowerCase() && !userLastName;
        }
      });

      if (foundUser) {
        setUser(foundUser);
      } else {
        router.push('/'); // User not found, redirect to home
      }
      setLoading(false);
    };

    initializeData();
  }, [slug, router]);

  if (loading) {
    return (
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#f8fafc' 
      }}>
        <div>Loading profile...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#f8fafc' 
      }}>
        <div>User not found</div>
      </main>
    );
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      padding: '1rem'
    }}>
      {/* HEADER */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>
        <button 
          onClick={() => router.back()} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ArrowLeft size={24} color="#64748b" />
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
          {user.firstName}'s Profile
        </h1>
      </div>

      {/* PROFILE CARD */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '24px', 
        padding: '2rem', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)', 
        maxWidth: '600px', 
        margin: '0 auto' 
      }}>
        
        {/* PROFILE IMAGE AND NAME */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            backgroundColor: '#e0f2fe', 
            margin: '0 auto 1rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '4px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            {user.profilePic ? (
              <img 
                src={user.profilePic} 
                alt={`${user.firstName} ${user.lastName}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <User size={48} color="#0284c7" />
            )}
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
            {user.firstName} {user.lastName}
          </h2>
          {user.alias && (
            <p style={{ margin: 0, fontSize: '1rem', color: '#64748b', marginBottom: '0.5rem' }}>
              @{user.alias}
            </p>
          )}
          <p style={{ margin: 0, fontSize: '1.1rem', color: '#0284c7', fontWeight: 'bold' }}>
            {user.role}
          </p>
        </div>

        {/* INFO SECTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Personal Info */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="#0284c7" />
              Personal Information
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={16} color="#94a3b8" />
                <span style={{ fontSize: '0.95rem', color: '#64748b' }}>Born:</span>
                <span style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                  {user.dob ? new Date(user.dob).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Not provided'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} color="#94a3b8" />
                <span style={{ fontSize: '0.95rem', color: '#64748b' }}>Phone:</span>
                <span style={{ fontSize: '0.95rem', color: '#1e293b' }}>{user.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Home size={16} color="#94a3b8" />
                <span style={{ fontSize: '0.95rem', color: '#64748b' }}>Joined:</span>
                <span style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                  {new Date(user.joinedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              {user.isAdmin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.95rem', color: '#64748b' }}>Status:</span>
                  <span style={{ fontSize: '0.95rem', color: '#dc2626', fontWeight: 'bold' }}>👑 Admin</span>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="#0284c7" />
              User Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {user.alias && (
                <div style={{ 
                  padding: '0.75rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Username:</span>
                  <span style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 'bold', marginLeft: '0.5rem' }}>@{user.alias}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
