import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import Navigation from "./components/Navigation"; // Import the new component

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
        {/* Global Top Bar */}
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

        {/* Replaced hardcoded nav with the Client Component */}
        <Navigation />
      </body>
    </html>
  );
}