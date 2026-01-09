import React from 'react';
import { User, Heart, Crown, Baby, MapPin } from 'lucide-react';

export default function About() {
  
  const family = [
    {
      name: "Kennedy (Kay) Udechukwu",
      age: "31",
      role: "Landlord & Owner",
      icon: <Crown size={32} color="#F4A460" />, 
      desc: "Nigeria to America. Loving father and husband. Engineering degree, great with finances, loves soccer, very sociable, all around cool guy."
    },
    {
      name: "Stephanie (Steph) Udechukwu",
      age: "34",
      role: "First Lady",
      icon: <Heart size={32} color="#FF69B4" />, 
      desc: "Kay's adored and loving wife. Steph is a Portuguese speaker, dance, health and fitness guru, can slay Portuguese AND Nigerian dishes, and loves reality TV."
    },
    {
      name: "Kennedy Jr (Kennegium 😅)",
      age: "Baby Menace",
      role: "1st Prince of 212 May St",
      icon: <Baby size={32} color="#87CEEB" />, 
      desc: "Son to Kay & Steph. KJ is craaaazyy but cute asf, more to be determined lmao."
    }
  ];

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', overflowY: 'auto' }}>
      
      {/* 1. BACKGROUND VIDEO */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
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
          <source src="/about.mp4" />
        </video>
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)' 
          }} 
        />
      </div>

      {/* 2. SCROLLABLE CONTENT */}
      <div 
        style={{ 
          position: 'relative', 
          zIndex: 10, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '6rem 2rem 6rem 2rem' 
        }}
      >
        
        {/* Title Section */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem', color: 'white' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            textShadow: '0 4px 10px rgba(0,0,0,0.5)',
            marginBottom: '1rem'
          }}>
            Our Story
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            More than just a street address. It's where the magic happens.
          </p>
        </div>

        {/* --- THE HQ CARD --- */}
        <div 
          className="animate-slide-in"
          style={{
            maxWidth: '800px',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', 
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '30px',
            padding: '3rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--sandy-brown)', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
              The HQ
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '20px' }}>
              <MapPin size={18} color="var(--sky-blue)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Worcester, MA 01602</span>
            </div>
          </div>
          
          {/* SECTION 1: OUR HOOD */}
          <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--sky-blue)' }}>
            Our Hood
          </h3>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#e5e5e5', marginBottom: '1.5rem' }}>
            Located in a charming, leafy neighborhood just moments from Worcester State University, <strong>212 May Street</strong> offers the perfect blend of quiet residential living and city accessibility. This classic New England multi-family home features spacious interiors, abundant natural light, and a backyard perfect for summer gatherings.
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '2rem 0' }} />

          {/* SECTION 2: OUR BUNKER */}
          <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--sky-blue)' }}>
            Our Bunker
          </h3>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#d4d4d4', marginBottom: '2rem', fontStyle: 'italic' }}>
            "This beautifully renovated home is just what you are looking for. Kitchen features stainless steel appliances, granite countertops, and new cabinets. Enjoy entertaining in the spacious living room. Dining room features beautiful hardwood floors, original woodwork and bench seat. Enjoy the convenience of the first floor laundry. Master bedroom, three additional bedrooms and a full bath are located on the second floor. Third floor offers the bonus of two additional good sized bedrooms. New windows. Relaxing front porch."
          </p>

          {/* Stats Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '1.5rem', 
            borderTop: '1px solid rgba(255,255,255,0.1)', 
            paddingTop: '2rem' 
          }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{ fontSize: '0.85rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '1px' }}>Built</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>1900</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{ fontSize: '0.85rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '1px' }}>Interior</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>2,286 sqft</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{ fontSize: '0.85rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '1px' }}>Lot Size</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>8,712 sqft</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{ fontSize: '0.85rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '1px' }}>Layout</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>4 Bed / 2 Bath</span>
            </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{ fontSize: '0.85rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '1px' }}>Heating</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Gas</span>
            </div>

          </div>
        </div>

        {/* --- MISSION & RULES CARD --- */}
        <div 
          className="animate-slide-in"
          style={{
            maxWidth: '800px',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', 
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '30px',
            padding: '3rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            marginBottom: '4rem'
          }}
        >
          <h2 style={{ color: 'var(--sandy-brown)', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            The Mission
          </h2>
          
          <p style={{ lineHeight: '1.8', marginBottom: '2rem', fontSize: '1.1rem', color: '#e5e5e5' }}>
            Welcome to the 212 May Street companion app. We built this in an endeavour to help make communal living feel fun, easier, funnier, and more connected. Whether it's coordinating the next movie night, figuring out whose turn it is to buy milk, making a big announcement or just sharing a meme in the house chat, this is your digital home base, a full-blown dashboard for your daily lives.
          </p>

          <hr style={{ border: 'none', borderTop: '2px dashed rgba(255,255,255,0.2)', margin: '2rem 0' }} />

          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--sky-blue)' }}>
            House Rules
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#a3a3a3', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            (Subject to reg updates)
          </p>

          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem', color: '#e5e5e5' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🧼</span> 
              <span style={{ fontSize: '1.1rem' }}>Leave the common areas cleaner than you found them.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🎧</span> 
              <span style={{ fontSize: '1.1rem' }}>Quiet hours after 9 PM (unless it's a party).</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>❤️</span> 
              <span style={{ fontSize: '1.1rem' }}>Show kindness and consider each other!</span>
            </li>
          </ul>
        </div>

        {/* --- MEET THE FAM --- */}
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <h2 className="animate-fade-in" style={{ 
            textAlign: 'center', 
            color: 'white', 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '3rem', 
            textShadow: '0 2px 5px rgba(0,0,0,0.5)' 
          }}>
            Meet the Fam
          </h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
            {family.map((person, index) => (
              <div 
                key={index}
                className="animate-slide-in"
                style={{
                  flex: '1 1 350px', 
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(15px)',
                  WebkitBackdropFilter: 'blur(15px)',
                  borderRadius: '25px',
                  padding: '2rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  animationDelay: `${index * 0.2}s` 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    padding: '12px', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {person.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{person.name}</h3>
                    <span style={{ color: 'var(--sky-blue)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {person.role}
                    </span>
                  </div>
                </div>

                <div style={{ alignSelf: 'flex-start' }}>
                   <span style={{ 
                     backgroundColor: 'rgba(255,255,255,0.15)', 
                     padding: '4px 12px', 
                     borderRadius: '20px', 
                     fontSize: '0.85rem',
                     fontWeight: 'bold',
                     color: '#e5e5e5'
                   }}>
                     Age: {person.age}
                   </span>
                </div>

                <p style={{ lineHeight: '1.6', color: '#d4d4d4', flex: 1 }}>
                  {person.desc}
                </p>

              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}