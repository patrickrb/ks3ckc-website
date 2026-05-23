'use client';

import { Box, Flex, Grid, HStack, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

import { PHOS } from './phosphorTheme';

type Evt = {
  d: string;
  n: string;
  month: string;
  title: string;
  loc: string;
  tag: 'NET' | 'IRL' | 'BIG' | 'EXAM';
  primary?: boolean;
};

const EVENTS: Evt[] = [
  {
    d: 'WED',
    n: '15',
    month: 'MAY',
    title: 'club net :: 21:00 CT',
    loc: '446.050 / 145.555',
    tag: 'NET',
  },
  {
    d: 'SAT',
    n: '18',
    month: 'MAY',
    title: 'field day prep — antenna build',
    loc: 'shawnee mission park',
    tag: 'IRL',
  },
  {
    d: 'TUE',
    n: '21',
    month: 'MAY',
    title: 'monthly meeting + cw/digi practice',
    loc: 'recursion brewing co.',
    tag: 'IRL',
    primary: true,
  },
  {
    d: 'SAT',
    n: '08',
    month: 'JUN',
    title: 'arrl field day 2026',
    loc: 'tba — 3a kansas',
    tag: 'BIG',
  },
  {
    d: 'WED',
    n: '12',
    month: 'JUN',
    title: 'license exam session',
    loc: 'seckc hq',
    tag: 'EXAM',
  },
];

const tagColor = (tag: Evt['tag']) => {
  if (tag === 'BIG') return PHOS.amber;
  if (tag === 'EXAM') return PHOS.red;
  return PHOS.greenD;
};

export default function PhosEvents() {
  return (
    <Box
      as="section"
      px={{ base: 4, md: 8 }}
      py={{ base: 12, md: 16 }}
      borderTop="1px solid"
      borderColor={PHOS.line2}
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
          crontab -l
        </Text>
        <Text color={PHOS.greenDim} fontSize="12px">
          # scheduled events — show all
        </Text>
      </HStack>
      <Flex direction="column">
        {EVENTS.map((e, i) => (
          <Grid
            key={i}
            templateColumns={{ base: '60px 1fr', md: '78px 1fr auto' }}
            gap={{ base: 4, md: 5 }}
            px={4}
            py={4.5}
            borderTop="1px dashed"
            borderColor={PHOS.line2}
            borderLeft={
              e.primary ? `3px solid ${PHOS.green}` : '3px solid transparent'
            }
            alignItems="center"
            bg={e.primary ? 'rgba(57,255,20,0.04)' : 'transparent'}
          >
            <Box
              textAlign="center"
              borderRight="1px dashed"
              borderColor={PHOS.line2}
              pr={4}
            >
              <Text fontSize="10px" color={PHOS.greenDim}>
                {e.d}
              </Text>
              <Text
                fontSize="28px"
                fontWeight="700"
                color={e.primary ? PHOS.green : PHOS.paper}
                lineHeight="1"
              >
                {e.n}
              </Text>
              <Text fontSize="10px" color={PHOS.greenDim}>
                {e.month}
              </Text>
            </Box>
            <Box>
              <Text
                fontSize={{ base: '14px', md: '16px' }}
                color={PHOS.paper}
                mb={1}
              >
                {e.title}
              </Text>
              <Text fontSize="12px" color={PHOS.greenDim}>
                {'// '}
                {e.loc}
              </Text>
            </Box>
            <HStack
              spacing={2}
              gridColumn={{ base: '1 / -1', md: 'auto' }}
              justifyContent={{ base: 'flex-start', md: 'flex-end' }}
            >
              <Box
                fontSize="10px"
                px="8px"
                py="3px"
                border="1px solid"
                borderColor={
                  e.tag === 'BIG'
                    ? PHOS.amber
                    : e.tag === 'EXAM'
                      ? PHOS.red
                      : PHOS.line2
                }
                color={tagColor(e.tag)}
              >
                {e.tag}
              </Box>
              <Link
                as={NextLink}
                href="/events"
                fontSize="11px"
                px="10px"
                py="4px"
                color={PHOS.green}
                border="1px solid"
                borderColor={PHOS.green}
                _hover={{
                  bg: PHOS.green,
                  color: PHOS.bg,
                  textDecoration: 'none',
                }}
              >
                ./rsvp
              </Link>
            </HStack>
          </Grid>
        ))}
      </Flex>
    </Box>
  );
}
