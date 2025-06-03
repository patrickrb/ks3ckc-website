import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import UpcomingEvents from './index';

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }: any) => {
    const { borderRadius, ...otherProps } = props;
    return (
      <div data-testid="box" {...otherProps}>
        {children}
      </div>
    );
  },
  Heading: ({ children, ...props }: any) => (
    <h1 data-testid="heading" {...props}>
      {children}
    </h1>
  ),
  Link: ({ children, href, isExternal, ...props }: any) => (
    <a
      data-testid="link"
      href={href}
      target={isExternal ? '_blank' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  Text: ({ children, ...props }: any) => (
    <p data-testid="text" {...props}>
      {children}
    </p>
  ),
  useColorModeValue: (light: any, dark: any) => light,
}));

// Mock tRPC
jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    events: {
      getUpcoming: {
        useQuery: () => ({
          data: [
            {
              id: '1',
              name: 'Monthly Meetup',
              date: new Date('2025-06-10'),
              startTime: '7:00 PM',
              endTime: '9:00 PM',
              location: 'Knuckleheads Garage',
              address: '701 N Montgall Ave, Kansas City, MO 64120',
              mapUrl: 'https://maps.app.goo.gl/example',
              embedMapUrl:
                'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3049.123456789!2d-94.12345678!3d39.12345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKnuckleheads%20Garage!5e0!3m2!1sen!2sus!4v1234567890123',
              description: 'Monthly amateur radio meetup',
              isActive: true,
            },
            {
              id: '2',
              name: 'ARRL Field Day 2025',
              date: new Date('2025-06-28'),
              startTime: '2:00 PM',
              endTime: '2:00 PM',
              location: 'Knuckleheads Garage',
              address: '701 N Montgall Ave, Kansas City, MO 64120',
              mapUrl: 'https://maps.app.goo.gl/example2',
              embedMapUrl:
                'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3049.123456789!2d-94.12345678!3d39.12345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKnuckleheads%20Garage!5e0!3m2!1sen!2sus!4v1234567890124',
              description: 'Annual ARRL Field Day event',
              isActive: true,
            },
          ],
          isLoading: false,
          isError: false,
        }),
      },
      getPast: {
        useQuery: () => ({
          data: [],
          isLoading: false,
          isError: false,
        }),
      },
    },
  },
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

  it('displays events from the database', () => {
    render(<UpcomingEvents />);
    expect(screen.getByText('Monthly Meetup')).toBeInTheDocument();
    expect(screen.getAllByText('Knuckleheads Garage')).toHaveLength(2);
  });

  it('renders Google Maps iframes for events with locations', () => {
    render(<UpcomingEvents />);

    // Look for iframe elements
    const iframes = document.querySelectorAll('iframe');
    expect(iframes.length).toBeGreaterThan(0);

    // Check that at least one iframe has a Google Maps embed URL
    const googleMapsIframes = Array.from(iframes).filter((iframe) =>
      iframe.src.includes('www.google.com/maps/embed')
    );
    expect(googleMapsIframes.length).toBeGreaterThan(0);
  });

  it('includes proper iframe attributes for accessibility and security', () => {
    render(<UpcomingEvents />);

    const iframes = document.querySelectorAll('iframe');
    const googleMapsIframes = Array.from(iframes).filter((iframe) =>
      iframe.src.includes('www.google.com/maps/embed')
    );

    // Check each Google Maps iframe has proper attributes
    googleMapsIframes.forEach((iframe) => {
      expect(iframe).toHaveAttribute('allowfullscreen');
      expect(iframe).toHaveAttribute('loading', 'lazy');
      expect(iframe).toHaveAttribute(
        'referrerpolicy',
        'no-referrer-when-downgrade'
      );
      expect(iframe.style.border).toBe('0px');
    });
  });

  it('displays event details with proper structure', () => {
    render(<UpcomingEvents />);

    // Check for event names
    expect(screen.getByText('Monthly Meetup')).toBeInTheDocument();
    expect(screen.getByText('ARRL Field Day 2025')).toBeInTheDocument();

    // Check for location information
    expect(screen.getAllByText('Knuckleheads Garage')).toHaveLength(2);
    expect(
      screen.getAllByText('701 N Montgall Ave, Kansas City, MO 64120')
    ).toHaveLength(2);
  });
});
