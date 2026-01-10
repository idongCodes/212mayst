/**
 * file: app/components/AutoLogout.tsx
 * description: Handles auto-logout on 15m inactivity. Closing tab/browser is handled by sessionStorage.
 */

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoLogout() {
  const router = useRouter();

  useEffect(() => {
    // 15 Minutes in milliseconds
    const TIMEOUT_MS = 15 * 60 * 1000; 
    let timeoutId: NodeJS.Timeout;

    const performLogout = () => {
      // Only proceed if a user is actually logged in
      if (sessionStorage.getItem('212user')) {
        sessionStorage.removeItem('212user');
        alert("Session timed out due to inactivity.");
        router.push('/'); // Redirect to landing page
      }
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(performLogout, TIMEOUT_MS);
    };

    // Events that constitute "activity"
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

    // Attach listeners
    events.forEach(event => document.addEventListener(event, resetTimer));

    // Initialize timer
    resetTimer();

    // Cleanup listeners on unmount
    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router]);

  return null; // This component renders nothing
}