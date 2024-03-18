'use client';

import { useEffect, useState } from 'react';

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
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

import { NavBar } from '@/components/NavBar';

// Sample icons
// Import other components like NavBar, BlogCard, EventCard, etc.

export default function HomePage() {
  // Pick a random hero image on page load
  const [heroImageNumber, setHeroImageNumber] = useState(
    Math.floor(Math.random() * 7) + 1
  );

  // setup a timer to change the hero image every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageNumber((prevNumber) => (prevNumber % 7) + 1);
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const newsItems = [
    {
      title: 'KS3CKC Achieves New Milestone in Long-Distance Communication',
      date: '2024-03-01',
      content:
        "The KS3CKC HAM Radio Club recently set a new record in long-distance communication, reaching an amateur radio operator in a remote location over 8,000 miles away. This achievement showcases the club's commitment to advancing radio communication technologies.",
    },
    {
      title:
        'Upcoming Workshop: Advanced Techniques in Radio Frequency Optimization',
      date: '2024-04-15',
      content:
        'Join us for an in-depth workshop on advanced radio frequency optimization techniques. The workshop, led by expert members of KS3CKC, will cover new strategies for enhancing signal strength and clarity.',
    },
    {
      title: 'Annual HAM Radio Contest: A Resounding Success',
      date: '2024-05-20',
      content:
        "KS3CKC's annual HAM radio contest brought together enthusiasts from all over the region. Participants competed in various categories, demonstrating skill and creativity in radio communication.",
    },
    {
      title:
        'KS3CKC to Host a Series of Guest Talks on Emergency Communication',
      date: '2024-06-10',
      content:
        'KS3CKC is proud to announce a series of guest lectures focusing on the role of amateur radio in emergency communication. Experts from various fields will discuss the importance of HAM radio during crises.',
    },
    {
      title: 'Member Spotlight: Journey of a Young Amateur Radio Operator',
      date: '2024-07-05',
      content:
        'In our member spotlight series, we feature the journey of a young radio enthusiast who discovered a passion for HAM radio through KS3CKC. Read about their inspiring journey in the world of amateur radio.',
    },
  ];

  const upcomingEvents = [
    { id: 1, name: 'DX Contest', date: 'April 30, 2024' },
    { id: 2, name: 'Local Meetup', date: 'May 15, 2024' },
    { id: 2, name: 'Summer Field Day', date: 'June 15, 2024' },
    // ... more events
  ];

  // const photoGallery = ['/photo1.jpg', '/photo2.jpg', '/heroes/hero1.png']; // ... more photos

  const qsoItems = [
    {
      id: 1,
      date: '2024-02-15',
      time: '18:30',
      frequency: '14.300 MHz',
      mode: 'SSB',
      myCallSign: 'N0CALL',
      theirCallSign: 'W1AW',
      rstSent: '59',
      rstReceived: '59',
      notes: 'Discussed antenna setups.',
    },
    {
      id: 2,
      date: '2024-02-16',
      time: '09:45',
      frequency: '7.040 MHz',
      mode: 'CW',
      myCallSign: 'N0CALL',
      theirCallSign: 'G4XYZ',
      rstSent: '599',
      rstReceived: '599',
      notes: 'First contact with UK on this band.',
    },
    {
      id: 3,
      date: '2024-02-16',
      time: '13:20',
      frequency: '21.360 MHz',
      mode: 'SSB',
      myCallSign: 'N0CALL',
      theirCallSign: 'JA1NUT',
      rstSent: '57',
      rstReceived: '57',
      notes: 'Great conversation about DXpeditions.',
    },
  ];

  // Colors
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box>
      <NavBar />
      {/* Hero Section */}
      <Flex
        bgImage={`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/heros/hero${heroImageNumber}.png')`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        h={{ base: '20rem', md: '25rem' }}
        align="center"
        justify="center"
        color="white"
      >
        <Flex flexDirection="column" align="center">
          <Heading as="h1" size="4xl">
            KS3CKC
          </Heading>
          <Heading as="h2" size="lg">
            SecKC Amateur Radio Club of Kansas City and Surrounding Cities for
            Amateur Radio
          </Heading>
        </Flex>
      </Flex>

      {/* About Us Section */}
      <Container maxW="container.lg" py={10}>
        <Heading as="h2" size="xl" mb={5}>
          About Us
        </Heading>
        <Box bg={cardBg} p={4} borderRadius="md" mb={4}>
          <Text fontSize="lg" mb={5}>
            Step into the realm of the SecKC Amateur Radio Club of Kansas City
            and Surrounding Cities for Amateur Radio, where mere mortals become
            maestros of the airwaves and masters of the hacker universe. In
            collaboration with SecKC, the colossal titan of hacker meetups, we
            are not just a club; we're a powerhouse of the planet's most
            brilliant minds in technology, security, and radio wizardry. Picture
            a place where the pulses of HAM radio merge with the electric sparks
            of hacking genius – that's where you'll find us, at the pinnacle of
            innovation. Our members? They're the crème de la crème, a league of
            extraordinary technophiles, each more skilled and savvy than the
            last. From the veteran HAM heroes who can make radios sing, to the
            digital maestros spinning cybersecurity like fine art, we're the
            elite, the trailblazers, the game-changers. If your brain thirsts
            for challenges that would make mere mortals quiver, welcome home.
            Dare to join the ranks of the SecKC Amateur Radio Club of Kansas
            City and Surrounding Cities for Amateur Radio? We're calling on
            those with a hunger for knowledge, a flair for the technical
            spectacular, and a dash of audacious spirit. Here, your voice
            doesn't just matter – it echoes through the ether, shaping the
            future of radio and security. Dive into the heart of technology's
            greatest adventures with us, where every day is a saga of discovery
            and triumph!
          </Text>
        </Box>
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
            <Link href="/mailing-list" fontSize="lg">
              Mailing List
            </Link>
          </Box>
          <Box textAlign="center" p={3}>
            <Icon as={ChatIcon} mr={2} w={6} h={6} />
            <Link href="https://discord.gg/ks3ckc" isExternal fontSize="lg">
              Join our Discord <ExternalLinkIcon mx="2px" />
            </Link>
          </Box>
        </Flex>
      </Container>

      {/* Dashboard Section */}
      <Container maxW="container.lg">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={10}>
          <VStack align="start">
            <Heading as="h4" size="md">
              Latest News
            </Heading>
            {newsItems.map((item, i) => {
              return (
                <Box key={i} bg={cardBg} p={4} borderRadius="md" mb={4}>
                  <Heading as="h5" size="sm" mb={2}>
                    {item.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    {item.date}
                  </Text>
                  <Text fontSize="sm">{item.content}</Text>
                </Box>
              );
            })}
          </VStack>

          <VStack spacing={4} align="stretch">
            <Heading as="h4" size="md">
              Latest QSO's
            </Heading>
            {/* Map through latest QSO's */}

            {qsoItems.map((qso, i) => {
              return (
                <Box key={i} bg={cardBg} p={4} borderRadius="md" mb={4}>
                  <Heading as="h5" size="sm" mb={2}>
                    QSO with {qso.theirCallSign}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    Date: {qso.date}, Time: {qso.time}
                  </Text>
                  <Text fontSize="sm" mb={2}>
                    Frequency: {qso.frequency}, Mode: {qso.mode}
                  </Text>
                  <Text fontSize="sm" mb={2}>
                    RST Sent: {qso.rstSent}, RST Received: {qso.rstReceived}
                  </Text>
                  <Text fontSize="sm">Notes: {qso.notes}</Text>
                </Box>
              );
            })}
          </VStack>

          <VStack spacing={4} align="stretch">
            <Heading as="h4" size="md">
              Upcoming Contests
            </Heading>
            {upcomingEvents.map((event, i) => {
              return (
                <Box key={i} bg={cardBg} p={4} borderRadius="md" mb={4}>
                  <Heading as="h5" size="sm" mb={2}>
                    {event.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    {event.date}
                  </Text>
                </Box>
              );
            })}
          </VStack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
