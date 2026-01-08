import Image from "next/image";
import Link from "next/link";
// Import icons for the features
import { MessageCircle, Calendar, ClipboardList } from "lucide-react";

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HERO SECTION */}
      <section 
        style={{
          position: 'relative',
          height: '70vh', 
          width: '100%',
          display: 'flex',
          alignItems: 'center', 
          justifyContent: 'flex-start', 
          overflow: 'hidden',
          padding: '0 2rem' 
        }}
      >
        {/* Background Video Container */}
        <div className="animate-fade-in" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center' 
            }}
          >
            <source src="/heroVid.mov" />
            Your browser does not support the video tag.
          </video>

          {/* Vignette & Fade Layers */}
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'radial-gradient(circle, rgba(0,0,0,0) 25%, var(--sky-blue) 100%)',
              opacity: 0.8 
            }} 
          /> 
          <div 
            style={{ 
              position: 'absolute', 
              bottom: 0, left: 0, right: 0, 
              height: '30%', 
              background: 'linear-gradient(to top, var(--sky-blue) 15%, transparent 100%)',
            }} 
          />
        </div>

        {/* Text Content + Buttons */}
        <div className="animate-slide-in" style={{ position: 'relative', zIndex: 10, maxWidth: '600px', textAlign: 'left' }}>
          <h1 
            style={{ 
              fontSize: '3.5rem', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '1rem',
              textShadow: '0 5px 5px rgba(0,0,0,0.5)'
            }}
          >
            212 May Street
          </h1>
          <p 
            style={{ 
              fontSize: '1.25rem', 
              fontWeight: '500', 
              color: 'white',
              marginBottom: '2rem',
              textShadow: '0 3px 3px rgba(0,0,0,0.5)' 
            }}
          >
            Welcome to 212 May Street's...companion web app? Like Home Sweet Home... but from your phone or computer, ha!
          </p>

          <div style={{ display: 'flex', gap: '15px' }}>
            <Link href="/login" className="hero-btn btn-login">
              Login
            </Link>
            <Link href="/join" className="hero-btn btn-join">
              Join 212 May St
            </Link>
          </div>
        </div>
      </section>

      {/* NEW FEATURES SECTION (Solid Sky Blue) */}
      <section 
        style={{ 
          backgroundColor: 'var(--sky-blue)', 
          padding: '4rem 2rem', 
          display: 'flex', 
          justifyContent: 'center' 
        }}
      >
        <div 
          style={{ 
            maxWidth: '1200px', 
            width: '100%', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '2rem', 
            justifyContent: 'center' 
          }}
        >
          {/* Feature 1 */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '20px', 
            padding: '2rem', 
            flex: '1 1 300px', // Responsive flex basis
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            textAlign: 'center',
            color: 'var(--text-color)'
          }}>
            <div style={{ color: 'var(--sandy-brown)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <MessageCircle size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>House Chat</h3>
            <p style={{ color: 'gray' }}>Stay connected with everyone. Coordinate plans, share updates, or just say hi.</p>
          </div>

          {/* Feature 2 */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '20px', 
            padding: '2rem', 
            flex: '1 1 300px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            textAlign: 'center',
            color: 'var(--text-color)'
          }}>
            <div style={{ color: 'var(--sandy-brown)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <Calendar size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Events & Plans</h3>
            <p style={{ color: 'gray' }}>Never miss a house dinner or movie night. check the calendar and join in.</p>
          </div>

          {/* Feature 3 */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '20px', 
            padding: '2rem', 
            flex: '1 1 300px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            textAlign: 'center',
            color: 'var(--text-color)'
          }}>
            <div style={{ color: 'var(--sandy-brown)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <ClipboardList size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Tasks & Chores</h3>
            <p style={{ color: 'gray' }}>Keep the house running smoothly. See what needs doing and lend a hand.</p>
          </div>

        </div>
      </section>

      {/* Existing Content Section */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <div 
          style={{ 
            backgroundColor: 'var(--bg-color)', 
            padding: '2rem', 
            borderRadius: '20px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }}
        >
          <h2 style={{ color: 'var(--sandy-brown)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            What's New?
          </h2>
          <p style={{ color: 'gray' }}>
            Check the <span style={{ color: 'var(--sky-blue)', fontWeight: 'bold' }}>Common Room</span> to see who's around, or visit <span style={{ color: 'var(--sky-blue)', fontWeight: 'bold' }}>Mates</span> to see what everyone is up to.
          </p>
        </div>
      </section>

    </main>
  );
}