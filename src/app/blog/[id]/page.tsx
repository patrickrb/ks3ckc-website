'use client';

import React from 'react';

import { Box, Container } from '@chakra-ui/react';

import { Blog } from '@/features/blogs/Blog';

export default function BlogListPage() {
  return (
    <Box>
      <Container maxW="container.lg">
        <Blog />
      </Container>
    </Box>
  );
}
