/**
 * file: app/join/page.tsx
 * description: Registration form with Profile Picture upload.
 */

"use client";

import React, { useState, useRef } from 'react';
import { User, Phone, Key, ShieldCheck, ChevronRight, AlertCircle, Loader2, Sparkles, Calendar, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '../actions';

export default function Join() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    alias: "",
    dob: "",
    role: "Tenant",
    phone: "",
    doorCode: "",
    profilePic: "" // <--- Base64 string
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

  // Handle Image Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const result = await registerUser(formData);

    if (result.success && result.user) {
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
      
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Join the House</h1>
          <p style={{ color: '#64748b' }}>Create your profile.</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: status === 'error' ? '2px solid #ef4444' : '1px solid #e2e8f0' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* PROFILE PIC UPLOADER */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ 
                  width: '100px', height: '100px', borderRadius: '50%', 
                  backgroundColor: '#f1f5f9', border: '2px dashed #cbd5e1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', overflow: 'hidden', position: 'relative'
                }}
              >
                {formData.profilePic ? (
                  <img src={formData.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                    <Camera size={24} style={{ margin: '0 auto 4px auto' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>Add Photo</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>
            </div>

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
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px', display: 'block' }}>Date of Birth</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="date" name="dob" required value={formData.dob} onChange={handleChange} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', color: '#1e293b' }} />
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
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><ChevronRight size={16} color="#94a3b8" style={{ transform: 'rotate(90deg)' }} /></div>
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
              {status === 'loading' ? <>Unlocking <Loader2 className="animate-spin" size={20}/></> : status === 'success' ? "Success! Redirecting..." : "Unlock & Join"}
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