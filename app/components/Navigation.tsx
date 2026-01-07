"use client"; // This directive is required for usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Armchair, Bed, Users, Bell, Info, Mail, MessageCircle } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  // Helper to determine active style
  const isActive = (path: string) => pathname === path;

  // Base styling for nav items
  const linkClass = (path: string) =>
    `transition-colors ${
      isActive(path) 
        ? "text-[var(--sky-blue)] font-bold" // Active Style
        : "text-gray-500 hover:text-[var(--sky-blue)]" // Inactive Style
    }`;

  return (
    <>
      {/* Global Bottom Nav - Left Aligned */}
      <nav className="fixed bottom-6 left-4 z-50 flex items-center gap-3 rounded-full border border-white/20 bg-white/60 px-5 py-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/60">
        <Link href="/" className={linkClass("/")}>
          <Home size={20} />
        </Link>

        <Link href="/common-room" className={linkClass("/common-room")}>
          <Armchair size={20} />
        </Link>

        <Link href="/my-room" className={linkClass("/my-room")}>
          <Bed size={20} />
        </Link>

        <Link href="/mates" className={linkClass("/mates")}>
          <Users size={20} />
        </Link>

        <Link href="/notifications" className={linkClass("/notifications")}>
          <Bell size={20} />
        </Link>

        <Link href="/about" className={linkClass("/about")}>
          <Info size={20} />
        </Link>

        <Link href="/contact" className={linkClass("/contact")}>
          <Mail size={20} />
        </Link>
      </nav>

      {/* Standalone Chat Button - Right Aligned */}
      <Link
        href="/chat"
        className={`fixed bottom-6 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/60 shadow-xl backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-black/60 ${
          isActive("/chat")
            ? "text-[var(--sky-blue)] border-[var(--sky-blue)]" // Active Style
            : "text-gray-500 hover:text-[var(--sky-blue)]"
        }`}
      >
        <MessageCircle size={24} />
      </Link>
    </>
  );
}