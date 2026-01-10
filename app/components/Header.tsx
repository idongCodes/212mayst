/**
 * file: app/components/Header.tsx
 * description: Replaced text logo with round clickable 'logo+favicon.jpg'.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  // HIDE HEADER on: Home page AND About page
  const isHidden = pathname === "/" || pathname === "/about";

  if (isHidden) return null;

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        // justify-content: 'center', // Uncomment if you prefer a centered logo
        backgroundColor: 'rgba(135, 206, 235, 0.6)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(135, 206, 235, 0.3)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <Link href="/" style={{ display: 'block', borderRadius: '50%', overflow: 'hidden', width: '50px', height: '50px' }}>
        <Image 
          src="/logo+favicon.jpg" 
          alt="212 May St Logo"
          width={50}
          height={50}
          style={{ 
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }} 
          priority
        />
      </Link>
    </header>
  );
}