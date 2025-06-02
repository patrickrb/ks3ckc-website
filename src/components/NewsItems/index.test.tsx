import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewsItems from './index';

// Mock the tRPC hook
jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    news: {
      getAll: {
        useQuery: jest.fn(),
      },
    },
  },
}));

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }: any) => (
    <div data-testid="news-item" {...props}>{children}</div>
  ),
  Heading: ({ children, as, size, ...props }: any) => (
    React.createElement(as || 'h1', { 
      'data-testid': `heading-${size}`,
      ...props
    }, children)
  ),
  Text: ({ children, ...props }: any) => (
    <p data-testid="text" {...props}>{children}</p>
  ),
  SimpleGrid: ({ children, ...props }: any) => (
    <div data-testid="news-grid" {...props}>{children}</div>
  ),
  useColorModeValue: jest.fn((light, _dark) => light),
}));

import { trpc } from '@/lib/trpc/client';

const mockTrpc = trpc as jest.Mocked<typeof trpc>;

const mockNewsData = {
  items: [
    {
      id: '1',
      title: 'Test News 1',
      content: 'Test content 1',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
      author: {
        id: '1',
        name: 'Test Author',
        email: 'test@example.com',
      },
      authorId: '1',
    },
    {
      id: '2',
      title: 'Test News 2',
      content: 'Test content 2',
      createdAt: new Date('2024-03-02'),
      updatedAt: new Date('2024-03-02'),
      author: {
        id: '1',
        name: 'Test Author',
        email: 'test@example.com',
      },
      authorId: '1',
    },
  ],
};

describe('NewsItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Latest News heading', () => {
    mockTrpc.news.getAll.useQuery.mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      error: null,
    } as any);

    render(<NewsItems />);
    
    const heading = screen.getByTestId('heading-lg');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Latest News');
  });

  it('renders news items in a grid layout', () => {
    mockTrpc.news.getAll.useQuery.mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      error: null,
    } as any);

    render(<NewsItems />);
    
    expect(screen.getByTestId('news-grid')).toBeInTheDocument();
  });

  it('renders news items from database', () => {
    mockTrpc.news.getAll.useQuery.mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      error: null,
    } as any);

    render(<NewsItems />);
    
    const newsItems = screen.getAllByTestId('news-item');
    expect(newsItems.length).toBe(2);
    
    // Check that news titles are rendered
    expect(screen.getByText('Test News 1')).toBeInTheDocument();
    expect(screen.getByText('Test News 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockTrpc.news.getAll.useQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    render(<NewsItems />);
    
    // Should show loading skeleton
    const newsItems = screen.getAllByTestId('news-item');
    expect(newsItems.length).toBe(8); // 8 skeleton items
  });

  it('shows error state', () => {
    mockTrpc.news.getAll.useQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    } as any);

    render(<NewsItems />);
    
    expect(screen.getByText('Error loading news. Please try again later.')).toBeInTheDocument();
  });

  it('handles empty news data', () => {
    mockTrpc.news.getAll.useQuery.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      error: null,
    } as any);

    render(<NewsItems />);
    
    // Should show heading but no news items
    expect(screen.getByTestId('heading-lg')).toBeInTheDocument();
    expect(screen.queryByTestId('news-item')).not.toBeInTheDocument();
  });
});