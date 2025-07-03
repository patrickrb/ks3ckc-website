import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import type { RouterOutputs } from '@/lib/trpc/types';

import { BlogListEntry } from './BlogListEntry';

// Mock avatar utilities
jest.mock('@/lib/avatar', () => ({
  getAvatarUrl: jest.fn(
    (userImage, fallbackSeed) =>
      userImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fallbackSeed || 'default'
      )}&background=e2e8f0&color=4a5568&size=200`
  ),
  getAvatarFallbackName: jest.fn((name, email) => name || email || 'User'),
}));

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  useColorModeValue: jest.fn(() => 'gray.700'),
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  Heading: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  Text: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  Image: ({ alt, ...props }: any) => (
    <div data-testid="image" data-alt={alt} {...props} />
  ),
  HStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Tag: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  Avatar: ({ name, ...props }: any) => (
    <div data-testid="avatar" {...props}>
      {name}
    </div>
  ),
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
    const featuredImage = screen.getByAltText(
      'Featured image for Test Blog Post'
    );
    expect(featuredImage).toBeInTheDocument();
    expect(featuredImage).toHaveAttribute(
      'src',
      'https://example.com/featured-image.jpg'
    );
  });

  it('renders blog post with fallback image when featuredImage is null', () => {
    const blogWithoutImage = {
      ...mockBlog,
      featuredImage: null,
    } as RouterOutputs['blogs']['getAll']['items'][number];

    render(<BlogListEntry blog={blogWithoutImage} />);

    // Check if the fallback image is displayed
    const featuredImage = screen.getByAltText(
      'Featured image for Test Blog Post'
    );
    expect(featuredImage).toBeInTheDocument();
    expect(featuredImage).toHaveAttribute(
      'src',
      expect.stringContaining('unsplash.com')
    );
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
    expect(
      screen.getByText('This is a test blog post content')
    ).toBeInTheDocument();
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

  it('renders author avatar using avatar utilities', () => {
    render(<BlogListEntry blog={mockBlog} />);

    // Check if author avatar is displayed
    const authorAvatar = screen.getByAltText('Avatar of John Doe');
    expect(authorAvatar).toBeInTheDocument();
    expect(authorAvatar).toHaveAttribute(
      'src',
      expect.stringContaining('ui-avatars.com')
    );
  });

  it('handles author with custom image', () => {
    const blogWithCustomAvatar = {
      ...mockBlog,
      author: {
        ...mockBlog.author,
        image: 'data:image/jpeg;base64,customimage',
      },
    } as RouterOutputs['blogs']['getAll']['items'][number];

    render(<BlogListEntry blog={blogWithCustomAvatar} />);

    const authorAvatar = screen.getByAltText('Avatar of John Doe');
    expect(authorAvatar).toBeInTheDocument();
    expect(authorAvatar).toHaveAttribute(
      'src',
      'data:image/jpeg;base64,customimage'
    );
  });

  it('displays full content when content is short', () => {
    const shortContentBlog = {
      ...mockBlog,
      content: 'This is a short blog post.',
    } as RouterOutputs['blogs']['getAll']['items'][number];

    render(<BlogListEntry blog={shortContentBlog} />);

    expect(screen.getByText('This is a short blog post.')).toBeInTheDocument();
    expect(screen.queryByText('read more')).not.toBeInTheDocument();
  });

  it('truncates long content and shows read more link', () => {
    const longContentBlog = {
      ...mockBlog,
      content:
        'This is a very long blog post content that should be truncated because it exceeds the maximum character limit for the blog list preview and should show a read more link.',
    } as RouterOutputs['blogs']['getAll']['items'][number];

    render(<BlogListEntry blog={longContentBlog} />);

    // Should show truncated content with ellipses
    expect(
      screen.getByText(
        /This is a very long blog post content that should be truncated/
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();

    // Should have read more link
    const readMoreLink = screen.getByText('read more');
    expect(readMoreLink).toBeInTheDocument();
    expect(readMoreLink.closest('a')).toHaveAttribute('href', '/blog/1');
  });

  it('truncates content at paragraph break when available', () => {
    const multiParagraphBlog = {
      ...mockBlog,
      content:
        'First paragraph content.\n\nSecond paragraph that should not be shown in the preview.',
    } as RouterOutputs['blogs']['getAll']['items'][number];

    render(<BlogListEntry blog={multiParagraphBlog} />);

    expect(screen.getByText(/First paragraph content\./)).toBeInTheDocument();
    expect(screen.queryByText(/Second paragraph/)).not.toBeInTheDocument();
    expect(screen.getByText('read more')).toBeInTheDocument();
  });
});
