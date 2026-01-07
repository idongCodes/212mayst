import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Home, Armchair, Bed, Users, Bell, Info, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "212 May Street",
  description: "A web app where housemates at 212 May Street can come together with shared experiences, memories, plans and manage tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-24`}
      >
        {/* Global Top Bar - Liquid Glass Effect */}
        <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/60">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <Image 
              src="/logo.png" 
              alt="212 May St Logo" 
              width={32} 
              height={32} 
              className="h-8 w-auto"
            />
            <h1 className="text-base font-bold">212 May St</h1>
          </Link>
        </header>

        {children}

        {/* Global Bottom Nav - Liquid Glass Effect */}
        <nav className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/20 bg-white/60 px-6 py-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/60">
          <Link href="/" className="text-gray-500 transition-colors hover:text-[var(--sky-blue)]">
            <Home size={20} />
          </Link>
          
          <Link href="/common-room" className="text-gray-500 transition-colors hover:text-[var(--sky-blue)]">
            <Armchair size={20} />
          </Link>
          
          <Link href="/my-room" className="text-gray-500 transition-colors hover:text-[var(--sky-blue)]">
            <Bed size={20} />
          </Link>
          
          <Link href="/mates" className="text-gray-500 transition-colors hover:text-[var(--sky-blue)]">
            <Users size={20} />
          </Link>
          
          <Link href="/notifications" className="text-gray-500 transition-colors hover:text-[var(--sky-blue)]">
            <Bell size={20} />
          </Link>
          
          <Link href="/about" className="text-gray-500 transition-colors hover:text-[var(--sky-blue)]">
            <Info size={20} />
          </Link>
          
          <Link href="/contact" className="text-gray-500 transition-colors hover:text-[var(--sky-blue)]">
            <Mail size={20} />
          </Link>
        </nav>
      </body>
    </html>
  );
}