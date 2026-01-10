/**
 * file: app/mates/page.tsx
 * description: Displays housemates with profile pictures.
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
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatBirthday = (dobString?: string) => {
    if (!dobString) return "N/A";
    const parts = dobString.split('-'); 
    if (parts.length === 3) return `${parts[1]}/${parts[2]}`;
    return dobString;
  };

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem', paddingBottom: '8rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--sandy-brown)', marginBottom: '0.5rem' }}>House Mates</h1>
          <p style={{ color: 'gray' }}>Meet the neighbors.</p>
        </div>

        {loading && <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Loading directory...</div>}

        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {mates.map((mate) => (
            <div key={mate.id} style={{ 
              backgroundColor: 'white', borderRadius: '24px', padding: '2rem', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              transition: 'transform 0.2s', cursor: 'default'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              
              {/* Avatar Circle */}
              <div style={{ 
                width: '100px', height: '100px', 
                borderRadius: '50%', overflow: 'hidden',
                backgroundColor: '#e0f2fe', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem', color: '#0284c7',
                border: '3px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }}>
                {mate.profilePic ? (
                  <img src={mate.profilePic} alt={mate.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UserIcon size={48} />
                )}
              </div>

              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>
                {mate.firstName} {mate.lastName}
              </h3>
              
              {mate.alias && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--sandy-brown)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <Sparkles size={14} /> {mate.alias}
                </div>
              )}

              <div style={{ width: '100%', height: '1px', backgroundColor: '#e2e8f0', margin: '1rem 0' }} />

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}><Shield size={16} /> Role</div>
                  <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '0.95rem' }}>{mate.role}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}><Calendar size={16} /> Joined</div>
                  <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '0.95rem' }}>{formatJoinedDate(mate.joinedAt)}</span>
                </div>
                {mate.dob && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}><Cake size={16} /> Birthday</div>
                    <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '0.95rem' }}>{formatBirthday(mate.dob)}</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

        {!loading && mates.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No housemates found. Strange... is the house empty? 👻</div>}
      </div>
    </main>
  );
}