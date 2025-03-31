'use client';

import { useEffect, useState } from 'react';

import {
  Box,
  Container,
  Divider,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

interface Member {
  id: string;
  name: string;
  callsign: string;
  active: boolean;
  misc?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const miscTextColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members');
        if (!response.ok) throw new Error('Failed to fetch members');
        const data = await response.json();
        setMembers(data.filter((member: Member) => member.active));
      } catch (err) {
        setError('Failed to load members');
        console.error('Error fetching members:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading members...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text color="red.500">{error}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Club Members
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Meet our active club members
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {members.map((member) => (
            <Box
              key={member.id}
              p={6}
              bg={cardBg}
              borderWidth="1px"
              borderColor={cardBorder}
              borderRadius="lg"
              shadow="sm"
              transition="all 0.2s"
              _hover={{ shadow: 'md' }}
            >
              <VStack spacing={3} align="start">
                <Heading size="md">{member.name}</Heading>
                <Text fontSize="lg" color="blue.500" fontWeight="medium">
                  {member.callsign}
                </Text>
                {member.misc && (
                  <>
                    <Divider />
                    <Text
                      fontSize="sm"
                      color={miscTextColor}
                      whiteSpace="pre-line"
                    >
                      {member.misc}
                    </Text>
                  </>
                )}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        {members.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text fontSize="lg" color="gray.600">
              No active members found
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}
