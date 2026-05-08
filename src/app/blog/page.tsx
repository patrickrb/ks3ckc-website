'use client';

import React, { Suspense } from 'react';

import { Box, Container, Flex, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useQueryState } from 'nuqs';

import PhosPageHeader from '@/components/HomeRedesign/PhosPageHeader';
import PhosPanel from '@/components/HomeRedesign/PhosPanel';
import { PHOS } from '@/components/HomeRedesign/phosphorTheme';
import { truncateContent } from '@/lib/text';
import { trpc } from '@/lib/trpc/client';

const ArticleList = () => {
  const [searchTerm] = useQueryState('s', { defaultValue: '' });
  const [tag, setTag] = useQueryState('tag', { defaultValue: '' });
  const blogs = trpc.blogs.getAll.useInfiniteQuery(
    { searchTerm, tag: tag || undefined },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const isLoading = blogs.isLoading || blogs.isFetching;
  const allItems = blogs.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <Box>
      {tag && (
        <Box
          mb={4}
          px={3.5}
          py={2.5}
          border="1px solid"
          borderColor={PHOS.line2}
          fontFamily={PHOS.mono}
          fontSize="12px"
          color={PHOS.greenDim}
          display="flex"
          alignItems="center"
          gap={3}
        >
          <Text>$ grep --tag={tag} ./blog/*</Text>
          <Box
            as="button"
            onClick={() => setTag(null)}
            color={PHOS.amber}
            border="1px solid"
            borderColor={PHOS.amber}
            px={2}
            py="2px"
            fontSize="10px"
            cursor="pointer"
            _hover={{ bg: PHOS.amber, color: PHOS.bg }}
          >
            ✗ clear
          </Box>
        </Box>
      )}

      <PhosPanel
        title="ls -la ~/blog/"
        meta={
          isLoading
            ? 'loading…'
            : `${allItems.length} ${
                allItems.length === 1 ? 'entry' : 'entries'
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
              find ./blog -type f -newer 30d
            </Text>{' '}
            …
          </Box>
        ) : allItems.length === 0 ? (
          <Box
            px={4}
            py={6}
            fontFamily={PHOS.mono}
            color={PHOS.greenDim}
            fontSize="13px"
          >
            ${' '}
            <Text as="span" color={PHOS.paper}>
              no entries match
            </Text>
          </Box>
        ) : (
          <Box>
            {allItems.map((entry) => (
              <Link
                as={NextLink}
                key={entry.id}
                href={`/blog/${entry.id}`}
                display="block"
                px={4}
                py={4}
                borderTop="1px dashed"
                borderColor={PHOS.line2}
                textDecoration="none"
                _hover={{
                  bg: 'rgba(57,255,20,0.04)',
                  textDecoration: 'none',
                }}
                role="group"
              >
                <Flex
                  align="baseline"
                  justify="space-between"
                  gap={3}
                  flexWrap="wrap"
                  mb={1.5}
                >
                  <Text
                    fontSize={{ base: '15px', md: '17px' }}
                    color={PHOS.green}
                    fontWeight="700"
                    _groupHover={{ color: PHOS.greenD }}
                  >
                    {entry.title}
                  </Text>
                  <Text
                    fontFamily={PHOS.mono}
                    fontSize="11px"
                    color={PHOS.greenDim}
                  >
                    {new Date(entry.createdAt).toISOString().slice(0, 10)}
                  </Text>
                </Flex>
                <Text
                  fontSize="13px"
                  color={PHOS.paper}
                  opacity={0.75}
                  lineHeight="1.55"
                  mb={entry.tags.length > 0 ? 2 : 0}
                >
                  {truncateContent(entry.content, 200).text}
                  {truncateContent(entry.content, 200).isTruncated ? '…' : ''}
                </Text>
                <Flex gap={2} flexWrap="wrap" align="center">
                  {entry.author?.name && (
                    <Text
                      fontFamily={PHOS.mono}
                      fontSize="11px"
                      color={PHOS.greenDim}
                    >
                      author: {entry.author.callsign || entry.author.name}
                    </Text>
                  )}
                  {entry.tags.map((t) => (
                    <Box
                      key={t}
                      as="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setTag(t);
                      }}
                      fontFamily={PHOS.mono}
                      fontSize="10px"
                      px="6px"
                      py="2px"
                      border="1px solid"
                      borderColor={PHOS.line2}
                      color={PHOS.amber}
                      cursor="pointer"
                      _hover={{
                        borderColor: PHOS.amber,
                        bg: 'rgba(255,176,0,0.1)',
                      }}
                    >
                      #{t}
                    </Box>
                  ))}
                </Flex>
              </Link>
            ))}
          </Box>
        )}
      </PhosPanel>

      {blogs.hasNextPage && (
        <Box mt={4} textAlign="center">
          <Box
            as="button"
            onClick={() => blogs.fetchNextPage()}
            border="1px solid"
            borderColor={PHOS.green}
            color={PHOS.green}
            bg="transparent"
            px={4}
            py={2}
            fontFamily={PHOS.mono}
            fontSize="13px"
            fontWeight="600"
            cursor="pointer"
            _hover={{ bg: PHOS.green, color: PHOS.bg }}
          >
            ./load-more
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default function BlogListPage() {
  return (
    <Box>
      <PhosPageHeader
        cmd="cat ~/blog/*.md | less"
        title="blog &amp; build logs"
        subtitle="club news, antenna builds, contest writeups, RF rabbit holes."
        comment="rss: /blog/feed.xml"
      />

      <Container maxW="container.lg" py={{ base: 8, md: 12 }}>
        <Suspense
          fallback={
            <PhosPanel title="ls -la ~/blog/" meta="loading…">
              <Box
                px={4}
                py={6}
                fontFamily={PHOS.mono}
                color={PHOS.greenDim}
                fontSize="13px"
              >
                $ initializing index…
              </Box>
            </PhosPanel>
          }
        >
          <ArticleList />
        </Suspense>
      </Container>
    </Box>
  );
}
