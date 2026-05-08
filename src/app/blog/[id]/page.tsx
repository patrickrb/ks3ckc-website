'use client';

import React from 'react';

import { Box, Container, Flex, Image, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';

import PhosPanel from '@/components/HomeRedesign/PhosPanel';
import { PHOS } from '@/components/HomeRedesign/phosphorTheme';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { trpc } from '@/lib/trpc/client';

export default function BlogDetailPage() {
  const params = useParams();
  const blog = trpc.blogs.getByIdPublic.useQuery(
    { id: params?.id?.toString() ?? '' },
    { refetchOnReconnect: false, refetchOnWindowFocus: false }
  );

  return (
    <Box>
      <Container maxW="container.lg" py={{ base: 8, md: 12 }}>
        <Box mb={4}>
          <Link
            as={NextLink}
            href="/blog"
            color={PHOS.greenDim}
            fontFamily={PHOS.mono}
            fontSize="12px"
            _hover={{ color: PHOS.green, textDecoration: 'underline' }}
          >
            ← cd ../blog
          </Link>
        </Box>

        {blog.isLoading && (
          <PhosPanel title="loading…" meta="">
            <Box
              px={4}
              py={6}
              fontFamily={PHOS.mono}
              color={PHOS.greenDim}
              fontSize="13px"
            >
              $ cat ./entry.md
            </Box>
          </PhosPanel>
        )}

        {(blog.isError || (!blog.isLoading && !blog.data)) && (
          <PhosPanel title="404 not found" meta="error">
            <Box px={4} py={6} fontFamily={PHOS.mono}>
              <Text color={PHOS.red} mb={3}>
                bash: ./blog/{params?.id}: no such file or directory
              </Text>
              <Link
                as={NextLink}
                href="/blog"
                color={PHOS.green}
                fontFamily={PHOS.mono}
                _hover={{ color: PHOS.greenD, textDecoration: 'underline' }}
              >
                ← back to ./blog
              </Link>
            </Box>
          </PhosPanel>
        )}

        {blog.data && (
          <PhosPanel
            title={`./${blog.data.id}.md`}
            meta={new Date(blog.data.createdAt).toISOString().slice(0, 10)}
          >
            <Box
              px={{ base: 4, md: 8 }}
              py={{ base: 5, md: 8 }}
              fontFamily={PHOS.mono}
            >
              <Flex gap={2} flexWrap="wrap" mb={3}>
                {blog.data.tags?.map((t: string) => (
                  <Link
                    as={NextLink}
                    key={t}
                    href={`/blog?tag=${encodeURIComponent(t)}`}
                    fontFamily={PHOS.mono}
                    fontSize="10px"
                    px="6px"
                    py="2px"
                    border="1px solid"
                    borderColor={PHOS.line2}
                    color={PHOS.amber}
                    _hover={{
                      borderColor: PHOS.amber,
                      bg: 'rgba(255,176,0,0.1)',
                      textDecoration: 'none',
                    }}
                  >
                    #{t}
                  </Link>
                ))}
              </Flex>

              <Text
                as="h1"
                fontSize={{ base: '24px', md: '34px' }}
                color={PHOS.paper}
                fontWeight="700"
                lineHeight="1.15"
                textShadow="0 0 12px rgba(57,255,20,0.2)"
                mb={2}
              >
                {blog.data.title}
              </Text>

              <Text fontSize="12px" color={PHOS.greenDim} mb={6}>
                {'// '}
                {blog.data.author?.callsign ||
                  blog.data.author?.name ||
                  'unknown'}
                {' · '}
                {new Date(blog.data.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>

              {blog.data.featuredImage && (
                <Image
                  src={blog.data.featuredImage}
                  alt=""
                  border="1px solid"
                  borderColor={PHOS.line2}
                  mb={6}
                />
              )}

              <Box
                color={PHOS.paper}
                fontFamily={PHOS.mono}
                lineHeight="1.7"
                sx={{
                  '& h1, & h2, & h3, & h4': {
                    color: PHOS.green,
                    fontFamily: PHOS.mono,
                    marginTop: '1.5em',
                    marginBottom: '0.5em',
                  },
                  '& a': {
                    color: PHOS.greenD,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  },
                  '& a:hover': {
                    color: PHOS.green,
                    background: 'rgba(57,255,20,0.12)',
                  },
                  '& code': {
                    background: PHOS.greenDeep,
                    color: PHOS.green,
                    padding: '1px 5px',
                    fontSize: '0.9em',
                  },
                  '& pre': {
                    background: PHOS.greenDeep,
                    border: `1px solid ${PHOS.line2}`,
                    padding: '12px',
                    overflowX: 'auto',
                  },
                  '& blockquote': {
                    borderLeft: `3px solid ${PHOS.green}`,
                    paddingLeft: '12px',
                    color: PHOS.greenDim,
                    margin: '1em 0',
                  },
                  '& img': {
                    border: `1px solid ${PHOS.line2}`,
                    maxWidth: '100%',
                  },
                  '& hr': {
                    border: 'none',
                    borderTop: `1px dashed ${PHOS.line2}`,
                    margin: '1.5em 0',
                  },
                }}
              >
                <MarkdownRenderer content={blog.data.content} />
              </Box>
            </Box>
          </PhosPanel>
        )}
      </Container>
    </Box>
  );
}
