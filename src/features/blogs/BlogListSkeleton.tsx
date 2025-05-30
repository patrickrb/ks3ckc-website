import React from 'react';

import {
  Box,
  HStack,
  Skeleton,
  SkeletonText,
  useColorModeValue,
} from '@chakra-ui/react';

interface BlogListSkeletonProps {
  layoutDirection?: 'normal' | 'reverse';
}

export const BlogListSkeleton: React.FC<BlogListSkeletonProps> = ({
  layoutDirection = 'normal',
}) => {
  return (
    <Box
      marginTop={{ base: '1', sm: '5' }}
      display="flex"
      flexDirection={{
        base: 'column',
        sm: layoutDirection === 'normal' ? 'row' : 'row-reverse',
      }}
      justifyContent="space-between"
    >
      {/* Image skeleton */}
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
          <Skeleton
            borderRadius="lg"
            height={{ base: '200px', sm: '250px' }}
            width="100%"
          />
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

      {/* Content skeleton */}
      <Box
        display="flex"
        flex="1"
        flexDirection="column"
        justifyContent="center"
        marginTop={{ base: '3', sm: '0' }}
      >
        {/* Tags skeleton */}
        <HStack spacing={2} marginTop="2">
          <Skeleton height="6" width="16" borderRadius="md" />
          <Skeleton height="6" width="20" borderRadius="md" />
        </HStack>

        {/* Title skeleton */}
        <SkeletonText
          marginTop="1"
          noOfLines={2}
          spacing="2"
          skeletonHeight="6"
        />

        {/* Content skeleton */}
        <SkeletonText
          marginTop="2"
          noOfLines={3}
          spacing="2"
          skeletonHeight="4"
        />

        {/* Author skeleton */}
        <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
          <Skeleton borderRadius="full" boxSize="40px" />
          <Skeleton height="4" width="24" />
          <Skeleton height="4" width="2" />
          <Skeleton height="4" width="20" />
        </HStack>
      </Box>
    </Box>
  );
};