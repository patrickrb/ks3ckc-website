'use client';

import {
  Box,
  Container,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import PhosPageHeader from '@/components/HomeRedesign/PhosPageHeader';
import PhosPanel from '@/components/HomeRedesign/PhosPanel';
import { PHOS } from '@/components/HomeRedesign/phosphorTheme';

const SECTIONS = [
  {
    h: 'Who We Are',
    body: `Founded by amateur radio operators and security professionals, KS3CKC is the ham radio subgroup of SecKC — the largest cybersecurity meetup in the country. Our members range from newly licensed technicians to extra-class operators, all united by a love of RF, tinkering, and breaking things on purpose.`,
  },
  {
    h: 'What We Do',
    body: `Workshops, builds, contests, nets. Topics include:`,
    bullets: [
      'Operating: HF/VHF/UHF, contests, DX, special events',
      'Building & programming radios, badges, antennas',
      'Emergency comms & disaster preparedness',
      'Digital modes & DSP — FT8, JS8, M17, mesh',
      'Antenna design & RF engineering',
      'Cybersecurity, SDR, signals intelligence',
    ],
  },
  {
    h: 'Get Involved',
    body: `Membership is open to all. Show up to a Wednesday net (446.050 / 145.555, 69.3 Hz tone, 21:00 CT), come to a meeting at Recursion Brewing, or join the Discord.`,
  },
];

export default function AboutPage() {
  return (
    <Box>
      <PhosPageHeader
        cmd="cat ./about"
        title="about ks3ckc"
        subtitle={
          <>
            the kansas city ham radio subgroup of{' '}
            <Link
              href="https://seckc.org"
              isExternal
              color={PHOS.greenD}
              textDecoration="underline"
              textUnderlineOffset="3px"
              _hover={{ color: PHOS.green, bg: 'rgba(57,255,20,0.12)' }}
            >
              SecKC
            </Link>
            . solder, signals, sysadmins.
          </>
        }
        comment="founded 2019 · grid EM28pw · 501(c)(3)"
      />

      <Container maxW="container.lg" py={{ base: 8, md: 12 }}>
        <PhosPanel title="cat ~/manifest.txt" meta="6 sections">
          <Box
            px={{ base: 5, md: 7 }}
            py={{ base: 5, md: 6 }}
            fontFamily={PHOS.mono}
          >
            {SECTIONS.map((s, i) => (
              <Box key={s.h} mb={i < SECTIONS.length - 1 ? 6 : 0}>
                <Text
                  as="h3"
                  fontSize="11px"
                  color={PHOS.greenDim}
                  textTransform="uppercase"
                  letterSpacing="0.14em"
                  mb={2}
                >
                  {`# ${s.h.toLowerCase().replace(/\s+/g, '_')}`}
                </Text>
                <Text
                  as="h2"
                  fontSize={{ base: '20px', md: '24px' }}
                  color={PHOS.paper}
                  fontWeight="700"
                  mb={3}
                >
                  {s.h}
                </Text>
                <Text
                  fontSize="14px"
                  color={PHOS.paper}
                  opacity={0.85}
                  lineHeight="1.7"
                  mb={s.bullets ? 3 : 0}
                >
                  {s.body}
                </Text>
                {s.bullets && (
                  <UnorderedList styleType="none" m={0} pl={0}>
                    {s.bullets.map((b) => (
                      <ListItem
                        key={b}
                        fontSize="14px"
                        color={PHOS.paper}
                        opacity={0.85}
                        py="3px"
                        _before={{
                          content: '"+ "',
                          color: PHOS.green,
                          marginRight: '6px',
                        }}
                      >
                        {b}
                      </ListItem>
                    ))}
                  </UnorderedList>
                )}
              </Box>
            ))}
          </Box>
        </PhosPanel>

        <Box mt={6} display="flex" flexWrap="wrap" gap={3}>
          <Link
            as={NextLink}
            href="/app/register"
            border="1px solid"
            borderColor={PHOS.green}
            color={PHOS.bg}
            bg={PHOS.green}
            px={3.5}
            py={2}
            fontSize="13px"
            fontWeight="600"
            letterSpacing="0.02em"
            _hover={{ bg: PHOS.greenD, textDecoration: 'none' }}
          >
            ▶ join the club
          </Link>
          <Link
            as={NextLink}
            href="/events"
            border="1px solid"
            borderColor={PHOS.green}
            color={PHOS.green}
            px={3.5}
            py={2}
            fontSize="13px"
            fontWeight="600"
            letterSpacing="0.02em"
            _hover={{ bg: PHOS.green, color: PHOS.bg, textDecoration: 'none' }}
          >
            cat ./next-meeting
          </Link>
          <Link
            href="https://discord.gg/seckc"
            isExternal
            border="1px solid"
            borderColor={PHOS.line2}
            color={PHOS.greenDim}
            px={3.5}
            py={2}
            fontSize="13px"
            fontWeight="600"
            letterSpacing="0.02em"
            _hover={{
              borderColor: PHOS.green,
              color: PHOS.green,
              textDecoration: 'none',
            }}
          >
            ./irc → discord
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
