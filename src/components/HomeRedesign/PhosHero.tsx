'use client';

import { useEffect, useState } from 'react';

import { Box, Button, Flex, Grid, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

import { PHOS, blink, flicker, scan } from './phosphorTheme';

const ASCII_CALLSIGN = `   SSSSSSSSSSSSSSS                                         KKKKKKKKK    KKKKKKK       CCCCCCCCCCCCC
 SS:::::::::::::::S                                        K:::::::K    K:::::K    CCC::::::::::::C
S:::::SSSSSS::::::S                                        K:::::::K    K:::::K  CC:::::::::::::::C
S:::::S     SSSSSSS                                        K:::::::K   K::::::K C:::::CCCCCCCC::::C
S:::::S                eeeeeeeeeeee        ccccccccccccccccKK::::::K  K:::::KKKC:::::C       CCCCCC
S:::::S              ee::::::::::::ee    cc:::::::::::::::c  K:::::K K:::::K  C:::::C
 S::::SSSS          e::::::eeeee:::::ee c:::::::::::::::::c  K::::::K:::::K   C:::::C
  SS::::::SSSSS    e::::::e     e:::::ec:::::::cccccc:::::c  K:::::::::::K    C:::::C
    SSS::::::::SS  e:::::::eeeee::::::ec::::::c     ccccccc  K:::::::::::K    C:::::C
       SSSSSS::::S e:::::::::::::::::e c:::::c               K::::::K:::::K   C:::::C
            S:::::Se::::::eeeeeeeeeee  c:::::c               K:::::K K:::::K  C:::::C
            S:::::Se:::::::e           c::::::c     cccccccKK::::::K  K:::::KKKC:::::C       CCCCCC
SSSSSSS     S:::::Se::::::::e          c:::::::cccccc:::::cK:::::::K   K::::::K C:::::CCCCCCCC::::C
S::::::SSSSSS:::::S e::::::::eeeeeeee   c:::::::::::::::::cK:::::::K    K:::::K  CC:::::::::::::::C
S:::::::::::::::SS   ee:::::::::::::e    cc:::::::::::::::cK:::::::K    K:::::K    CCC::::::::::::C
 SSSSSSSSSSSSSSS       eeeeeeeeeeeeee      ccccccccccccccccKKKKKKKKK    KKKKKKK       CCCCCCCCCCCCC`;

const ASCII_TOWER = ` ______________________________
<  S E C K C  // KS3CKC SUBNET >
 ------------------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

const MSF_BOOT = `       =[ metasploit v4.0.1-dev [core:4.0 api:1.0]
+ -- --=[ 720 exploits - 362 auxiliary - 73 post
+ -- --=[ 226 payloads - 27 encoders - 8 nops
       =[ ks3ckc.radio  ham subnet  online since 2019`;

const TICKER_LINES = [
  '> sysop: welcome to ks3ckc — the seckc ham radio club',
  '> motd: nets every wednesday 21:00 CT on 446.050 (pl 69.3)',
  '> propagation: SFI=148  A=8  K=3  STORM=none  conditions: fair',
  '> last_qso: KE0XYZ → KS3CKC  20m SSB  +12 dB  3 minutes ago',
  '> next_meeting: T-2d 14h 22m — recursion brewing co. — KCMO',
];

const Cursor = () => (
  <Box
    as="span"
    display="inline-block"
    ml="2px"
    color={PHOS.green}
    animation={`${blink} 1s steps(1) infinite`}
  >
    █
  </Box>
);

export default function PhosHero() {
  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setTickerIdx((i) => (i + 1) % TICKER_LINES.length),
      2400
    );
    return () => clearInterval(t);
  }, []);

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      px={{ base: 4, md: 8 }}
      py={{ base: 10, md: 16 }}
      minH={{ base: 'auto', md: '720px' }}
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
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        },
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
      }}
    >
      {/* Scan bar */}
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

      <Grid
        templateColumns={{ base: '1fr', lg: '1fr 380px' }}
        gap={{ base: 8, lg: 12 }}
        alignItems="start"
      >
        <Box>
          <Text fontSize="11px" color={PHOS.greenDim} mb={2}>
            {'// ks3ckc.radio :: ham subgroup of #seckc :: kansas city, mo'}
          </Text>

          <Box
            as="pre"
            fontFamily={PHOS.mono}
            color={PHOS.green}
            fontSize={{ base: '4px', sm: '6px', md: '9px' }}
            lineHeight="1.05"
            margin={0}
            textShadow="0 0 8px rgba(57,255,20,0.4)"
            overflow="hidden"
            whiteSpace="pre"
          >
            {ASCII_CALLSIGN}
          </Box>

          <Box
            as="pre"
            fontFamily={PHOS.mono}
            color={PHOS.paper}
            fontSize={{ base: '9px', md: '11px' }}
            lineHeight="1.15"
            mt={2}
            opacity={0.9}
            whiteSpace="pre"
          >
            {ASCII_TOWER}
          </Box>

          <Box
            as="pre"
            fontFamily={PHOS.mono}
            color={PHOS.green}
            fontSize="11px"
            lineHeight="1.4"
            mt={3.5}
            opacity={0.85}
            whiteSpace="pre"
          >
            {MSF_BOOT}
          </Box>

          <Text
            as="h1"
            fontSize={{ base: '32px', md: '48px' }}
            mt={7}
            mb={3.5}
            color={PHOS.paper}
            textShadow="0 0 12px rgba(57,255,20,0.35)"
            lineHeight="1.05"
            fontFamily={PHOS.mono}
            fontWeight="700"
            letterSpacing="-0.01em"
          >
            we hack{' '}
            <Box as="span" color={PHOS.green}>
              radios
            </Box>
            .<br />
            we are radio{' '}
            <Box as="span" color={PHOS.amber}>
              hackers
            </Box>
            .
          </Text>

          <Text
            fontSize={{ base: '14px', md: '16px' }}
            maxW="580px"
            color={PHOS.paper}
            opacity={0.85}
            mb={7}
            lineHeight="1.5"
            fontFamily={PHOS.mono}
          >
            KS3CKC is the amateur radio club of{' '}
            <Link
              href="https://seckc.org"
              isExternal
              color={PHOS.greenD}
              textDecoration="underline"
              textUnderlineOffset="3px"
              _hover={{ color: PHOS.green, bg: 'rgba(57,255,20,0.12)' }}
            >
              SecKC
            </Link>{' '}
            — the largest cybersecurity meetup in the country. We solder badges,
            chase DX, run nets, and break things on purpose. No ham license?{' '}
            <Link
              as={NextLink}
              href="/about"
              color={PHOS.greenD}
              textDecoration="underline"
              textUnderlineOffset="3px"
              _hover={{ color: PHOS.green, bg: 'rgba(57,255,20,0.12)' }}
            >
              we&apos;ll get you one
            </Link>
            .
          </Text>

          <Flex gap={3} flexWrap="wrap">
            <PhosBtn href="/app/register" primary>
              ▶ join the club
            </PhosBtn>
            <PhosBtn href="/events">cat ./next-meeting</PhosBtn>
            <PhosBtn href="/about">man license</PhosBtn>
          </Flex>

          <Box
            mt={10}
            border="1px solid"
            borderColor={PHOS.line2}
            bg="rgba(13,40,24,0.5)"
            px={3.5}
            py={2.5}
            maxW="620px"
            fontSize="13px"
          >
            <Flex
              align="center"
              gap={2}
              mb={1}
              fontSize="10px"
              color={PHOS.greenDim}
              textTransform="uppercase"
              letterSpacing="0.14em"
            >
              <Box
                w="8px"
                h="8px"
                borderRadius="50%"
                bg={PHOS.green}
                boxShadow={`0 0 8px ${PHOS.green}`}
              />
              live · /var/log/ks3ckc.log
            </Flex>
            <Text color={PHOS.green} minH="20px" fontFamily={PHOS.mono}>
              {TICKER_LINES[tickerIdx]}
              <Cursor />
            </Text>
          </Box>
        </Box>

        <Flex direction="column" align="center" gap={5}>
          <Box
            w="100%"
            border="1px solid"
            borderColor={PHOS.line2}
            px={3.5}
            py={3}
            fontFamily={PHOS.mono}
          >
            <Text
              fontSize="10px"
              color={PHOS.greenDim}
              textTransform="uppercase"
              letterSpacing="0.14em"
              mb={2}
            >
              $ whoami
            </Text>
            <Box fontSize="12px" lineHeight="1.7">
              {[
                ['callsign', 'KS3CKC', PHOS.green],
                ['grid', 'EM28pw', PHOS.paper],
                ['members', '147 (+12 ytd)', PHOS.paper],
                ['founded', '2019', PHOS.paper],
                ['status', '501(c)(3) ✓', PHOS.green],
                ['parent', 'SecKC', PHOS.paper],
              ].map(([k, v, c]) => (
                <Box key={k}>
                  <Box
                    as="span"
                    color={PHOS.greenDim}
                    display="inline-block"
                    minW="9ch"
                  >
                    {k}
                  </Box>
                  <Box as="span" color={c}>
                    {v}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Flex>
      </Grid>
    </Box>
  );
}

function PhosBtn({
  children,
  href,
  primary = false,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
}) {
  return (
    <Button
      as={NextLink}
      href={href}
      bg={primary ? PHOS.green : 'transparent'}
      color={primary ? PHOS.bg : PHOS.green}
      border="1px solid"
      borderColor={PHOS.green}
      borderRadius="0"
      px="14px"
      py="8px"
      h="auto"
      fontFamily={PHOS.mono}
      fontWeight="600"
      fontSize="13px"
      letterSpacing="0.02em"
      textDecoration="none"
      _hover={{
        bg: primary ? PHOS.greenD : PHOS.green,
        color: PHOS.bg,
        textDecoration: 'none',
      }}
      transition="all .1s"
    >
      {children}
    </Button>
  );
}
