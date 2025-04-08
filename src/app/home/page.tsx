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

export default function HomePage() {
  return (
    <Box>
      <HeroComponent />
      <Container maxW="container.lg" py={10}>
        <Flex
          direction={['column', 'row']}
          justify="space-around"
          align="center"
        >
          <Box textAlign="center" p={3}>
            <Icon as={LinkIcon} mr={2} w={6} h={6} />
            <Link href="https://seckc.org" isExternal fontSize="lg">
              SECKC Website <ExternalLinkIcon mx="2px" />
            </Link>
          </Box>
          <Box textAlign="center" p={3}>
            <Icon as={AtSignIcon} mr={2} w={6} h={6} />
            <Link href="https://groups.io/g/SecKCARC/" isExternal fontSize="lg">
              Mailing List
            </Link>
          </Box>
          <Box textAlign="center" p={3}>
            <Icon as={ChatIcon} mr={2} w={6} h={6} />
            <Link href="https://discord.gg/seckc" isExternal fontSize="lg">
              Join our Discord <ExternalLinkIcon mx="2px" />
            </Link>
          </Box>
        </Flex>
      </Container>
      <Container maxW="container.lg">
        <SimpleGrid columns={{ base: 1, md: 1, lg: 1 }} spacing={10}>
          <VStack align="start">
            <NewsItems />
          </VStack>
          {/* commenting out until confirmed that this is working and ready
          <VStack spacing={4} align="stretch">
            <RecentContacts /> 
          </VStack>
          */}
          {/* Moved to its own page 
          <VStack spacing={4} align="stretch">
            <UpcomingEvents />
          </VStack>
          */}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
