import { Box, Heading, Text, useColorModeValue, SimpleGrid } from '@chakra-ui/react';

import { trpc } from '@/lib/trpc/client';

export default function NewsItems() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const { data: newsData, isLoading, error } = trpc.news.getAll.useQuery({
    limit: 8,
  });

  const newsItems = newsData?.items || [];

  if (isLoading) {
    return (
      <>
        <Heading as="h3" size="lg" mb={6}>
          Latest News
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6} w="full">
          {Array.from({ length: 8 }).map((_, i) => (
            <Box 
              key={i} 
              bg={cardBg} 
              p={6} 
              borderRadius="lg" 
              shadow="md"
              borderWidth="1px"
              borderColor={borderColor}
              h="280px"
              display="flex"
              flexDirection="column"
            >
              <Box h="4" bg="gray.200" borderRadius="md" mb={3} />
              <Box h="3" bg="gray.200" borderRadius="md" mb={4} w="32" />
              <Box flex="1">
                <Box h="3" bg="gray.200" borderRadius="md" mb={2} />
                <Box h="3" bg="gray.200" borderRadius="md" mb={2} w="80%" />
                <Box h="3" bg="gray.200" borderRadius="md" w="60%" />
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Heading as="h3" size="lg" mb={6}>
          Latest News
        </Heading>
        <Text color="red.500">Error loading news. Please try again later.</Text>
      </>
    );
  }

  return (
    <>
      <Heading as="h3" size="lg" mb={6}>
        Latest News
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6} w="full">
        {Array.isArray(newsItems) &&
          newsItems.map((item, i) => (
            <Box 
              key={item.id} 
              data-testid="news-item"
              bg={cardBg} 
              p={6} 
              borderRadius="lg" 
              shadow="md"
              borderWidth="1px"
              borderColor={borderColor}
              transition="all 0.2s"
              _hover={{
                shadow: 'lg',
                transform: 'translateY(-2px)'
              }}
              h="280px"
              display="flex"
              flexDirection="column"
            >
              <Heading as="h4" size="md" mb={3} lineHeight="1.3" data-testid="heading-md">
                {item.title}
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4} fontWeight="medium">
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
              <Text fontSize="sm" lineHeight="1.6" flex="1" overflow="hidden">
                {item.content}
              </Text>
            </Box>
          ))}
      </SimpleGrid>
    </>
  );
}
