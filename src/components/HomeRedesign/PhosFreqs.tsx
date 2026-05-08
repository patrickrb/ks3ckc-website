'use client';

import { Box, Flex, HStack, Text } from '@chakra-ui/react';

import { FREQUENCIES } from './freqsData';
import { PHOS, blink } from './phosphorTheme';

export default function PhosFreqs() {
  return (
    <Box
      as="section"
      id="freqs"
      px={{ base: 4, md: 8 }}
      py={{ base: 12, md: 16 }}
      borderTop="1px solid"
      borderColor={PHOS.line2}
      bg={PHOS.bg}
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
          cat /etc/frequencies
        </Text>
        <Text color={PHOS.greenDim} fontSize="12px">
          # club repeaters &amp; nets — bookmark this
        </Text>
      </HStack>

      <Box border="1px solid" borderColor={PHOS.line2} bg={PHOS.panel}>
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
            club_frequencies.csv
          </Text>
          <Text fontSize="10px">
            {FREQUENCIES.length} entries · last update 2d ago
          </Text>
        </Flex>

        <Box overflowX="auto">
          <Box
            as="table"
            w="100%"
            sx={{ borderCollapse: 'collapse' }}
            fontSize="13px"
            minW="580px"
          >
            <Box
              as="thead"
              color={PHOS.greenDim}
              fontSize="10px"
              textTransform="uppercase"
              letterSpacing="0.12em"
            >
              <Box as="tr">
                {[
                  'name',
                  'freq (mhz)',
                  'tone',
                  'mode',
                  'loc',
                  'last_heard',
                ].map((h, i) => (
                  <Box
                    as="th"
                    key={h}
                    textAlign={i === 5 ? 'right' : 'left'}
                    px={3.5}
                    py={2.5}
                    fontWeight="normal"
                  >
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {FREQUENCIES.map((r, i) => (
                <Box
                  as="tr"
                  key={i}
                  borderTop="1px dashed"
                  borderColor={PHOS.line2}
                  bg={
                    r.type === 'primary'
                      ? 'rgba(57,255,20,0.04)'
                      : 'transparent'
                  }
                >
                  <Box
                    as="td"
                    px={3.5}
                    py={2.5}
                    color={r.type === 'primary' ? PHOS.green : PHOS.paper}
                  >
                    {r.type === 'primary' && (
                      <Box as="span" color={PHOS.amber}>
                        ★{' '}
                      </Box>
                    )}
                    {r.label}
                  </Box>
                  <Box
                    as="td"
                    px={3.5}
                    py={2.5}
                    color={r.type === 'primary' ? PHOS.green : PHOS.paper}
                  >
                    {r.freq}
                  </Box>
                  <Box as="td" px={3.5} py={2.5} color={PHOS.paper}>
                    {r.tone}
                  </Box>
                  <Box as="td" px={3.5} py={2.5} color={PHOS.greenDim}>
                    {r.mode}
                  </Box>
                  <Box as="td" px={3.5} py={2.5} color={PHOS.greenDim}>
                    {r.loc}
                  </Box>
                  <Box
                    as="td"
                    px={3.5}
                    py={2.5}
                    textAlign="right"
                    color={PHOS.greenDim}
                  >
                    {r.lastHeard} ago
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Text mt={3.5} fontSize="12px" color={PHOS.greenDim}>
        ${' '}
        <Box as="span" color={PHOS.paper}>
          curl ks3ckc.radio/freqs.json | jq
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
        &nbsp;&nbsp;{' '}
        <Box as="span" color={PHOS.paper}>
          # yes really
        </Box>
      </Text>
    </Box>
  );
}
