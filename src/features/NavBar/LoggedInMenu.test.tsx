import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { LoggedInMenu } from './LoggedInMenu';

// Mock the useAuth hook
const mockAccount = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...',
  authorizations: ['APP'],
};

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    account: mockAccount,
  }),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Stack: ({ children, ...props }: any) => (
    <div data-testid="stack" {...props}>
      {children}
    </div>
  ),
  HStack: ({ children, ...props }: any) => (
    <div data-testid="hstack" {...props}>
      {children}
    </div>
  ),
  Menu: ({ children, ...props }: any) => (
    <div data-testid="menu" {...props}>
      {children}
    </div>
  ),
  MenuButton: ({ children, ...props }: any) => (
    <button data-testid="menu-button" {...props}>
      {children}
    </button>
  ),
  MenuList: ({ children, ...props }: any) => (
    <div data-testid="menu-list" {...props}>
      {children}
    </div>
  ),
  MenuGroup: ({ children, ...props }: any) => (
    <div data-testid="menu-group" {...props}>
      {children}
    </div>
  ),
  MenuItem: ({ children, ...props }: any) => (
    <div data-testid="menu-item" {...props}>
      {children}
    </div>
  ),
  MenuDivider: (props: any) => <hr data-testid="menu-divider" {...props} />,
  Button: ({ children, ...props }: any) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
  Avatar: ({ src, name, ...props }: any) => (
    <div data-testid="avatar" data-src={src} data-alt={name} {...props} />
  ),
  useColorModeValue: jest.fn((light) => light),
}));

// Mock avatar utilities
jest.mock('@/lib/avatar', () => ({
  getAvatarUrl: jest.fn(
    (image, fallback) =>
      image ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fallback || 'default'
      )}`
  ),
  getAvatarFallbackName: jest.fn((name, email) => name || email || 'User'),
}));

describe('LoggedInMenu', () => {
  it('renders profile menu with avatar', () => {
    render(<LoggedInMenu direction="row" />);

    // Check that avatar is rendered
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockAccount.image);
  });

  it('renders menu items correctly', () => {
    render(<LoggedInMenu direction="row" />);

    // Check menu items are present
    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
