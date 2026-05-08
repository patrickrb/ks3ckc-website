'use client';

import { Box, Flex, Grid, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

import { PHOS, blink } from './phosphorTheme';

const NAV_LINKS = [
  { label: 'about', href: '/about' },
  { label: 'events', href: '/events' },
  { label: 'projects', href: '/blog' },
  { label: 'license', href: '#license' },
];

const PEER_LINKS = [
  { label: 'seckc.org', href: 'https://seckc.org' },
  { label: 'github', href: 'https://github.com/patrickrb/ks3ckc-website' },
  { label: 'discord', href: 'https://discord.gg/seckc' },
  { label: 'qrz.com', href: 'https://www.qrz.com/db/KS3CKC' },
];

export default function PhosFooter() {
  return (
    <Box
      as="footer"
      px={{ base: 4, md: 8 }}
      pt={10}
      pb={8}
      borderTop="1px solid"
      borderColor={PHOS.line2}
      bg={PHOS.bg2}
      fontFamily={PHOS.mono}
    >
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: '2fr 1fr 1fr 1fr',
        }}
        gap={8}
        mb={7}
      >
        <Box>
          <Text fontSize="18px" fontWeight="700" color={PHOS.green} mb={1.5}>
            KS3CKC
            <Box as="span" color={PHOS.greenDim}>
              .radio
            </Box>
          </Text>
          <Text
            fontSize="12px"
            color={PHOS.greenDim}
            maxW="320px"
            lineHeight="1.6"
          >
            the amateur radio subgroup of seckc. kansas city, mo. EM28pw.
            501(c)(3) ein 88-XXXXXXX. all donations tax deductible.
          </Text>
        </Box>
        <Box>
          <Text
            fontSize="10px"
            color={PHOS.greenDim}
            textTransform="uppercase"
            letterSpacing="0.14em"
            mb={2.5}
          >
            {'// nav'}
          </Text>
          <Flex direction="column" gap={1} fontSize="13px">
            {NAV_LINKS.map((l) => (
              <Link
                as={NextLink}
                key={l.label}
                href={l.href}
                color={PHOS.greenD}
                textDecoration="underline"
                textUnderlineOffset="3px"
                _hover={{ color: PHOS.green, bg: 'rgba(57,255,20,0.12)' }}
              >
                {l.label}
              </Link>
            ))}
          </Flex>
        </Box>
        <Box>
          <Text
            fontSize="10px"
            color={PHOS.greenDim}
            textTransform="uppercase"
            letterSpacing="0.14em"
            mb={2.5}
          >
            {'// peer'}
          </Text>
          <Flex direction="column" gap={1} fontSize="13px">
            {PEER_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                isExternal
                color={PHOS.greenD}
                textDecoration="underline"
                textUnderlineOffset="3px"
                _hover={{ color: PHOS.green, bg: 'rgba(57,255,20,0.12)' }}
              >
                {l.label}
              </Link>
            ))}
          </Flex>
        </Box>
        <Box>
          <Text
            fontSize="10px"
            color={PHOS.greenDim}
            textTransform="uppercase"
            letterSpacing="0.14em"
            mb={2.5}
          >
            {'// freqs'}
          </Text>
          <Box fontSize="13px" lineHeight="1.7">
            <Text color={PHOS.green}>
              446.050{' '}
              <Box as="span" color={PHOS.greenDim}>
                69.3
              </Box>
            </Text>
            <Text color={PHOS.green}>
              145.555{' '}
              <Box as="span" color={PHOS.greenDim}>
                69.3
              </Box>
            </Text>
          </Box>
        </Box>
      </Grid>
      <Box
        borderTop="1px dashed"
        borderColor={PHOS.line2}
        pt={4}
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        fontSize="11px"
        color={PHOS.greenDim}
      >
        <Text>
          © 2019–2026 ks3ckc · MIT-ish · made with solder + segfaults
        </Text>
        <Text>
          73 de KS3CKC
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
      </Box>
    </Box>
  );
}
