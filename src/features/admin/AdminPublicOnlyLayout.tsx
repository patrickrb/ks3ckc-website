'use client';

import { ReactNode } from 'react';

import { Box, Container } from '@chakra-ui/react';

import { PHOS } from '@/components/HomeRedesign/phosphorTheme';

type AdminPublicOnlyLayout = {
  children: ReactNode;
};

export const AdminPublicOnlyLayout = ({ children }: AdminPublicOnlyLayout) => {
  return (
    <Box
      as="section"
      position="relative"
      minH={{ base: 'auto', md: '70vh' }}
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 14 }}
      fontFamily={PHOS.mono}
      sx={{
        background: `radial-gradient(ellipse at 50% 30%, rgba(255,176,0,0.05), transparent 70%), ${PHOS.bg}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(to bottom, rgba(255,176,0,0.03) 0px, rgba(255,176,0,0.03) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          zIndex: 1,
        },
        '& > *': { position: 'relative', zIndex: 2 },
      }}
    >
      <Container maxW="lg">{children}</Container>
    </Box>
  );
};
