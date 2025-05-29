import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BlogListEntry } from './BlogListEntry';
import type { RouterOutputs } from '@/lib/trpc/types';

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useColorModeValue: jest.fn(() => 'gray.700'),
}));

describe('BlogListEntry', () => {
  const mockBlog = {
    id: '1',
    title: 'Test Blog Post',
    content: 'This is a test blog post content',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    authorId: 'author1',
    featuredImage: 'https://example.com/featured-image.jpg',
    tags: ['Engineering', 'Product'],
    author: {
      id: 'author1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      accountStatus: 'ENABLED' as const,
      image: null,
      authorizations: ['APP' as const],
      language: 'en',
      callsign: null,
      dmrid: null,
      isPubliclyVisible: true,
      notes: null,
      lastLoginAt: null,
    },
  } as RouterOutputs['blogs']['getAll']['items'][number];

  it('renders blog post with featured image when provided', () => {
    render(<BlogListEntry blog={mockBlog} />);
    
    // Check if the featured image is displayed
    const featuredImage = screen.getByAltText('Featured image for Test Blog Post');
    expect(featuredImage).toBeInTheDocument();
    expect(featuredImage).toHaveAttribute('src', 'https://example.com/featured-image.jpg');
  });

  it('renders blog post with fallback image when featuredImage is null', () => {
    const blogWithoutImage = {
      ...mockBlog,
      featuredImage: null,
    } as RouterOutputs['blogs']['getAll']['items'][number];
    
    render(<BlogListEntry blog={blogWithoutImage} />);
    
    // Check if the fallback image is displayed
    const featuredImage = screen.getByAltText('Featured image for Test Blog Post');
    expect(featuredImage).toBeInTheDocument();
    expect(featuredImage).toHaveAttribute('src', expect.stringContaining('unsplash.com'));
  });

  it('renders author name and date', () => {
    render(<BlogListEntry blog={mockBlog} />);
    
    // Check if author name is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check if date is displayed (formatted as locale date string)
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();
  });

  it('renders blog title and content', () => {
    render(<BlogListEntry blog={mockBlog} />);
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test blog post content')).toBeInTheDocument();
  });

  it('renders tags when they exist', () => {
    render(<BlogListEntry blog={mockBlog} />);
    
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Product')).toBeInTheDocument();
  });

  it('does not render tags section when no tags exist', () => {
    const blogWithoutTags = {
      ...mockBlog,
      tags: [],
    } as RouterOutputs['blogs']['getAll']['items'][number];
    
    render(<BlogListEntry blog={blogWithoutTags} />);
    
    expect(screen.queryByText('Engineering')).not.toBeInTheDocument();
    expect(screen.queryByText('Product')).not.toBeInTheDocument();
  });
});