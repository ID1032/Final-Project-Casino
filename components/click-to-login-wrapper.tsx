'use client';

import { useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

interface ClickToLoginWrapperProps {
  children: React.ReactNode;
}

export function ClickToLoginWrapper({ children }: ClickToLoginWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Don't show modal if user is authenticated or loading
      if (isAuthenticated || isLoading) {
        return;
      }

      // Check if the click target is within the sidebar
      const sidebar = document.querySelector('[data-sidebar="sidebar"]');
      if (sidebar && sidebar.contains(event.target as Node)) {
        return;
      }

      // Check if the click target is within the sidebar trigger (mobile menu button)
      const sidebarTrigger = document.querySelector('[data-sidebar="trigger"]');
      if (sidebarTrigger && sidebarTrigger.contains(event.target as Node)) {
        return;
      }

      // Check if the click target is within the login modal itself
      const loginModal = document.querySelector('[role="dialog"]');
      if (loginModal && loginModal.contains(event.target as Node)) {
        return;
      }

      // Check if the click target is within the login button in the header
      const loginButton = document.querySelector('[data-id="login-button"]');
      if (loginButton && loginButton.contains(event.target as Node)) {
        return;
      }

      // Trigger the existing login modal by clicking the login button
      const loginBtn = document.querySelector(
        '[data-id="login-button"]'
      ) as HTMLButtonElement;
      if (loginBtn) {
        loginBtn.click();
      }
    };

    // Add click event listener to the document
    document.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isAuthenticated, isLoading]);

  return (
    <div ref={wrapperRef} className='h-full'>
      {children}
    </div>
  );
}
