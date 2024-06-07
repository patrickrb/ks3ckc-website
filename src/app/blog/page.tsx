'use client';

import React from 'react';

import { Box, Container, Heading, Stack } from '@chakra-ui/react';
import { useQueryState } from 'nuqs';

import { BlogEntry } from '@/features/blogs/BlogEntry';
import { trpc } from '@/lib/trpc/client';

const ArticleList = () => {
  const [searchTerm] = useQueryState('s', { defaultValue: '' });
  const blogs = trpc.blogs.getAll.useInfiniteQuery(
    { searchTerm },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <Container maxW={'7xl'} p="12">
      <Heading as="h1">Blog entries</Heading>
      {blogs.data?.pages.map((page, i) => (
        <Stack spacing={5} key={i}>
          {page.items.map((blog, index) => (
            <BlogEntry
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
