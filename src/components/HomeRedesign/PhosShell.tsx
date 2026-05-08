'use client';

import { ReactNode } from 'react';

import { Box } from '@chakra-ui/react';

import PhosFooter from './PhosFooter';
import PhosNav from './PhosNav';
import { PHOS } from './phosphorTheme';

export default function PhosShell({ children }: { children: ReactNode }) {
  return (
    <Box
      bg={PHOS.bg}
      color={PHOS.paper}
      fontFamily={PHOS.mono}
      lineHeight="1.55"
      minH="100vh"
      sx={{
        '& ::selection': {
          background: PHOS.green,
          color: PHOS.bg,
        },
      }}
    >
      <PhosNav />
      <Box as="main">{children}</Box>
      <PhosFooter />
    </Box>
  );
}
