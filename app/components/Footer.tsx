/**
 * file: app/components/Footer.tsx
 * description: Added donation modal with links to PayPal, Venmo, and Cash App.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, CreditCard, Banknote, Send, Heart } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to close modal when clicking outside content
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <footer 
        style={{
          width: '100%',
          backgroundColor: isAbout ? 'transparent' : 'var(--sky-blue)', 
          color: 'white',
          padding: '3rem 1rem 8rem 1rem', 
          textAlign: 'center',
          marginTop: 'auto', 
          borderTop: isAbout ? 'none' : '4px solid rgba(255,255,255,0.2)' 
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
            &copy; {new Date().getFullYear()} 212 May Street
          </p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Built with 🫶 by{" "}
            <Link 
              href="https://idong-essien.vercel.app" 
              target="_blank" 
              style={{ 
                fontWeight: 'bold', 
                color: 'white', 
                textDecoration: 'underline',
                textUnderlineOffset: '4px'
              }}
            >
              idongCodes
            </Link>
          </p>
          
          {/* Donation Trigger */}
          <p 
            onClick={() => setIsModalOpen(true)}
            style={{ 
              marginTop: '1rem', 
              fontSize: '0.85rem', 
              opacity: 0.8, 
              cursor: 'pointer',
              textDecoration: 'underline dotted',
              transition: 'opacity 0.2s'
            }}
            className="hover:opacity-100"
          >
            Consider donating here & there to help keep this project going.
          </p>
        </div>
      </footer>

      {/* DONATION MODAL */}
      {isModalOpen && (
        <div 
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          className="animate-fade-in"
        >
          <div style={{
            backgroundColor: 'white',
            color: '#1e293b',
            padding: '2rem',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '350px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                padding: '8px',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                margin: '0 auto 1rem auto', 
                width: '60px', height: '60px', 
                backgroundColor: '#ffe4e6', 
                borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <Heart size={30} color="#fb7185" fill="#fb7185" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Support the Dev</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                Thanks for keeping the lights on! Choose your preferred app below.
              </p>
            </div>

            {/* Links Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* PayPal */}
              <a 
                href="https://paypal.me/idongcodes" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '16px',
                  backgroundColor: '#0070ba', // PayPal Blue
                  color: 'white',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0, 112, 186, 0.2)'
                }}
              >
                <CreditCard size={24} />
                <span>PayPal</span>
              </a>

              {/* Venmo */}
              <a 
                href="https://www.venmo.com/u/idongcodes" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '16px',
                  backgroundColor: '#008CFF', // Venmo Blue
                  color: 'white',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0, 140, 255, 0.2)'
                }}
              >
                <Send size={24} />
                <span>Venmo</span>
              </a>

              {/* Cash App */}
              <a 
                href="https://cash.app/$richardxessien" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '16px',
                  backgroundColor: '#00D632', // CashApp Green
                  color: 'white',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0, 214, 50, 0.2)'
                }}
              >
                <Banknote size={24} />
                <span>Cash App</span>
              </a>

            </div>
          </div>
        </div>
      )}
    </>
  );
}