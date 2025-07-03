'use client';

import { Box, Container } from '@chakra-ui/react';

import HeroComponent from '@/components/HeroComponent';
import UpcomingEvents from '@/components/UpcomingEvents';

export default function EventsPage() {
  return (
    <Box>
      <HeroComponent />
      <Container maxW="container.lg" py={10}>
        <UpcomingEvents />
      </Container>
    </Box>
  );
}
