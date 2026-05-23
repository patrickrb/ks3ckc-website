'use client';

import React from 'react';

import { Avatar, Box, Container, Flex, Grid, Text } from '@chakra-ui/react';

import PhosPageHeader from '@/components/HomeRedesign/PhosPageHeader';
import PhosPanel from '@/components/HomeRedesign/PhosPanel';
import { PHOS } from '@/components/HomeRedesign/phosphorTheme';
import { getAvatarFallbackName, getAvatarUrl } from '@/lib/avatar';
import { trpc } from '@/lib/trpc/client';

export default function MembersPage() {
  const { data: membersData, isLoading } =
    trpc.users.getPublicMembers.useQuery();
  const members = membersData?.items ?? [];

  return (
    <Box>
      <PhosPageHeader
        cmd="cat /etc/passwd | grep -v ^#"
        title="club roster"
        subtitle="members who opted in to be listed publicly. callsigns, DMR IDs, notes."
        comment="opt-in only · privacy by default"
      />

      <Container maxW="container.lg" py={{ base: 8, md: 12 }}>
        <PhosPanel
          title="./roster.tsv"
          meta={
            isLoading
              ? 'loading…'
              : `${members.length} ${
                  members.length === 1 ? 'entry' : 'entries'
                }`
          }
        >
          {isLoading ? (
            <Box
              px={4}
              py={6}
              fontFamily={PHOS.mono}
              color={PHOS.greenDim}
              fontSize="13px"
            >
              ${' '}
              <Text as="span" color={PHOS.green}>
                fetching roster…
              </Text>
            </Box>
          ) : members.length === 0 ? (
            <Box
              px={4}
              py={6}
              fontFamily={PHOS.mono}
              color={PHOS.greenDim}
              fontSize="13px"
            >
              ${' '}
              <Text as="span" color={PHOS.paper}>
                no public members listed yet.
              </Text>
            </Box>
          ) : (
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={0}>
              {members.map((m, i) => (
                <Box
                  key={m.id}
                  px={4}
                  py={4}
                  borderTop="1px dashed"
                  borderColor={PHOS.line2}
                  borderRight={{
                    base: 'none',
                    md: i % 2 === 0 ? '1px dashed' : 'none',
                  }}
                  borderRightColor={PHOS.line2}
                >
                  <Flex gap={3} align="flex-start">
                    <Avatar
                      size="sm"
                      name={getAvatarFallbackName(m.name, null)}
                      src={getAvatarUrl(
                        m.image,
                        getAvatarFallbackName(m.name, null)
                      )}
                      bg={PHOS.greenDeep}
                      color={PHOS.green}
                      border="1px solid"
                      borderColor={PHOS.line2}
                      borderRadius="0"
                    />
                    <Box flex="1" fontFamily={PHOS.mono} minW={0}>
                      <Flex
                        align="baseline"
                        justify="space-between"
                        gap={2}
                        flexWrap="wrap"
                        mb={1}
                      >
                        <Text
                          fontSize="14px"
                          color={PHOS.paper}
                          fontWeight="600"
                        >
                          {m.name || 'anonymous'}
                        </Text>
                        {m.callsign && (
                          <Text
                            fontSize="13px"
                            color={PHOS.green}
                            fontWeight="700"
                          >
                            {m.callsign}
                          </Text>
                        )}
                      </Flex>
                      {m.dmrid && (
                        <Text fontSize="11px" color={PHOS.greenDim}>
                          dmrid: {m.dmrid}
                        </Text>
                      )}
                      {m.notes && (
                        <Text
                          fontSize="12px"
                          color={PHOS.paper}
                          opacity={0.75}
                          mt={1.5}
                          lineHeight="1.55"
                        >
                          {'// '}
                          {m.notes}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Grid>
          )}
        </PhosPanel>
      </Container>
    </Box>
  );
}
