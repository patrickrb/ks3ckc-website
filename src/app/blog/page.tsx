'use client';

import React from 'react';

import { Box, Container, Heading, Stack, Tag, Text, Link as ChakraLink, Button } from '@chakra-ui/react';
import { useQueryState } from 'nuqs';

import { BlogListEntry } from '@/features/blogs/BlogListEntry';
import { BlogListSkeleton } from '@/features/blogs/BlogListSkeleton';
import { trpc } from '@/lib/trpc/client';

const ArticleList = () => {
  const [searchTerm] = useQueryState('s', { defaultValue: '' });
  const [tag] = useQueryState('tag', { defaultValue: '' });
  const blogs = trpc.blogs.getAll.useInfiniteQuery(
    { searchTerm, tag: tag || undefined },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 0, // Force fresh data to ensure loading state is visible
      cacheTime: 0, // Don't cache results to ensure loading state shows
      refetchOnMount: true, // Always refetch when component mounts
    }
  );

  // Debug logging to verify loading state
  console.log('Blog loading state:', { 
    isLoading: blogs.isLoading, 
    isFetching: blogs.isFetching,
    hasData: !!blogs.data 
  });
  return (
    <Container maxW={'7xl'} p="12">
      <Heading as="h1">Blog entries</Heading>
      
      {/* Debug button to test loading state */}
      {process.env.NODE_ENV === 'development' && (
        <Button 
          onClick={() => blogs.refetch()} 
          size="sm" 
          colorScheme="blue" 
          mt={2}
          isLoading={blogs.isLoading || blogs.isFetching}
        >
          {blogs.isLoading || blogs.isFetching ? 'Loading...' : 'Refetch Posts (Test Loading)'}
        </Button>
      )}
      
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
      {blogs.isLoading || blogs.isFetching ? (
        <Stack spacing={5} mt={8}>
          {[...Array(3)].map((_, index) => (
            <BlogListSkeleton
              key={index}
              layoutDirection={index % 2 === 0 ? 'normal' : 'reverse'}
            />
          ))}
        </Stack>
      ) : (
        blogs.data?.pages.map((page, i) => (
          <Stack spacing={5} key={i}>
            {page.items.map((blog, index) => (
              <BlogListEntry
                key={blog.id}
                blog={blog}
                layoutDirection={index % 2 === 0 ? 'normal' : 'reverse'}
              />
            ))}
          </Stack>
        ))
      )}
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
