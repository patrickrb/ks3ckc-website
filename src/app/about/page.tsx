'use client';

import { Box, Container } from '@chakra-ui/react';

import AboutUs from '@/components/AboutUs';
import HeroComponent from '@/components/HeroComponent';

export default function AboutPage() {
  return (
    <Box>
      <HeroComponent />
      <Container maxW="container.lg" py={10}>
        <AboutUs />
      </Container>
    </Box>
  );
}
