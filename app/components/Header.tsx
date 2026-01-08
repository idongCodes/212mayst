"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // If we are on the Home page, render NOTHING.
  if (isHome) return null;

  // Otherwise, render the standard Sky Blue Glass header
  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(135, 206, 235, 0.6)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(135, 206, 235, 0.3)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <Link href="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: 'var(--text-color)'
        }}>
          212 May St
        </h1>
      </Link>
    </header>
  );
}