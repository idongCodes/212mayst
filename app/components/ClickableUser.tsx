/**
 * file: app/components/ClickableUser.tsx
 * description: Reusable component for clickable user names/images with tap and long press
 */

"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserProfileModal from './UserProfileModal';

interface ClickableUserProps {
  user: {
    firstName: string;
    lastName: string;
    alias?: string;
    profilePic?: string;
    role?: string;
    phone?: string;
    dob?: string;
    joinedAt?: string;
  };
  currentUser?: any;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function ClickableUser({ user, currentUser, children, style }: ClickableUserProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  // Generate profile slug
  const slug = `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`;

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 500); // 500ms for long press
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleMouseLeave = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only handle click if it wasn't a long press
    if (pressTimer) {
      e.preventDefault();
      router.push(`/profiles/${slug}`);
    }
  };

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 500); // 500ms for long press
    setPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
    };
  }, [pressTimer]);

  return (
    <>
      <div
        ref={elementRef}
        style={{
          cursor: 'pointer',
          display: 'inline-block',
          ...style
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>

      <UserProfileModal
        user={user}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        currentUser={currentUser}
      />
    </>
  );
}
