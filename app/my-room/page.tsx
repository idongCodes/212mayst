/**
 * file: app/my-room/page.tsx
 * description: specific user profile page displaying all registration info.
 */

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Calendar, Phone, Shield, Sparkles, Clock, LogOut, Cake } from 'lucide-react';

export default function MyRoom() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Load User from Session
    const storedUser = sessionStorage.getItem('212user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('212user');
    router.push('/');
  };

  if (!user) return null; // Or a loading spinner

  // Helper to format dates
  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper for Birthday (Month/Day)
  const formatBirthday = (dobString?: string) => {
    if (!dobString) return "N/A";
    const date = new Date(dobString);
    // Since input is YYYY-MM-DD, we can just split it to avoid timezone shifts
    const parts = dobString.split('-');
    if (parts.length === 3) {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return `${monthNames[parseInt(parts[1]) - 1]} ${parseInt(parts[2])}`;
    }
    return dobString;
  };

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem', paddingBottom: '8rem', backgroundColor: '#f8fafc' }}>
      
      <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--sandy-brown)', marginBottom: '0.5rem' }}>
            My Room
          </h1>
          <p style={{ color: 'gray' }}>Your personal corner of the house.</p>
        </div>

        {/* Profile Card */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '30px', 
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
          border: '1px solid #f1f5f9'
        }}>
          
          {/* Top Banner (Color Splash) */}
          <div style={{ height: '120px', background: 'linear-gradient(135deg, var(--sky-blue) 0%, #bae6fd 100%)' }}></div>

          <div style={{ padding: '0 2rem 2rem 2rem', marginTop: '-60px', textAlign: 'center' }}>
            
            {/* Avatar */}
            <div style={{ 
              width: '120px', height: '120px', 
              borderRadius: '50%', 
              margin: '0 auto 1.5rem auto',
              border: '5px solid white',
              backgroundColor: '#e0f2fe',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {user.profilePic ? (
                <img src={user.profilePic} alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <UserIcon size={60} color="#0284c7" />
              )}
            </div>

            {/* Name & Role */}
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '5px' }}>
              {user.firstName} {user.lastName}
            </h2>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0f9ff', padding: '6px 16px', borderRadius: '20px', color: '#0284c7', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '2rem' }}>
              <Shield size={14} />
              {user.role}
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gap: '1rem', textAlign: 'left' }}>
              
              {/* Alias */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '12px', marginRight: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <Sparkles size={20} color="#f59e0b" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Alias</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#334155' }}>{user.alias || "No alias set"}</div>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '12px', marginRight: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <Phone size={20} color="#10b981" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Phone</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#334155' }}>{user.phone}</div>
                </div>
              </div>

              {/* Birthday */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '12px', marginRight: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <Cake size={20} color="#ec4899" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Birthday</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#334155' }}>{formatBirthday(user.dob)}</div>
                </div>
              </div>

              {/* Joined */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '12px', marginRight: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <Clock size={20} color="#6366f1" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Joined House</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#334155' }}>{formatDate(user.joinedAt)}</div>
                </div>
              </div>

            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              style={{ 
                marginTop: '2rem', 
                width: '100%', 
                padding: '1rem', 
                backgroundColor: '#fff1f2', 
                color: '#e11d48', 
                border: '1px solid #fecdd3', 
                borderRadius: '16px', 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
              }}
            >
              <LogOut size={20} />
              Sign Out
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}