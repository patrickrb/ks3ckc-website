import React from 'react';

import { 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Image, 
  Box, 
  useColorModeValue,
  Link
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';

import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { trpc } from '@/lib/trpc/client';

export const Blog = () => {
  const params = useParams();

  const blog = trpc.blogs.getByIdPublic.useQuery(
    {
      id: params?.id?.toString() ?? '',
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const authorDateColor = useColorModeValue('gray.600', 'gray.400');

  if (blog.isLoading) {
    return (
      <Container maxW="4xl" py="40px">
        <VStack spacing="4">
          <Text fontSize="lg">Loading blog post...</Text>
        </VStack>
      </Container>
    );
  }

  if (blog.isError || !blog.data) {
    return (
      <Container maxW="4xl" py="40px">
        <VStack spacing="4" textAlign="center">
          <Heading size="lg" color="red.500">Blog Not Found</Heading>
          <Text>The blog post you're looking for doesn't exist or has been removed.</Text>
          <Link href="/blog" color="blue.500" _hover={{ color: 'blue.600' }}>
            ← Return to all blogs
          </Link>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py="40px">
      <VStack spacing="6" alignItems="stretch">
        {/* Back to Blogs Link */}
        <Box>
          <Link href="/blog" color="blue.500" _hover={{ color: 'blue.600' }}>
            ← Back to all blogs
          </Link>
        </Box>

        {/* Featured Image */}
        {blog.data.featuredImage && (
          <Box>
            <Image
              src={blog.data.featuredImage}
              alt={`Featured image for ${blog.data.title}`}
              borderRadius="lg"
              width="100%"
              maxHeight="400px"
              objectFit="cover"
            />
          </Box>
        )}

        {/* Title */}
        <Heading as="h1" size="2xl" textAlign="center">
          {blog.data.title}
        </Heading>

        {/* Author and Date Info */}
        <Box>
          <HStack 
            spacing="4" 
            justifyContent="center" 
            p="4" 
            bg={bgColor} 
            borderRadius="md"
          >
            <Image
              borderRadius="full"
              boxSize="50px"
              src={
                blog.data.author.image || 
                "https://100k-faces.glitch.me/random-image"
              }
              alt={`Avatar of ${blog.data.author.name || 'Author'}`}
            />
            <VStack spacing="0" alignItems="flex-start">
              <Text fontWeight="semibold" fontSize="md">
                {blog.data.author.name || 'Anonymous Author'}
              </Text>
              <Text fontSize="sm" color={authorDateColor}>
                {new Date(blog.data.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              {blog.data.author.callsign && (
                <Text fontSize="xs" color={authorDateColor}>
                  Callsign: {blog.data.author.callsign}
                </Text>
              )}
            </VStack>
          </HStack>
        </Box>

        {/* Blog Content */}
        <Box>
          <MarkdownRenderer 
            content={blog.data.content} 
            fontSize="lg"
            lineHeight="1.7"
          />
        </Box>
      </VStack>
    </Container>
  );
};
