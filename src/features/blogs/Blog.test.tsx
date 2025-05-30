import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Blog } from './Blog';
import type { RouterOutputs } from '@/lib/trpc/types';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: 'test-blog-id' })),
}));

// Mock tRPC
jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    blogs: {
      getByIdPublic: {
        useQuery: jest.fn(),
      },
    },
  },
}));

// Get the mocked function for use in tests
const mockUseQuery = jest.fn();

// Mock MarkdownRenderer
jest.mock('@/components/MarkdownRenderer', () => ({
  MarkdownRenderer: ({ content }: { content: string }) => (
    <div data-testid="markdown-content">{content}</div>
  ),
}));

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  useColorModeValue: jest.fn(() => 'gray.50'),
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Heading: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  Text: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  VStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  HStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Image: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('Blog', () => {
  const mockBlogData: RouterOutputs['blogs']['getByIdPublic'] = {
    id: 'test-blog-id',
    title: 'Test Blog Post',
    content: '# This is a test blog\n\nThis is **bold** content.',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    authorId: 'author1',
    featuredImage: 'https://example.com/featured-image.jpg',
    tags: ['JavaScript', 'React'],
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
    // Set up the mock for each test
    const { trpc } = jest.requireMock('@/lib/trpc/client');
    trpc.blogs.getByIdPublic.useQuery.mockImplementation(mockUseQuery);
  });

  it('renders blog post with all elements when data is loaded', () => {
    mockUseQuery.mockReturnValue({
      data: mockBlogData,
      isLoading: false,
      isError: false,
    } as any);

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
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('# This is a test blog This is **bold** content.');
  });

  it('shows loading state', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    } as any);

    render(<Blog />);
    expect(screen.getByText('Loading blog post...')).toBeInTheDocument();
  });

  it('shows error state when blog not found', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    } as any);

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
    } as any);

    render(<Blog />);
    
    // Featured image should not be rendered
    expect(screen.queryByAltText('Featured image for Test Blog Post')).not.toBeInTheDocument();
    
    // Other content should still be there
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});