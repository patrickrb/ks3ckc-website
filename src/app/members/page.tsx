'use client';

import React from 'react';

import {
  Box,
  Card,
  CardBody,
  Container,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { SlideIn } from '@/components/SlideIn';
import { Viewport } from '@/components/Viewport';
import { trpc } from '@/lib/trpc/client';

export default function MembersPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  const { data: membersData, isLoading } = trpc.users.getPublicMembers.useQuery();
  const members = membersData?.items || [];

  return (
    <Viewport bg={bgColor} _dark={{ bg: 'gray.900' }}>
      <SlideIn>
        <Container maxW="7xl" py={{ base: '12', md: '24' }}>
          <Stack spacing={8}>
            <Heading as="h1" size="2xl" textAlign="center" mb={10}>
              Our Members
            </Heading>
            
            {isLoading ? (
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap={6}
              >
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} height="200px" borderRadius="md" />
                ))}
              </Grid>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {members.map((member) => (
                  <Card key={member.id} bg={cardBg} shadow="md" borderRadius="lg">
                    <CardBody>
                      <Stack spacing={3}>
                        <Flex align="center">
                          <Heading size="md">{member.name}</Heading>
                          <Spacer />
                          {member.callsign && (
                            <Text fontWeight="bold" color="blue.500">
                              {member.callsign}
                            </Text>
                          )}
                        </Flex>
                        
                        {member.dmrid && (
                          <Text color="gray.600" _dark={{ color: 'gray.300' }}>
                            <Text as="span" fontWeight="bold">DMR ID:</Text> {member.dmrid}
                          </Text>
                        )}
                        
                        {member.notes && (
                          <Box mt={2}>
                            <Text fontStyle="italic" color="gray.600" _dark={{ color: 'gray.300' }}>
                              {member.notes}
                            </Text>
                          </Box>
                        )}
                      </Stack>
                    </CardBody>
                  </Card>
                ))}
                
                {members.length === 0 && (
                  <Box
                    gridColumn={{ md: 'span 2', lg: 'span 3' }}
                    textAlign="center"
                    p={10}
                    borderRadius="md"
                  >
                    <Text fontSize="lg">No publicly visible members found.</Text>
                  </Box>
                )}
              </SimpleGrid>
            )}
          </Stack>
        </Container>
      </SlideIn>
    </Viewport>
  );
}