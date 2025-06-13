import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { BlogListSkeleton } from './BlogListSkeleton';

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  HStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Skeleton: ({ ...props }: any) => <div data-testid="skeleton" {...props} />,
  SkeletonText: ({ ...props }: any) => (
    <div data-testid="skeleton-text" {...props} />
  ),
  useColorModeValue: (light: string) => light,
}));

describe('BlogListSkeleton', () => {
  it('renders skeleton components for loading state', () => {
    render(<BlogListSkeleton />);

    // Check that skeleton elements are present
    const skeletons = screen.getAllByTestId('skeleton');
    const skeletonTexts = screen.getAllByTestId('skeleton-text');

    expect(skeletons.length).toBeGreaterThan(0);
    expect(skeletonTexts.length).toBeGreaterThan(0);
  });

  it('renders with normal layout direction by default', () => {
    const { container } = render(<BlogListSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with reverse layout direction when specified', () => {
    const { container } = render(
      <BlogListSkeleton layoutDirection="reverse" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
