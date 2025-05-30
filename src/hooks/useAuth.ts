'use client';

import { useEffect } from 'react';

import { trpc } from '@/lib/trpc/client';

/**
 * Custom hook to manage authentication state across the application
 * Ensures components re-render when auth state changes
 */
export const useAuth = () => {
  const utils = trpc.useContext();

  // Use query with proper settings for auth state tracking
  const {
    data: account,
    isLoading,
    error,
  } = trpc.account.get.useQuery(undefined, {
    // Keep a shorter stale time to check auth status frequently
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 0,
  });

  const isLoggedIn = !!account;

  // Setup a custom event for auth state changes
  useEffect(() => {
    // Function to handle authentication state changes
    const handleAuthChange = () => {
      utils.account.get.invalidate();
    };

    // Listen for storage events (for cross-tab synchronization)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth' || event.key?.includes('token')) {
        handleAuthChange();
      }
    };

    // Create a custom event for auth state changes
    const authChangeEvent = 'auth-state-change';

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(authChangeEvent, handleAuthChange);

    // Clean up event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(authChangeEvent, handleAuthChange);
    };
  }, [utils]);

  // Function to refresh auth state
  const refreshAuth = () => {
    utils.account.get.invalidate();
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth-state-change'));
  };

  return {
    account,
    isLoggedIn,
    refreshAuth,
    isLoading,
    error,
  };
};
