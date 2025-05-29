'use client';

import React from 'react';

import { Box, Container, Heading, Stack, Tag, Text, Link as ChakraLink } from '@chakra-ui/react';
import { useQueryState } from 'nuqs';

import { BlogListEntry } from '@/features/blogs/BlogListEntry';
import { trpc } from '@/lib/trpc/client';

const ArticleList = () => {
  const [searchTerm] = useQueryState('s', { defaultValue: '' });
  const [tag] = useQueryState('tag', { defaultValue: '' });
  const blogs = trpc.blogs.getAll.useInfiniteQuery(
    { searchTerm, tag: tag || undefined },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <Container maxW={'7xl'} p="12">
      <Heading as="h1">Blog entries</Heading>
      {tag && (
        <Box mt={4}>
          <Text fontSize="sm" color="gray.600" mb={2}>
            Showing posts tagged with:
          </Text>
          <Tag size="md" variant="solid" colorScheme="orange" mr={2}>
            {tag}
          </Tag>
          <ChakraLink href="/blog" fontSize="sm" color="blue.500" _hover={{ textDecoration: 'underline' }}>
            Clear filter
          </ChakraLink>
        </Box>
      )}
      {blogs.data?.pages.map((page, i) => (
        <Stack spacing={5} key={i}>
          {page.items.map((blog, index) => (
            <BlogListEntry
              key={blog.id}
              blog={blog}
              layoutDirection={index % 2 === 0 ? 'normal' : 'reverse'}
            />
          ))}
        </Stack>
      ))}
    </Container>
  );
};

export default function BlogListPage() {
  return (
    <Box>
      <Container maxW="container.lg">
        <ArticleList />
      </Container>
    </Box>
  );
}
