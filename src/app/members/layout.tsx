import { ReactNode } from 'react';

import { Box } from '@chakra-ui/react';

import { NavBar } from '@/components/NavBar';

export default function MembersLayout({ children }: { children: ReactNode }) {
  return (
    <Box>
      <NavBar />
      {children}
    </Box>
  );
}