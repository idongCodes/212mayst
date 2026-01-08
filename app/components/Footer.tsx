import Link from "next/link";

export default function Footer() {
  return (
    <footer 
      style={{
        width: '100%',
        backgroundColor: 'var(--sky-blue)', // Solid Sky Blue background
        color: 'white',
        padding: '3rem 1rem 8rem 1rem', // Extra bottom padding so mobile nav doesn't cover it
        textAlign: 'center',
        marginTop: 'auto', // Pushes footer to bottom if content is short
        borderTop: '4px solid rgba(255,255,255,0.2)' // Subtle top highlight
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
          &copy; {new Date().getFullYear()} 212 May Street
        </p>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Built with love by{" "}
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