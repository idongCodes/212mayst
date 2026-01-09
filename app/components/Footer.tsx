"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAbout = pathname === "/about";

  return (
    <footer 
      style={{
        width: '100%',
        // Conditional Background: Transparent on About, Sky Blue everywhere else
        backgroundColor: isAbout ? 'transparent' : 'var(--sky-blue)', 
        color: 'white',
        padding: '3rem 1rem 8rem 1rem', 
        textAlign: 'center',
        marginTop: 'auto', 
        // Remove border on About page for a cleaner look
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
      </div>
    </footer>
  );
}