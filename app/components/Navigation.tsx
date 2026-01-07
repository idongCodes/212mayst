"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Armchair, Bed, Users, Bell, Info, Mail, MessageCircle } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // Helper for Link Styles
  const getLinkStyle = (path: string) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isActive(path) ? 'var(--sandy-brown)' : '#9ca3af', // Gray fallback
    fontWeight: isActive(path) ? 'bold' : 'normal',
    transition: 'color 0.2s ease'
  });

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav 
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1rem',
          zIndex: 100,
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
        <Link href="/contact" style={getLinkStyle("/contact")}><Mail size={20} /></Link>
      </nav>

      {/* Chat Button */}
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