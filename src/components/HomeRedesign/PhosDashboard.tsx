'use client';

import { useEffect, useState } from 'react';

import {
  Box,
  Container,
  Flex,
  Grid,
  HStack,
  Link,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { trpc } from '@/lib/trpc/client';

import PhosPanel from './PhosPanel';
import { PHOS, blink, flicker, scan } from './phosphorTheme';

const REPEATERS = [
  { l: '70cm REPEATER', f: '446.050', t: '69.3', primary: true },
  { l: '2m  REPEATER', f: '145.555', t: '69.3', primary: true },
];

const PROPAGATION = [
  { k: 'SFI', v: '148', c: PHOS.green },
  { k: 'A-idx', v: '8', c: PHOS.paper },
  { k: 'K-idx', v: '3', c: PHOS.amber },
  { k: 'X-ray', v: 'B2.4', c: PHOS.paper },
  { k: 'storm', v: 'none', c: PHOS.green },
  { k: '20m', v: 'good', c: PHOS.green },
];

const QSOS: [string, string, string, string, string, string, string][] = [
  ['21:42:18Z', 'JA1XKG', '20m', 'FT8', '-14', 'PM95', 'tokyo, jp'],
  ['21:38:02Z', 'WB0WAO', '20m', 'SSB', '59', 'EM28', 'kcmo'],
  ['21:28:11Z', 'AC0DZ', '15m', 'CW', '579', 'DM79', 'denver'],
  ['03:14:33Z', 'KE0XYZ', '40m', 'FT8', '-08', 'EN35', 'mn'],
  ['02:51:09Z', 'KD0LRN', '2m', 'FM', 'fb', 'EM28', 'kcmo'],
];

const NEW_MEMBERS: [string, string, string][] = [
  ['sarah_k', 'KE0SKC', 'tech'],
  ['mike_r', 'N0MIKE', 'general'],
  ['jenny_l', 'KD0JLR', 'tech'],
  ['tom_b', 'AC0TBX', 'extra'],
];

export default function PhosDashboard() {
  const [time, setTime] = useState<Date | null>(null);
  const accountResp = trpc.account.get.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const utcStr = time ? time.toISOString().slice(11, 19) + 'Z' : '--:--:--Z';
  const handle =
    accountResp.data?.callsign?.toLowerCase() ||
    accountResp.data?.name?.toLowerCase().replace(/\s+/g, '_') ||
    'guest';

  return (
    <Box
      position="relative"
      animation={`${flicker} 6s infinite`}
      sx={{
        background: `radial-gradient(ellipse at 50% 40%, rgba(57,255,20,0.04), transparent 70%), ${PHOS.bg}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(to bottom, rgba(57,255,20,0.03) 0px, rgba(57,255,20,0.03) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          zIndex: 1,
        },
        '& > *': { position: 'relative', zIndex: 2 },
      }}
    >
      <Box
        position="absolute"
        left={0}
        right={0}
        h="4px"
        bg="linear-gradient(to bottom, transparent, rgba(57,255,20,0.18), transparent)"
        pointerEvents="none"
        zIndex={3}
        animation={`${scan} 8s linear infinite`}
      />

      {/* Sub-nav */}
      <Box
        as="header"
        px={{ base: 4, md: 6 }}
        py={2.5}
        borderBottom="1px solid"
        borderColor={PHOS.line2}
        fontSize="12px"
        fontFamily={PHOS.mono}
      >
        <Flex justify="space-between" align="center" gap={4} flexWrap="wrap">
          <HStack spacing={4}>
            <Text color={PHOS.green}>
              KS3CKC
              <Box as="span" color={PHOS.greenDim}>
                .member-portal
              </Box>
            </Text>
            <Text color={PHOS.greenDim}>|</Text>
            {[
              { label: '~/dashboard', href: '/dashboard', active: true },
              { label: './logbook', href: '#' },
              { label: './roster', href: '/members' },
              { label: './repos', href: '/blog' },
              { label: './events', href: '/events' },
            ].map((l) => (
              <Link
                as={NextLink}
                key={l.label}
                href={l.href}
                color={l.active ? PHOS.green : PHOS.greenDim}
                textDecoration={l.active ? 'underline' : 'none'}
                textUnderlineOffset="3px"
                _hover={{ color: PHOS.green, textDecoration: 'underline' }}
              >
                {l.label}
              </Link>
            ))}
          </HStack>
          <HStack spacing={3.5}>
            <Text color={PHOS.amber}>{utcStr}</Text>
            <Text color={PHOS.greenDim}>|</Text>
            <Text color={PHOS.green}>● {handle}@ks3ckc</Text>
          </HStack>
        </Flex>
      </Box>

      {/* Welcome */}
      <Box px={{ base: 4, md: 6 }} pt={6} pb={2}>
        <Text
          fontSize="11px"
          color={PHOS.greenDim}
          mb={1.5}
          fontFamily={PHOS.mono}
        >
          $ login --user {handle} && cat /etc/motd
        </Text>
        <Text
          as="h1"
          fontSize={{ base: '24px', md: '32px' }}
          color={PHOS.paper}
          fontWeight="700"
          fontFamily={PHOS.mono}
          textShadow="0 0 12px rgba(57,255,20,0.25)"
        >
          welcome back,{' '}
          <Box as="span" color={PHOS.green}>
            {handle}
          </Box>
          <Box
            as="span"
            display="inline-block"
            ml="2px"
            color={PHOS.green}
            animation={`${blink} 1s steps(1) infinite`}
          >
            █
          </Box>
        </Text>
        <Text
          fontSize="12px"
          color={PHOS.greenDim}
          mt={1.5}
          fontFamily={PHOS.mono}
        >
          {'// '}147 members · 12 new ytd · band conditions: fair · K=3 ·
          SFI=148
        </Text>
      </Box>

      <Container maxW="container.xl" px={{ base: 4, md: 6 }} py={6}>
        <Grid
          templateColumns={{ base: '1fr', lg: '2fr 1fr 1fr' }}
          gap={4}
          mb={4}
        >
          <PhosPanel title="./club-freqs.sh — pinned" meta="★ favorited">
            <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }}>
              {REPEATERS.map((r, i) => (
                <Box
                  key={i}
                  px={{ base: 5, md: 5.5 }}
                  py={5}
                  borderRight={{
                    base: 'none',
                    sm: i === 0 ? '1px dashed' : 'none',
                  }}
                  borderRightColor={PHOS.line2}
                  borderTop={{
                    base: i === 0 ? 'none' : '1px dashed',
                    sm: 'none',
                  }}
                  borderTopColor={PHOS.line2}
                >
                  <Text
                    fontSize="10px"
                    color={PHOS.greenDim}
                    textTransform="uppercase"
                    letterSpacing="0.14em"
                    mb={2}
                    fontFamily={PHOS.mono}
                  >
                    {r.l}
                  </Text>
                  <Text
                    fontFamily={PHOS.mono}
                    fontSize={{ base: '28px', md: '36px' }}
                    color={PHOS.green}
                    textShadow="0 0 10px rgba(57,255,20,0.4)"
                    lineHeight="1"
                    mb={2}
                  >
                    {r.f}{' '}
                    <Box as="span" fontSize="12px" color={PHOS.greenDim}>
                      MHz
                    </Box>
                  </Text>
                  <Text
                    fontFamily={PHOS.mono}
                    fontSize="12px"
                    color={PHOS.paper}
                  >
                    tone {r.t} Hz · FM ·{' '}
                    <Box as="span" color={PHOS.amber}>
                      ★ primary
                    </Box>
                  </Text>
                </Box>
              ))}
            </Grid>
            <Box
              px={3.5}
              py={2}
              borderTop="1px dashed"
              borderColor={PHOS.line2}
              fontSize="11px"
              color={PHOS.greenDim}
              fontFamily={PHOS.mono}
            >
              tip: hit{' '}
              <Box
                as="span"
                bg={PHOS.greenDeep}
                px="5px"
                py="1px"
                color={PHOS.green}
              >
                /freq
              </Box>{' '}
              anywhere to jump back here
            </Box>
          </PhosPanel>

          <PhosPanel title="./next-net" meta="cron">
            <Box px={4.5} py={4.5} fontFamily={PHOS.mono}>
              <Text fontSize="10px" color={PHOS.greenDim} mb={2}>
                NEXT NET IN
              </Text>
              <Text
                fontFamily={PHOS.mono}
                fontSize={{ base: '24px', md: '28px' }}
                color={PHOS.green}
                textShadow="0 0 10px rgba(57,255,20,0.4)"
              >
                00:06:14:32
              </Text>
              <Text fontSize="11px" color={PHOS.paper} mt={2}>
                wed 21:00 CT · 446.050
              </Text>
              <Link
                as={NextLink}
                href="/events"
                display="inline-block"
                mt={3}
                fontSize="11px"
                px={2.5}
                py={1}
                color={PHOS.green}
                border="1px solid"
                borderColor={PHOS.green}
                _hover={{
                  bg: PHOS.green,
                  color: PHOS.bg,
                  textDecoration: 'none',
                }}
              >
                ./set-reminder
              </Link>
            </Box>
          </PhosPanel>

          <PhosPanel title="./solar-tail" meta="n0nbh">
            <Box
              px={4.5}
              py={3.5}
              fontFamily={PHOS.mono}
              fontSize="12px"
              lineHeight="1.7"
            >
              {PROPAGATION.map((p) => (
                <Flex key={p.k} justify="space-between">
                  <Text color={PHOS.greenDim}>{p.k}</Text>
                  <Text color={p.c}>{p.v}</Text>
                </Flex>
              ))}
            </Box>
          </PhosPanel>
        </Grid>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={4}>
          <PhosPanel title="tail -f ~/.logbook" meta="4112 entries">
            <Box fontFamily={PHOS.mono} fontSize="12px">
              {QSOS.map((q, i) => (
                <Grid
                  key={i}
                  templateColumns={{
                    base: '1fr 1fr',
                    md: '78px 76px 50px 60px 50px 50px 1fr 60px',
                  }}
                  gap={2}
                  px={3.5}
                  py={2}
                  borderBottom="1px dashed"
                  borderColor={PHOS.line}
                  alignItems="center"
                >
                  <Text color={PHOS.greenDim}>{q[0]}</Text>
                  <Text color={PHOS.green} fontWeight="700">
                    {q[1]}
                  </Text>
                  <Text
                    color={PHOS.paper}
                    display={{ base: 'none', md: 'block' }}
                  >
                    {q[2]}
                  </Text>
                  <Text
                    color={PHOS.amber}
                    display={{ base: 'none', md: 'block' }}
                  >
                    {q[3]}
                  </Text>
                  <Text
                    color={PHOS.paper}
                    display={{ base: 'none', md: 'block' }}
                  >
                    {q[4]}
                  </Text>
                  <Text
                    color={PHOS.greenDim}
                    display={{ base: 'none', md: 'block' }}
                  >
                    {q[5]}
                  </Text>
                  <Text
                    color={PHOS.greenDim}
                    display={{ base: 'none', md: 'block' }}
                  >
                    {'// '}
                    {q[6]}
                  </Text>
                  <Link
                    href="#"
                    textAlign="right"
                    fontSize="10px"
                    color={PHOS.greenD}
                    textDecoration="underline"
                    textUnderlineOffset="3px"
                    _hover={{ color: PHOS.green }}
                  >
                    ./qsl
                  </Link>
                </Grid>
              ))}
            </Box>
          </PhosPanel>

          <PhosPanel title="./roster --new 30d" meta="+12 ytd">
            <Box fontFamily={PHOS.mono} fontSize="12px">
              {NEW_MEMBERS.map((m, i) => (
                <Grid
                  key={i}
                  templateColumns="1fr 1fr auto"
                  gap={2}
                  px={3.5}
                  py={2}
                  borderBottom="1px dashed"
                  borderColor={PHOS.line}
                  alignItems="center"
                >
                  <Text color={PHOS.paper}>{m[0]}</Text>
                  <Text color={PHOS.green}>{m[1]}</Text>
                  <Box
                    fontSize="10px"
                    border="1px solid"
                    borderColor={PHOS.line2}
                    px={1.5}
                    py="1px"
                    color={PHOS.greenDim}
                  >
                    {m[2]}
                  </Box>
                </Grid>
              ))}
            </Box>
          </PhosPanel>
        </Grid>
      </Container>
    </Box>
  );
}
