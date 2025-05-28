import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Blog } from './Blog';
import { trpc } from '@/lib/trpc/client';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: 'test-blog-id' })),
}));

// Mock tRPC
const mockUseQuery = jest.fn();
jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    blogs: {
      getByIdPublic: {
        useQuery: mockUseQuery,
      },
    },
  },
}));

// Mock MarkdownRenderer
jest.mock('@/components/MarkdownRenderer', () => ({
  MarkdownRenderer: ({ content }: { content: string }) => (
    <div data-testid="markdown-content">{content}</div>
  ),
}));

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useColorModeValue: jest.fn(() => 'gray.50'),
}));

describe('Blog', () => {
  const mockBlogData = {
    id: 'test-blog-id',
    title: 'Test Blog Post',
    content: '# This is a test blog\n\nThis is **bold** content.',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    authorId: 'author1',
    featuredImage: 'https://example.com/featured-image.jpg',
    author: {
      id: 'author1',
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://example.com/avatar.jpg',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      accountStatus: 'ENABLED' as const,
      authorizations: ['APP' as const],
      language: 'en',
      callsign: null,
      dmrid: null,
      isPubliclyVisible: true,
      notes: null,
      lastLoginAt: null,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders blog post with all elements when data is loaded', () => {
    mockUseQuery.mockReturnValue({
      data: mockBlogData,
      isLoading: false,
      isError: false,
    });

    render(<Blog />);
    
    // Check if title is displayed
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    
    // Check if featured image is displayed
    const featuredImage = screen.getByAltText('Featured image for Test Blog Post');
    expect(featuredImage).toBeInTheDocument();
    expect(featuredImage).toHaveAttribute('src', 'https://example.com/featured-image.jpg');
    
    // Check if author info is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
    
    // Check if content is rendered via MarkdownRenderer
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
    expect(screen.getByText('# This is a test blog\n\nThis is **bold** content.')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<Blog />);
    expect(screen.getByText('Loading blog post...')).toBeInTheDocument();
  });

  it('shows error state when blog not found', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    render(<Blog />);
    expect(screen.getByText('Blog Not Found')).toBeInTheDocument();
  });

  it('handles blog without featured image', () => {
    const blogWithoutImage = {
      ...mockBlogData,
      featuredImage: null,
    };

    mockUseQuery.mockReturnValue({
      data: blogWithoutImage,
      isLoading: false,
      isError: false,
    });

    render(<Blog />);
    
    // Featured image should not be rendered
    expect(screen.queryByAltText('Featured image for Test Blog Post')).not.toBeInTheDocument();
    
    // Other content should still be there
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});