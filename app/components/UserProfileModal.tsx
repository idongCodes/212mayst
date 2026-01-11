/**
 * file: app/components/UserProfileModal.tsx
 * description: Modal component for showing user info on long press
 */

"use client";

import { X, Calendar, Phone, Home, User } from 'lucide-react';

interface UserProfileModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
}

export default function UserProfileModal({ user, isOpen, onClose, currentUser }: UserProfileModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        maxWidth: '400px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f1f5f9'
          }}
        >
          <X size={20} color="#64748b" />
        </button>

        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#e0f2fe',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid white',
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
              <User size={32} color="#0284c7" />
            )}
          </div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>
            {user.firstName} {user.lastName}
          </h3>
          {user.alias && (
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>
              @{user.alias}
            </p>
          )}
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#0284c7', fontWeight: 'bold' }}>
            {user.role}
          </p>
        </div>

        {/* Quick Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={16} color="#94a3b8" />
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Born:</span>
            <span style={{ fontSize: '0.85rem', color: '#1e293b' }}>
              {new Date(user.dob).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Phone size={16} color="#94a3b8" />
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Phone:</span>
            <span style={{ fontSize: '0.85rem', color: '#1e293b' }}>{user.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Home size={16} color="#94a3b8" />
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Joined:</span>
            <span style={{ fontSize: '0.85rem', color: '#1e293b' }}>
              {new Date(user.joinedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
