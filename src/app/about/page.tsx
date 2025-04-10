'use client';

import {
  AtSignIcon,
  ChatIcon,
  ExternalLinkIcon,
  LinkIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  Icon,
  Link,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';

import AboutUs from '@/components/AboutUs';
import HeroComponent from '@/components/HeroComponent';
import NewsItems from '@/components/NewsItems';
import RecentContacts from '@/components/RecentContacts';
import UpcomingEvents from '@/components/UpcomingEvents';

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
