'use client';

import { ReactNode } from 'react';

import { Box, HStack, Text } from '@chakra-ui/react';

import { PHOS, blink } from './phosphorTheme';

type Props = {
  cmd: string;
  title: string;
  subtitle?: ReactNode;
  comment?: string;
};

export default function PhosPageHeader({
  cmd,
  title,
  subtitle,
  comment,
}: Props) {
  return (
    <Box
      as="section"
      position="relative"
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 12 }}
      borderBottom="1px solid"
      borderColor={PHOS.line2}
      fontFamily={PHOS.mono}
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
      <HStack spacing={2} mb={2}>
        <Text color={PHOS.greenDim} fontSize="13px">
          $
        </Text>
        <Text color={PHOS.green} fontSize="13px">
          {cmd}
        </Text>
        <Box
          as="span"
          display="inline-block"
          ml="2px"
          color={PHOS.green}
          animation={`${blink} 1s steps(1) infinite`}
        >
          █
        </Box>
      </HStack>

      <Text
        as="h1"
        fontSize={{ base: '28px', md: '40px' }}
        color={PHOS.paper}
        fontWeight="700"
        lineHeight="1.1"
        textShadow="0 0 12px rgba(57,255,20,0.25)"
        mb={subtitle ? 3 : 0}
      >
        {title}
      </Text>

      {subtitle && (
        <Box
          color={PHOS.paper}
          opacity={0.8}
          fontSize={{ base: '14px', md: '15px' }}
          maxW="720px"
        >
          {subtitle}
        </Box>
      )}

      {comment && (
        <Text mt={3} fontSize="11px" color={PHOS.greenDim}>
          {'// '}
          {comment}
        </Text>
      )}
    </Box>
  );
}
