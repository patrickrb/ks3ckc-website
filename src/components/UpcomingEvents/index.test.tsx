import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpcomingEvents from './index';

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }: any) => <div data-testid="box" {...props}>{children}</div>,
  Heading: ({ children, ...props }: any) => <h1 data-testid="heading" {...props}>{children}</h1>,
  Link: ({ children, href, isExternal, ...props }: any) => (
    <a data-testid="link" href={href} target={isExternal ? "_blank" : undefined} {...props}>
      {children}
    </a>
  ),
  Text: ({ children, ...props }: any) => <p data-testid="text" {...props}>{children}</p>,
  useColorModeValue: (light: any, dark: any) => light,
}));

describe('UpcomingEvents', () => {
  it('renders without crashing', () => {
    expect(() => {
      render(<UpcomingEvents />);
    }).not.toThrow();
  });

  it('displays upcoming events section', () => {
    render(<UpcomingEvents />);
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
  });

  it('renders Google Maps iframes for events with locations', () => {
    render(<UpcomingEvents />);
    
    // Look for iframe elements
    const iframes = document.querySelectorAll('iframe');
    expect(iframes.length).toBeGreaterThan(0);
    
    // Check that at least one iframe has a Google Maps embed URL
    const googleMapsIframes = Array.from(iframes).filter(iframe => 
      iframe.src.includes('www.google.com/maps/embed')
    );
    expect(googleMapsIframes.length).toBeGreaterThan(0);
  });

  it('includes proper iframe attributes for accessibility and security', () => {
    render(<UpcomingEvents />);
    
    const iframes = document.querySelectorAll('iframe');
    const googleMapsIframes = Array.from(iframes).filter(iframe => 
      iframe.src.includes('www.google.com/maps/embed')
    );
    
    // Check each Google Maps iframe has proper attributes
    googleMapsIframes.forEach(iframe => {
      expect(iframe).toHaveAttribute('allowfullscreen');
      expect(iframe).toHaveAttribute('loading', 'lazy');
      expect(iframe).toHaveAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      expect(iframe.style.border).toBe('0px');
    });
  });

  it('displays event details with proper structure', () => {
    render(<UpcomingEvents />);
    
    // Check for event names
    expect(screen.getByText('Monthly Meetup')).toBeInTheDocument();
    expect(screen.getByText('ARRL Field Day 2025')).toBeInTheDocument();
    
    // Check for location information
    expect(screen.getByText('Knuckleheads Garage')).toBeInTheDocument();
    expect(screen.getByText('701 N Montgall Ave, Kansas City, MO 64120')).toBeInTheDocument();
  });
});