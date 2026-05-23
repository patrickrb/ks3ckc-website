import React, { Suspense, useEffect } from 'react';

import { Box, Container, HStack, Stack, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import PhosPanel from '@/components/HomeRedesign/PhosPanel';
import { PHOS, blink } from '@/components/HomeRedesign/phosphorTheme';
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
        await logout.mutate();
        queryCache.clear();
        refreshAuth();
        const redirectUrl = searchParams.get('redirect') || '/';
        window.location.href = redirectUrl;
      } catch (error) {
        console.error('Logout failed:', error);
        window.location.href = '/';
      }
    };

    trigger();
  }, [searchParams, queryCache, logout, refreshAuth]);

  return null;
}

function LogoutShell() {
  const lines = [
    { c: PHOS.greenDim, t: '> closing tunnels…' },
    { c: PHOS.greenDim, t: '> destroying session keys…' },
    { c: PHOS.greenDim, t: '> clearing cache…' },
    { c: PHOS.green, t: '> session terminated. 73.' },
  ];
  return (
    <Box
      position="relative"
      minH={{ base: '60vh', md: '70vh' }}
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 14 }}
      fontFamily={PHOS.mono}
      sx={{
        background: `radial-gradient(ellipse at 50% 30%, rgba(57,255,20,0.05), transparent 70%), ${PHOS.bg}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(to bottom, rgba(57,255,20,0.03) 0px, rgba(57,255,20,0.03) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          zIndex: 1,
        },
        '& > *': { position: 'relative', zIndex: 2 },
      }}
    >
      <Container maxW="lg">
        <Stack spacing={5}>
          <HStack spacing={2}>
            <Text color={PHOS.greenDim} fontSize="13px">
              $
            </Text>
            <Text color={PHOS.green} fontSize="13px">
              logout
            </Text>
            <Box
              as="span"
              display="inline-block"
              color={PHOS.green}
              animation={`${blink} 1s steps(1) infinite`}
            >
              █
            </Box>
          </HStack>

          <PhosPanel title="auth.terminate" meta="goodbye">
            <Box px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
              <Stack spacing={1.5} fontSize="13px">
                {lines.map((l, i) => (
                  <Text key={i} color={l.c}>
                    {l.t}
                  </Text>
                ))}
              </Stack>
            </Box>
          </PhosPanel>
        </Stack>
      </Container>
    </Box>
  );
}

export default function PageLogout() {
  return (
    <>
      <LogoutShell />
      <Suspense fallback={null}>
        <LogoutContent />
      </Suspense>
    </>
  );
}
