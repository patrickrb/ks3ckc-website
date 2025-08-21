import React, { Suspense, useEffect } from 'react';

import { Center, Spinner } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc/client';

function LogoutContent() {
  const queryCache = useQueryClient();
  const logout = trpc.auth.logout.useMutation();
  const { refreshAuth } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const trigger = async () => {
      if (!logout.isIdle) return;

      try {
        // Perform logout
        await logout.mutate();

        // Clear React Query cache
        queryCache.clear();

        // Call refreshAuth to update authentication state
        refreshAuth();

        // Get the redirect URL or default to home
        const redirectUrl = searchParams.get('redirect') || '/';

        // Force a complete page reload and redirect
        window.location.href = redirectUrl;
      } catch (error) {
        console.error('Logout failed:', error);
        // Fallback to home page if logout fails
        window.location.href = '/';
      }
    };

    trigger();
  }, [searchParams, queryCache, logout, refreshAuth]);

  return (
    <Center flex="1">
      <Spinner />
    </Center>
  );
}

export default function PageLogout() {
  return (
    <Suspense
      fallback={
        <Center flex="1">
          <Spinner />
        </Center>
      }
    >
      <LogoutContent />
    </Suspense>
  );
}
