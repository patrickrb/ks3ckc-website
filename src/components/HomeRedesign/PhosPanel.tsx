'use client';

import { ReactNode } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import { PHOS } from './phosphorTheme';

type Props = {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
};

export default function PhosPanel({ title, meta, children }: Props) {
  return (
    <Box
      border="1px solid"
      borderColor={PHOS.line2}
      bg={PHOS.panel}
      fontFamily={PHOS.mono}
    >
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
        gap={3}
      >
        <Text>
          <Box as="span" color={PHOS.green} mr={2}>
            ◆
          </Box>
          {title}
        </Text>
        {meta && <Box fontSize="10px">{meta}</Box>}
      </Flex>
      <Box>{children}</Box>
    </Box>
  );
}
