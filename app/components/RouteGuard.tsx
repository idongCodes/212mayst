/**
 * file: app/components/RouteGuard.tsx
 * description: Restricts access to private routes for logged-out users.
 */

"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Define the routes anyone can see
const PUBLIC_ROUTES = ['/', '/login', '/join'];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Check if the current route is public
    if (PUBLIC_ROUTES.includes(pathname)) {
      setIsAuthorized(true);
      return;
    }

    // 2. If route is private, check for user session
    const user = sessionStorage.getItem('212user');

    if (!user) {
      // User is Guest trying to access Private Route -> Block & Redirect
      setIsAuthorized(false);
      router.push('/login'); 
    } else {
      // User is Logged In -> Allow
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  // Prevent flashing of protected content while checking
  // Only render children if authorized OR if we are on a public route
  if (!isAuthorized && !PUBLIC_ROUTES.includes(pathname)) {
    return null; // Render nothing (or a loading spinner) while redirecting
  }

  return <>{children}</>;
}