'use client';

import { Box } from '@chakra-ui/react';

import PhosEvents from './PhosEvents';
import PhosFreqs from './PhosFreqs';
import PhosHero from './PhosHero';
import PhosJoin from './PhosJoin';
import PhosMorse from './PhosMorse';
import PhosProjects from './PhosProjects';

export default function PhosphorPage() {
  return (
    <Box>
      <PhosHero />
      <PhosFreqs />
      <PhosMorse />
      <PhosEvents />
      <PhosProjects />
      <PhosJoin />
    </Box>
  );
}
