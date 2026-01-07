import Image from "next/image";

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HERO SECTION */}
      <section 
        style={{
          position: 'relative',
          height: '70vh', /* FORCE HEIGHT */
          width: '100%',
          display: 'flex',
          alignItems: 'center', /* Vertically Center */
          justifyContent: 'flex-start', /* Left Align */
          overflow: 'hidden',
          padding: '0 2rem' /* Side padding */
        }}
      >
        {/* Background Image Container */}
        <div className="animate-fade-in" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <Image
            src="/hero.png"
            alt="Housemates"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Overlay */}
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'var(--sky-blue)', 
              opacity: 0.6 
            }} 
          /> 
        </div>

        {/* Text Content */}
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
              textShadow: '0 3px 3px rgba(0,0,0,0.5)' 
            }}
          >
            Welcome to 212 May Street's...companion web app? Like Home Sweet Home... but from your phone or computer, ha!
          </p>
        </div>
      </section>

      {/* Content Section */}
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