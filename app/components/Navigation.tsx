/**
 * file: app/components/Navigation.tsx
 * description: Added conditional Logout/Login icon based on session status.
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Armchair, Bed, Users, Bell, Info, Mail, MessageCircle, LogOut, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status whenever the path changes (e.g., after login or redirect)
  useEffect(() => {
    const checkLogin = () => {
      const user = sessionStorage.getItem('212user');
      setIsLoggedIn(!!user);
    };
    
    checkLogin();
    
    // Optional: Add event listener if you have storage events, 
    // but pathname dependency usually covers navigation-based changes.
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('212user');
    setIsLoggedIn(false);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  const getLinkStyle = (path: string) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isActive(path) ? 'var(--sandy-brown)' : '#9ca3af',
    fontWeight: isActive(path) ? 'bold' : 'normal',
    transition: 'color 0.2s ease',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0
  });

  return (
    <>
      <nav 
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1rem',
          zIndex: 100,
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly higher opacity for icons
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50px',
          padding: '12px 20px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Link href="/" style={getLinkStyle("/")}><Home size={20} /></Link>
        <Link href="/common-room" style={getLinkStyle("/common-room")}><Armchair size={20} /></Link>
        <Link href="/my-room" style={getLinkStyle("/my-room")}><Bed size={20} /></Link>
        <Link href="/mates" style={getLinkStyle("/mates")}><Users size={20} /></Link>
        <Link href="/notifications" style={getLinkStyle("/notifications")}><Bell size={20} /></Link>
        <Link href="/about" style={getLinkStyle("/about")}><Info size={20} /></Link>
        
        {/* Separator */}
        <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0' }}></div>

        {/* Conditional Auth Icon */}
        {isLoggedIn ? (
          <button 
            onClick={handleLogout} 
            style={getLinkStyle("logout")} 
            title="Log Out"
          >
            <LogOut size={20} color="#ef4444" /> {/* Red for logout */}
          </button>
        ) : (
          <Link 
            href="/login" 
            style={getLinkStyle("/login")}
            title="Log In"
          >
            <LogIn size={20} color="var(--sky-blue)" />
          </Link>
        )}
      </nav>

      {/* Chat Button (unchanged) */}
      <Link
        href="/chat"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1rem',
          zIndex: 100,
          height: '48px',
          width: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--light-green)',
          color: isActive("/chat") ? 'white' : '#171717',
          borderRadius: '50%',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: isActive("/chat") ? '2px solid white' : 'none'
        }}
      >
        <MessageCircle size={24} />
      </Link>
    </>
  );
}