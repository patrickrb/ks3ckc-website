'use client';

import { Box, Flex, Grid, HStack, Link, Text } from '@chakra-ui/react';

import { PHOS } from './phosphorTheme';

type Project = {
  name: string;
  desc: string;
  stars: number;
  lang: string;
  href: string;
};

const PROJECTS: Project[] = [
  {
    name: 'seckc-badge-dc31',
    desc: 'esp32-s3 conference badge w/ wifi marauder firmware',
    stars: 142,
    lang: 'C++',
    href: 'https://github.com/seckc',
  },
  {
    name: 'nextlog',
    desc: 'modern amateur radio logging w/ lotw + cloudlog api',
    stars: 87,
    lang: 'TypeScript',
    href: 'https://github.com/seckc',
  },
  {
    name: 'sigint-project',
    desc: 'rtl-sdr based intruder detection. classify rf intent.',
    stars: 54,
    lang: 'Python',
    href: 'https://github.com/seckc',
  },
  {
    name: 'space-weather-bot',
    desc: 'discord bot posting solar/propagation stats daily',
    stars: 31,
    lang: 'Python',
    href: 'https://github.com/seckc',
  },
  {
    name: 'spectrum_painter',
    desc: 'convert images to iq streams. show up in waterfalls.',
    stars: 218,
    lang: 'Python',
    href: 'https://github.com/seckc',
  },
  {
    name: 'meshtastic-net',
    desc: 'kc area mesh network + firmware notes',
    stars: 19,
    lang: 'C',
    href: '/meshtastic',
  },
];

export default function PhosProjects() {
  return (
    <Box
      as="section"
      px={{ base: 4, md: 8 }}
      py={{ base: 12, md: 16 }}
      borderTop="1px solid"
      borderColor={PHOS.line2}
      bg={PHOS.bg2}
      fontFamily={PHOS.mono}
    >
      <HStack spacing={4} alignItems="baseline" mb={6} flexWrap="wrap">
        <Text color={PHOS.greenDim}>$</Text>
        <Text
          as="h2"
          fontSize={{ base: '22px', md: '28px' }}
          color={PHOS.paper}
          fontWeight="700"
        >
          ls -la ~/projects/
        </Text>
        <Text color={PHOS.greenDim} fontSize="12px">
          # things we&apos;re building. PRs welcome.
        </Text>
      </HStack>
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={4}
      >
        {PROJECTS.map((p, i) => (
          <Link
            key={i}
            href={p.href}
            isExternal={p.href.startsWith('http')}
            border="1px solid"
            borderColor={PHOS.line2}
            bg={PHOS.panel}
            textDecoration="none"
            transition="all .12s"
            _hover={{
              borderColor: PHOS.green,
              boxShadow: '0 0 14px rgba(57,255,20,0.15)',
              textDecoration: 'none',
            }}
          >
            <Flex
              align="center"
              justify="space-between"
              px={2.5}
              py={1.5}
              borderBottom="1px solid"
              borderColor={PHOS.line2}
              fontSize="11px"
              textTransform="uppercase"
              letterSpacing="0.12em"
            >
              <Text color={PHOS.green}>./{p.name}</Text>
              <Text color={PHOS.amber}>★ {p.stars}</Text>
            </Flex>
            <Box px={3.5} py={3}>
              <Text
                fontSize="13px"
                color={PHOS.paper}
                mb={3.5}
                lineHeight="1.5"
              >
                {p.desc}
              </Text>
              <Flex
                justify="space-between"
                align="center"
                fontSize="11px"
                color={PHOS.greenDim}
              >
                <HStack spacing={1.5}>
                  <Box w="8px" h="8px" bg={PHOS.green} borderRadius="50%" />
                  <Text>{p.lang}</Text>
                </HStack>
                <Text>git clone →</Text>
              </Flex>
            </Box>
          </Link>
        ))}
      </Grid>
    </Box>
  );
}
