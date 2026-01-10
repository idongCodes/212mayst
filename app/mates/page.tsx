/**
 * file: app/mates/page.tsx
 * description: Displays housemates with their Birthday (MM/DD) on the card.
 */

"use client";

import React, { useEffect, useState } from 'react';
import { User as UserIcon, Shield, Sparkles, Calendar, Cake } from 'lucide-react';
import { getUsers, User } from '../actions';

export default function Mates() {
  const [mates, setMates] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMates = async () => {
      const data = await getUsers();
      setMates(data);
      setLoading(false);
    };
    loadMates();
  }, []);

  const formatJoinedDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Helper to turn "YYYY-MM-DD" into "MM/DD"
  const formatBirthday = (dobString?: string) => {
    if (!dobString) return "N/A";
    // Split string to avoid timezone issues with Date() parsing
    const parts = dobString.split('-'); // [YYYY, MM, DD]
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}`; // MM/DD
    }
    return dobString;
  };

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem', paddingBottom: '8rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--sandy-brown)', marginBottom: '0.5rem' }}>
            House Mates
          </h1>
          <p style={{ color: 'gray' }}>Meet the neighbors.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
            Loading directory...
          </div>
        )}

        {/* Mates Grid */}
        <div className="animate-fade-in" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {mates.map((mate) => (
            <div key={mate.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              padding: '2rem', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
              border: '1px solid #f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s',
              cursor: 'default'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              
              {/* Avatar Circle */}
              <div style={{ 
                width: '80px', height: '80px', 
                backgroundColor: '#e0f2fe', 
                borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
                color: '#0284c7'
              }}>
                <UserIcon size={40} />
              </div>

              {/* Name & Alias */}
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>
                {mate.firstName} {mate.lastName}
              </h3>
              
              {mate.alias && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--sandy-brown)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <Sparkles size={14} /> {mate.alias}
                </div>
              )}

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', backgroundColor: '#e2e8f0', margin: '1rem 0' }} />

              {/* Details */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                    <Shield size={16} /> Role
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '0.95rem' }}>{mate.role}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                    <Calendar size={16} /> Joined
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '0.95rem' }}>{formatJoinedDate(mate.joinedAt)}</span>
                </div>

                {/* BIRTHDAY DISPLAY */}
                {mate.dob && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                      <Cake size={16} /> Birthday
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '0.95rem' }}>
                      {formatBirthday(mate.dob)}
                    </span>
                  </div>
                )}

              </div>

            </div>
          ))}
        </div>

        {!loading && mates.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
            No housemates found. Strange... is the house empty? 👻
          </div>
        )}

      </div>
    </main>
  );
}