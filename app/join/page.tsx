/**
 * file: app/join/page.tsx
 * description: Updated to use sessionStorage for auto-cleanup on tab close.
 */

"use client";

import React, { useState } from 'react';
import { User, Phone, Key, ShieldCheck, ChevronRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '../actions';

export default function Join() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    alias: "",
    role: "Tenant",
    phone: "",
    doorCode: ""
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const result = await registerUser(formData);

    if (result.success && result.user) {
      // CHANGED: Use sessionStorage instead of localStorage
      // This ensures data is cleared when the tab/browser is closed.
      sessionStorage.setItem('212user', JSON.stringify(result.user));
      
      setStatus('success');
      setTimeout(() => {
        router.push('/common-room'); 
      }, 1500);
    } else {
      setStatus('error');
      setErrorMessage(result.message || "Something went wrong");
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: '#f0f9ff' }}>
      {/* ... (The rest of the UI remains identical, ommitted for brevity) ... */}
       <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem auto', backgroundColor: status === 'success' ? 'var(--light-green)' : 'var(--sandy-brown)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(244, 164, 96, 0.4)', transition: 'background-color 0.5s' }}>
            <ShieldCheck size={40} color={status === 'success' ? '#171717' : 'white'} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Join the House</h1>
          <p style={{ color: '#64748b' }}>Enter your info to get access.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: status === 'error' ? '2px solid #ef4444' : '1px solid #e2e8f0', transition: 'border-color 0.3s' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px', display: 'block' }}>First Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" name="firstName" placeholder="Jane" required value={formData.firstName} onChange={handleChange} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px', display: 'block' }}>Last Name</label>
                <input type="text" name="lastName" placeholder="Doe" required value={formData.lastName} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
              </div>
            </div>
            <div>
               <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                 <span>Alias <span style={{fontWeight: 'normal', color: '#94a3b8'}}>(Optional)</span></span>
               </label>
               <div style={{ position: 'relative' }}>
                  <Sparkles size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" name="alias" placeholder="e.g. 'The Chef'" value={formData.alias} onChange={handleChange} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
               </div>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px', display: 'block' }}>Role</label>
              <div style={{ position: 'relative' }}>
                <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', backgroundColor: 'white', appearance: 'none' }}>
                  <option value="Tenant">Tenant</option>
                  <option value="Landlord">Landlord</option>
                  <option value="First Lady">First Lady</option>
                </select>
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <ChevronRight size={16} color="#94a3b8" style={{ transform: 'rotate(90deg)' }} />
                </div>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px', display: 'block' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="tel" name="phone" placeholder="(508) 555-0123" required value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px', display: 'block' }}>Door Code</label>
              <div style={{ position: 'relative' }}>
                <Key size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="password" name="doorCode" placeholder="Enter the 4-digit code" required value={formData.doorCode} onChange={handleChange} maxLength={4} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', letterSpacing: '2px' }} />
              </div>
              {status === 'error' && (
                <div className="animate-slide-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px', color: '#ef4444', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <AlertCircle size={16} />
                  {errorMessage}
                </div>
              )}
            </div>
            <button type="submit" disabled={status === 'loading' || status === 'success'} style={{ marginTop: '1rem', backgroundColor: status === 'success' ? 'var(--light-green)' : 'var(--sky-blue)', color: status === 'success' ? '#171717' : 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(135, 206, 235, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {status === 'loading' ? <><Loader2 className="animate-spin" size={20}/>Unlocking</> : status === 'success' ? "Success! Redirecting..." : "Unlock & Join"}
            </button>
          </form>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link href="/" style={{ fontSize: '0.9rem', color: '#64748b', textDecoration: 'none' }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}