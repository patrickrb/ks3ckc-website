import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useBreakpointValue } from '@chakra-ui/react';
import { useIsHydrated } from '@/hooks/useIsHydrated';
import { Nav, NavItem, NavGroup } from './index';

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Button: ({ children, rightIcon, textAlign, _sx, opacity, ...props }: any) => (
    <button 
      data-testid="nav-menu-button"
      data-text-align={textAlign}
      data-opacity={opacity}
      {...props}
    >
      {children}
      {rightIcon && <span data-testid="nav-menu-icon">{rightIcon}</span>}
    </button>
  ),
  Flex: ({ children, direction, align, fontSize, fontWeight, px, pt, pb, color, minW, as, noOfLines, ...props }: any) => (
    <div 
      data-testid="nav-flex"
      data-direction={direction}
      data-align={align}
      data-font-size={fontSize}
      data-font-weight={fontWeight}
      data-px={px}
      data-pt={pt}
      data-pb={pb}
      data-color={color}
      data-min-w={minW}
      data-as={as}
      data-no-of-lines={noOfLines}
      {...props}
    >
      {children}
    </div>
  ),
  Menu: ({ children, matchWidth, ...props }: any) => (
    <div data-testid="nav-menu" data-match-width={matchWidth} {...props}>
      {children}
    </div>
  ),
  MenuButton: ({ children, opacity, textAlign, rightIcon, _sx, ...props }: any) => (
    <button 
      data-testid="nav-menu-button"
      data-opacity={opacity}
      data-text-align={textAlign}
      {...props}
    >
      {children}
      {rightIcon}
    </button>
  ),
  MenuItem: ({ children, px, py, borderRadius, transition, fontSize, fontWeight, bg, border, boxShadow, color, borderColor, borderLeft, borderRight, _dark, _hover, ...props }: any) => (
    <div 
      data-testid="nav-menu-item"
      data-px={px}
      data-py={py}
      data-border-radius={borderRadius}
      data-transition={transition}
      data-font-size={fontSize}
      data-font-weight={fontWeight}
      data-bg={bg}
      data-border={border}
      data-box-shadow={boxShadow}
      data-color={color}
      data-border-color={borderColor}
      data-border-left={borderLeft}
      data-border-right={borderRight}
      {...props}
    >
      {children}
    </div>
  ),
  MenuList: ({ children, ...props }: any) => (
    <div data-testid="nav-menu-list" {...props}>
      {children}
    </div>
  ),
  MenuGroup: ({ children, title, ...props }: any) => (
    <div data-testid="nav-menu-group" data-title={title} {...props}>
      {children}
    </div>
  ),
  Portal: ({ children }: any) => (
    <div data-testid="nav-portal">
      {children}
    </div>
  ),
  Stack: ({ children, spacing, opacity, ...props }: any) => (
    <div 
      data-testid="nav-stack" 
      data-spacing={spacing}
      data-opacity={opacity}
      {...props}
    >
      {children}
    </div>
  ),
  Text: ({ children, as, noOfLines, ...props }: any) => (
    <span 
      data-testid="nav-text"
      data-as={as}
      data-no-of-lines={noOfLines}
      {...props}
    >
      {children}
    </span>
  ),
  useBreakpointValue: jest.fn(() => false), // Default to desktop view
}));

// Mock Icons component
jest.mock('@/components/Icons', () => ({
  Icon: ({ icon, mt, me, fontSize, color, _dark, ...props }: any) => (
    <span 
      data-testid="nav-icon"
      data-mt={mt}
      data-me={me}
      data-font-size={fontSize}
      data-color={color}
      {...props}
    >
      {icon?.name || 'icon'}
    </span>
  ),
}));

// Mock useIsHydrated hook
jest.mock('@/hooks/useIsHydrated', () => ({
  useIsHydrated: jest.fn(() => true),
}));

// Mock react-icons
jest.mock('react-icons/lu', () => ({
  LuChevronDown: () => <span data-testid="chevron-down">↓</span>,
}));

describe('Nav', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useBreakpointValue as jest.Mock).mockReturnValue(false); // Desktop view
    (useIsHydrated as jest.Mock).mockReturnValue(true);
  });

  it('renders nav component in desktop mode', () => {
    render(
      <Nav>
        <NavItem>Home</NavItem>
        <NavItem>About</NavItem>
      </Nav>
    );
    
    expect(screen.getByTestId('nav-menu')).toBeInTheDocument();
    expect(screen.getByTestId('nav-stack')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-menu-button')).not.toBeInTheDocument();
  });

  it('renders nav component in mobile mode', () => {
    (useBreakpointValue as jest.Mock).mockReturnValue(true); // Mobile view
    
    render(
      <Nav>
        <NavItem>Home</NavItem>
        <NavItem>About</NavItem>
      </Nav>
    );
    
    expect(screen.getByTestId('nav-menu')).toBeInTheDocument();
    expect(screen.getByTestId('nav-menu-button')).toBeInTheDocument();
    expect(screen.getByTestId('nav-portal')).toBeInTheDocument();
    expect(screen.getByTestId('nav-menu-list')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-stack')).not.toBeInTheDocument();
  });

  it('handles custom breakpoint', () => {
    render(
      <Nav breakpoint="md">
        <NavItem>Home</NavItem>
      </Nav>
    );
    
    expect(useBreakpointValue).toHaveBeenCalledWith({
      base: true,
      md: false,
    });
  });

  it('defaults to lg breakpoint', () => {
    render(
      <Nav>
        <NavItem>Home</NavItem>
      </Nav>
    );
    
    expect(useBreakpointValue).toHaveBeenCalledWith({
      base: true,
      lg: false,
    });
  });

  it('shows chevron down icon in mobile mode', () => {
    (useBreakpointValue as jest.Mock).mockReturnValue(true); // Mobile view
    
    render(
      <Nav>
        <NavItem>Home</NavItem>
      </Nav>
    );
    
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  it('handles hydration state', () => {
    (useIsHydrated as jest.Mock).mockReturnValue(false);
    
    render(
      <Nav>
        <NavItem>Home</NavItem>
      </Nav>
    );
    
    const stack = screen.getByTestId('nav-stack');
    expect(stack).toHaveAttribute('data-opacity', '0');
  });

  it('passes through additional props', () => {
    render(
      <Nav data-custom="value">
        <NavItem>Home</NavItem>
      </Nav>
    );
    
    const menu = screen.getByTestId('nav-menu');
    expect(menu).toHaveAttribute('data-custom', 'value');
  });
});

describe('NavItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useBreakpointValue as jest.Mock).mockReturnValue(false); // Desktop view
  });

  it('renders nav item in desktop mode', () => {
    render(
      <Nav>
        <NavItem>Home</NavItem>
      </Nav>
    );
    
    expect(screen.getByTestId('nav-flex')).toBeInTheDocument();
    expect(screen.getByTestId('nav-text')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders nav item in mobile mode', () => {
    (useBreakpointValue as jest.Mock).mockReturnValue(true); // Mobile view
    
    render(
      <Nav>
        <NavItem>Home</NavItem>
      </Nav>
    );
    
    expect(screen.getByTestId('nav-menu-item')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders nav item with icon', () => {
    const MockIcon = () => <span>🏠</span>;
    
    render(
      <Nav>
        <NavItem icon={MockIcon}>Home</NavItem>
      </Nav>
    );
    
    expect(screen.getByTestId('nav-icon')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('applies active styles in desktop mode', () => {
    render(
      <Nav>
        <NavItem isActive>Home</NavItem>
      </Nav>
    );
    
    const flex = screen.getByTestId('nav-flex');
    expect(flex).toHaveAttribute('data-bg', 'white');
    expect(flex).toHaveAttribute('data-color', 'gray.700');
    expect(flex).toHaveAttribute('data-box-shadow', 'card');
  });

  it('applies inactive styles in desktop mode', () => {
    render(
      <Nav>
        <NavItem>Home</NavItem>
      </Nav>
    );
    
    const flex = screen.getByTestId('nav-flex');
    expect(flex).toHaveAttribute('data-bg', 'transparent');
    expect(flex).toHaveAttribute('data-color', 'gray.600');
  });

  it('configures text display correctly', () => {
    render(
      <Nav>
        <NavItem>Long Navigation Item Text</NavItem>
      </Nav>
    );
    
    const text = screen.getByTestId('nav-text');
    expect(text).toHaveAttribute('data-as', 'span');
    expect(text).toHaveAttribute('data-no-of-lines', '2'); // Desktop mode
  });

  it('configures text display for mobile', () => {
    (useBreakpointValue as jest.Mock).mockReturnValue(true); // Mobile view
    
    render(
      <Nav>
        <NavItem>Long Navigation Item Text</NavItem>
      </Nav>
    );
    
    const text = screen.getByTestId('nav-text');
    expect(text).toHaveAttribute('data-no-of-lines', '1'); // Mobile mode
  });

  it('passes through additional props', () => {
    render(
      <Nav>
        <NavItem data-custom="value" className="custom-item">
          Home
        </NavItem>
      </Nav>
    );
    
    const flex = screen.getByTestId('nav-flex');
    expect(flex).toHaveAttribute('data-custom', 'value');
    expect(flex).toHaveClass('custom-item');
  });

  it('handles border radius in mobile mode', () => {
    (useBreakpointValue as jest.Mock).mockReturnValue(true); // Mobile view
    
    render(
      <Nav>
        <NavItem>Home</NavItem>
      </Nav>
    );
    
    const menuItem = screen.getByTestId('nav-menu-item');
    expect(menuItem).toHaveAttribute('data-border-radius', ''); // undefined
  });

  it('handles border radius in desktop mode', () => {
    render(
      <Nav>
        <NavItem>Home</NavItem>
      </Nav>
    );
    
    const flex = screen.getByTestId('nav-flex');
    expect(flex).toHaveAttribute('data-border-radius', 'md');
  });
});

describe('NavGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useBreakpointValue as jest.Mock).mockReturnValue(false); // Desktop view
  });

  it('renders nav group in desktop mode', () => {
    render(
      <Nav>
        <NavGroup title="Main Navigation">
          <NavItem>Home</NavItem>
          <NavItem>About</NavItem>
        </NavGroup>
      </Nav>
    );
    
    expect(screen.getByTestId('nav-flex')).toBeInTheDocument();
    expect(screen.getByText('Main Navigation')).toBeInTheDocument();
    expect(screen.getByTestId('nav-stack')).toBeInTheDocument();
  });

  it('renders nav group in mobile mode', () => {
    (useBreakpointValue as jest.Mock).mockReturnValue(true); // Mobile view
    
    render(
      <Nav>
        <NavGroup title="Main Navigation">
          <NavItem>Home</NavItem>
          <NavItem>About</NavItem>
        </NavGroup>
      </Nav>
    );
    
    expect(screen.getByTestId('nav-menu-group')).toBeInTheDocument();
    expect(screen.getByTestId('nav-menu-group')).toHaveAttribute('data-title', 'Main Navigation');
  });

  it('renders group title with correct styling in desktop mode', () => {
    render(
      <Nav>
        <NavGroup title="Main Navigation">
          <NavItem>Home</NavItem>
        </NavGroup>
      </Nav>
    );
    
    // In desktop mode, title is rendered in a Flex container
    const titleContainer = screen.getAllByTestId('nav-flex')[1]; // Second flex is the title
    expect(titleContainer).toHaveAttribute('data-font-size', 'xs');
    expect(titleContainer).toHaveAttribute('data-font-weight', 'bold');
    expect(titleContainer).toHaveAttribute('data-px', '3');
    expect(titleContainer).toHaveAttribute('data-pt', '6');
    expect(titleContainer).toHaveAttribute('data-pb', '2');
    expect(titleContainer).toHaveAttribute('data-color', 'text-dimmed');
  });

  it('renders children correctly', () => {
    render(
      <Nav>
        <NavGroup title="Navigation">
          <NavItem>Home</NavItem>
          <NavItem>About</NavItem>
        </NavGroup>
      </Nav>
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('passes through additional props in desktop mode', () => {
    render(
      <Nav>
        <NavGroup title="Navigation" data-custom="value">
          <NavItem>Home</NavItem>
        </NavGroup>
      </Nav>
    );
    
    // Additional props should be passed to the title Flex
    const titleContainer = screen.getAllByTestId('nav-flex')[1];
    expect(titleContainer).toHaveAttribute('data-custom', 'value');
  });

  it('passes through additional props in mobile mode', () => {
    (useBreakpointValue as jest.Mock).mockReturnValue(true); // Mobile view
    
    render(
      <Nav>
        <NavGroup title="Navigation" data-custom="value">
          <NavItem>Home</NavItem>
        </NavGroup>
      </Nav>
    );
    
    const menuGroup = screen.getByTestId('nav-menu-group');
    expect(menuGroup).toHaveAttribute('data-custom', 'value');
  });
});

describe('Nav Integration', () => {
  it('renders complex navigation structure', () => {
    render(
      <Nav>
        <NavGroup title="Main">
          <NavItem isActive>Dashboard</NavItem>
          <NavItem>Projects</NavItem>
        </NavGroup>
        <NavGroup title="Settings">
          <NavItem>Profile</NavItem>
          <NavItem>Preferences</NavItem>
        </NavGroup>
      </Nav>
    );
    
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
  });

  it('switches between desktop and mobile layouts', () => {
    const { rerender } = render(
      <Nav>
        <NavItem>Home</NavItem>
      </Nav>
    );
    
    // Desktop mode
    expect(screen.getByTestId('nav-stack')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-menu-button')).not.toBeInTheDocument();
    
    // Switch to mobile mode
    (useBreakpointValue as jest.Mock).mockReturnValue(true);
    
    rerender(
      <Nav>
        <NavItem>Home</NavItem>
      </Nav>
    );
    
    expect(screen.queryByTestId('nav-stack')).not.toBeInTheDocument();
    expect(screen.getByTestId('nav-menu-button')).toBeInTheDocument();
  });
});