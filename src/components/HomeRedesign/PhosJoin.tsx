'use client';

import { Box, Button, Flex, Grid, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

import { PHOS } from './phosphorTheme';

const STEPS: { label: string; href?: string }[] = [
  {
    label: 'install hamstudy.org — free practice tests',
    href: 'https://hamstudy.org',
  },
  { label: 'show up to a wednesday club net, lurk' },
  { label: 'book a vec session — 2nd wed of each month' },
  { label: 'pass. callsign in ~10 days. welcome.' },
];

const PERKS = [
  'repeater access (446.050, 145.555)',
  'club callsign privileges (KS3CKC/portable)',
  'field day team + special events',
  'badge kits at cost · solder lab access',
  'our discord, our shame',
];

function PanelHeader({
  left,
  right,
  rightColor,
}: {
  left: string;
  right: string;
  rightColor?: string;
}) {
  return (
    <Flex
      align="center"
      justify="space-between"
      px={2.5}
      py={1.5}
      bg={PHOS.greenDeep}
      borderBottom="1px solid"
      borderColor={PHOS.line2}
      fontSize="11px"
      textTransform="uppercase"
      letterSpacing="0.12em"
      color={PHOS.greenD}
    >
      <Text>
        <Box as="span" color={PHOS.green} mr={2}>
          ◆
        </Box>
        {left}
      </Text>
      <Text color={rightColor ?? PHOS.greenD}>{right}</Text>
    </Flex>
  );
}

function PhosBtn({
  children,
  href,
  primary = false,
  isExternal = false,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
  isExternal?: boolean;
}) {
  return (
    <Button
      as={NextLink}
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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

export default function PhosJoin() {
  return (
    <Box
      as="section"
      id="license"
      px={{ base: 4, md: 8 }}
      py={{ base: 12, md: 16 }}
      borderTop="1px solid"
      borderColor={PHOS.line2}
      fontFamily={PHOS.mono}
    >
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
        <Box border="1px solid" borderColor={PHOS.line2} bg={PHOS.panel}>
          <PanelHeader
            left="./get-licensed.sh"
            right="recommended"
            rightColor={PHOS.amber}
          />
          <Box px={5.5} py={5}>
            <Text
              as="h3"
              fontSize="22px"
              mb={2.5}
              color={PHOS.paper}
              fontWeight="700"
            >
              no license? we got you.
            </Text>
            <Text
              fontSize="14px"
              color={PHOS.greenDim}
              mb={4.5}
              lineHeight="1.6"
            >
              the FCC technician class license is 35 questions, mostly multiple
              choice. we run free study sessions and you can test with us at
              $15.
            </Text>
            <Box
              as="ol"
              pl={4.5}
              m={0}
              color={PHOS.paper}
              fontSize="14px"
              lineHeight="1.8"
            >
              {STEPS.map((s, i) => (
                <Box as="li" key={i}>
                  <Box as="span" color={PHOS.green}>
                    ${' '}
                  </Box>
                  {s.href ? (
                    <Link
                      href={s.href}
                      isExternal
                      color={PHOS.greenD}
                      textDecoration="underline"
                      textUnderlineOffset="3px"
                      _hover={{ color: PHOS.green, bg: 'rgba(57,255,20,0.12)' }}
                    >
                      {s.label}
                    </Link>
                  ) : (
                    s.label
                  )}
                </Box>
              ))}
            </Box>
            <Box mt={5.5}>
              <PhosBtn href="/about" primary>
                ./bootstrap-license.sh
              </PhosBtn>
            </Box>
          </Box>
        </Box>

        <Box
          border="1px solid"
          borderColor={PHOS.line2}
          bg="rgba(57,255,20,0.04)"
        >
          <PanelHeader left="sudo join ks3ckc" right="$25/yr" />
          <Box px={5.5} py={5}>
            <Text
              as="h3"
              fontSize="22px"
              mb={2.5}
              color={PHOS.paper}
              fontWeight="700"
            >
              become a member
            </Text>
            <Box
              as="ul"
              listStyleType="none"
              p={0}
              m={0}
              mb={4.5}
              fontSize="14px"
              color={PHOS.paper}
              lineHeight="1.9"
            >
              {PERKS.map((p, i) => (
                <Box as="li" key={i}>
                  <Box as="span" color={PHOS.green}>
                    +{' '}
                  </Box>
                  {p}
                </Box>
              ))}
              <Box as="li" color={PHOS.greenDim}>
                + tax-deductible — 501(c)(3)
              </Box>
            </Box>
            <Flex gap={2.5} flexWrap="wrap">
              <PhosBtn href="/app/register" primary>
                execve(&quot;/usr/bin/join&quot;)
              </PhosBtn>
              <PhosBtn href="/about">donate</PhosBtn>
            </Flex>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}
