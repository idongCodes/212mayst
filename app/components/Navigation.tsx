/**
 * file: app/components/Navigation.tsx
 * description: Restricts navigation items for guests (Home & Login only).
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Armchair, Bed, Users, Bell, Info, MessageCircle, LogOut, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status on mount and path change
    const checkLogin = () => {
      const user = sessionStorage.getItem('212user');
      setIsLoggedIn(!!user);
    };
    checkLogin();
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
          left: '50%',
          transform: 'translateX(-50%)', // Center the nav
          zIndex: 100,
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50px',
          padding: '12px 25px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* ALWAYS VISIBLE: Home */}
        <Link href="/" style={getLinkStyle("/")} title="Home"><Home size={24} /></Link>
        
        {/* AUTHENTICATED ONLY LINKS */}
        {isLoggedIn && (
          <>
            <Link href="/common-room" style={getLinkStyle("/common-room")} title="Common Room"><Armchair size={24} /></Link>
            <Link href="/my-room" style={getLinkStyle("/my-room")} title="My Room"><Bed size={24} /></Link>
            <Link href="/mates" style={getLinkStyle("/mates")} title="Mates"><Users size={24} /></Link>
            <Link href="/notifications" style={getLinkStyle("/notifications")} title="Notifications"><Bell size={24} /></Link>
            <Link href="/about" style={getLinkStyle("/about")} title="About"><Info size={24} /></Link>
          </>
        )}

        {/* SEPARATOR (Only if logged in to separate logout) */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }}></div>

        {/* LOGIN / LOGOUT TOGGLE */}
        {isLoggedIn ? (
          <button 
            onClick={handleLogout} 
            style={getLinkStyle("logout")} 
            title="Log Out"
          >
            <LogOut size={24} color="#ef4444" />
          </button>
        ) : (
          <Link 
            href="/login" 
            style={getLinkStyle("/login")}
            title="Log In"
          >
            <LogIn size={24} color="var(--sky-blue)" />
          </Link>
        )}
      </nav>

      {/* CHAT BUTTON - Only show if Logged In */}
      {isLoggedIn && (
        <Link
          href="/chat"
          style={{
            position: 'fixed',
            bottom: '6rem', // Moved up slightly to avoid overlap
            right: '1rem',
            zIndex: 100,
            height: '56px',
            width: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--light-green)',
            color: isActive("/chat") ? 'white' : '#171717',
            borderRadius: '50%',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: isActive("/chat") ? '2px solid white' : 'none'
          }}
        >
          <MessageCircle size={28} />
        </Link>
      )}
    </>
  );
}