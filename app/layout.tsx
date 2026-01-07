import type { Metadata } from "next";
import "./globals.css"; 
import Image from "next/image";
import Link from "next/link";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "212 May Street",
  description: "A web app for 212 May Street housemates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* HEADER */}
        <header 
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(135, 206, 235, 0.6)', /* Sky Blue Glass */
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(135, 206, 235, 0.3)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={32} 
              height={32} 
              style={{ height: '32px', width: 'auto' }}
            />
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
              212 May St
            </h1>
          </Link>
        </header>

        {children}

        <Footer />
        <Navigation />
      </body>
    </html>
  );
}