import React from 'react';

import {
  Box,
  HStack,
  Heading,
  Image,
  Link,
  MenuProps,
  SpaceProps,
  Tag,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import type { RouterOutputs } from '@/lib/trpc/types';

interface BlogAuthorProps {
  date: Date;
  name: string;
}

interface IBlogTags {
  tags: Array<string>;
  marginTop?: SpaceProps['marginTop'];
}

export type AdminBlogActionProps = Omit<MenuProps, 'children'> & {
  blog: RouterOutputs['blogs']['getAll']['items'][number];
  layoutDirection?: 'normal' | 'reverse';
};

const BlogTags: React.FC<IBlogTags> = (props) => {
  // Don't render anything if there are no tags
  if (!props.tags || props.tags.length === 0) {
    return null;
  }

  return (
    <HStack spacing={2} marginTop={props.marginTop}>
      {props.tags.map((tag) => {
        return (
          <Tag 
            size={'md'} 
            variant="solid" 
            colorScheme="orange" 
            key={tag}
            as="a"
            href={`/blog?tag=${encodeURIComponent(tag)}`}
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
          >
            {tag}
          </Tag>
        );
      })}
    </HStack>
  );
};

export const BlogAuthor: React.FC<BlogAuthorProps> = (props) => {
  return (
    <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
      <Image
        borderRadius="full"
        boxSize="40px"
        src="https://100k-faces.glitch.me/random-image"
        alt={`Avatar of ${props.name}`}
      />
      <Text fontWeight="medium">{props.name}</Text>
      <Text>—</Text>
      <Text>{props.date.toLocaleDateString()}</Text>
    </HStack>
  );
};

export const BlogListEntry = ({
  blog,
  layoutDirection = 'normal',
}: AdminBlogActionProps) => {
  return (
    <>
      <Box
        marginTop={{ base: '1', sm: '5' }}
        display="flex"
        flexDirection={{
          base: 'column',
          sm: layoutDirection === 'normal' ? 'row' : 'row-reverse',
        }}
        justifyContent="space-between"
      >
        <Box
          display="flex"
          flex="1"
          marginRight="3"
          position="relative"
          alignItems="center"
        >
          <Box
            width={{ base: '100%', sm: '85%' }}
            zIndex="2"
            marginLeft={{ base: '0', sm: '5%' }}
            marginTop="5%"
          >
            <Link
              href={`/blog/${blog.id}`}
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
            >
              <Image
                borderRadius="lg"
                src={
                  blog.featuredImage ||
                  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80'
                }
                alt={`Featured image for ${blog.title}`}
                objectFit="contain"
              />
            </Link>
          </Box>
          <Box zIndex="1" width="100%" position="absolute" height="100%">
            <Box
              bgGradient={useColorModeValue(
                'radial(orange.600 1px, transparent 1px)',
                'radial(orange.300 1px, transparent 1px)'
              )}
              backgroundSize="20px 20px"
              opacity="0.4"
              height="100%"
            />
          </Box>
        </Box>
        <Box
          display="flex"
          flex="1"
          flexDirection="column"
          justifyContent="center"
          marginTop={{ base: '3', sm: '0' }}
        >
          <BlogTags tags={blog.tags || []} />
          <Heading marginTop="1">
            <Link
              href={`/blog/${blog.id}`}
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
            >
              {blog.title}
            </Link>
          </Heading>
          <Text
            as="p"
            marginTop="2"
            color={useColorModeValue('gray.700', 'gray.200')}
            fontSize="lg"
          >
            {blog.content}
          </Text>
          <BlogAuthor
            name={blog.author.name || 'anonymous'}
            date={new Date(blog.createdAt)}
          />
        </Box>
      </Box>
    </>
  );
};
