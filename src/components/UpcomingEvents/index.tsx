import { Box, Heading, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { date } from 'zod';

export default function RecentContacts() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const mutedText = useColorModeValue('gray.500', 'gray.400');

  // Current date (for comparison)
  const today = new Date();

  // All events (with dates in a parseable format)
  const upcomingEvents = [
    {
      id: 5,
      name: 'Monthly Meetup',
      date: 'June 10, 2025',
      details: (
        <>
          <Text fontSize="md" mb={1}>
            5:00 PM - 9:00 PM
          </Text>
          <Text fontSize="md" fontWeight="bold" mb={1}>
            Knuckleheads Garage
          </Text>
          <Link href="https://maps.app.goo.gl/Z9yboWxsEh63QzuDA" isExternal>
            701 N Montgall Ave, Kansas City, MO 64120
          </Link>
          <Box mt={3} mb={3} borderRadius="md" overflow="hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3095.376287263093!2d-94.55174202405244!3d39.12066797167728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0fa6efbb5e74b%3A0xc88eb26af129a68b!2s701%20N%20Montgall%20Ave%2C%20Kansas%20City%2C%20MO%2064120!5e0!3m2!1sen!2sus!4v1747367871060!5m2!1sen!2sus"
              width="200"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        </>
      ),
    },
    {
      id: 4,
      name: 'ARRL Field Day 2025',
      date: 'June 27, 2025',
      details: (
        <>
          <Text fontSize="md" mb={1}>
            Check in time: 3:00 PM
          </Text>
          <Text fontSize="md" mb={1}>
            GTFO Time: 12:00 PM June 29, 2025
          </Text>
          <Text fontSize="md" fontWeight="bold" mb={1}>
            Where is it?
          </Text>
          <Text fontSize="md" mb={1}>
            <Link href="https://maps.app.goo.gl/MTJgqTcw69tigJkE6" isExternal>
              Clinton State Park | Elk Creek Cabin
            </Link>
            {/* Embedded Map */}
            <Box mt={3} mb={3} borderRadius="md" overflow="hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3103.748792336924!2d-95.36182731749331!3d38.92971887188787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87bf6b908a5cd5d1%3A0x628e97bd646e3552!2sElk%20Creek%20Cabin!5e0!3m2!1sen!2sus!4v1747367052821!5m2!1sen!2sus"
                width="200"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Text>
          <Text fontSize="md" mb={1}>
            Questions? Find us on{' '}
            <Link href="https://discord.gg/seckc" isExternal>
              Discord
            </Link>{' '}
            and ask away!
          </Text>
        </>
      ),
    },
    {
      id: 3,
      name: 'Local Meetup',
      date: 'May 15, 2025',
      details: (
        <>
          <Text fontSize="sm" mb={1}>
            5:00 PM - 9:00 PM
          </Text>
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            Tall Trellis Brew Co.
          </Text>
          <Link
            href="https://www.google.com/maps/place/Tall+Trellis+Brew+Co./@38.9450675,-94.8871786,17z/data=!3m1!4b1!4m6!3m5!1s0x87c09778274906e5:0x8534144f0ecc2ff9!8m2!3d38.9450634!4d-94.8845983!16s%2Fg%2F11stzc5h4p"
            isExternal
          >
            25600 West Valley Parkway, Olathe, KS 66061 United States
          </Link>
        </>
      ),
    },
    { id: 2, name: 'Summer Field Day', date: 'June 15, 2024' },
    { id: 1, name: 'DX Contest', date: 'April 30, 2024' },
  ];

  // Filter events
  const futureEvents = upcomingEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= today;
  });

  const pastEvents = upcomingEvents
    .filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate < today;
    })
    .reverse(); // Show most recent past events first

  return (
    <>
      {/* Upcoming Events Section */}
      <Heading as="h2" size="lg" ms={2} mb={4}>
        Upcoming Events
      </Heading>
      {futureEvents.length > 0 ? (
        futureEvents.map((event) => (
          <Box key={event.id} bg={cardBg} p={4} borderRadius="md" mb={4}>
            <Heading as="h3" size="md" mb={2}>
              {event.name}
            </Heading>
            <Text fontSize="sm" color="gray.400" mb={2}>
              {event.date}
            </Text>
            {event.details}
          </Box>
        ))
      ) : (
        <Text>No upcoming events.</Text>
      )}

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <>
          <Heading as="h2" size="lg" ms={2} mb={4} mt={8}>
            Past Events
          </Heading>
          {pastEvents.map((event) => (
            <Box
              key={event.id}
              bg={cardBg}
              p={4}
              borderRadius="md"
              mb={4}
              opacity={0.9}
            >
              <Heading as="h3" size="md" mb={2} color={mutedText}>
                {event.name}
              </Heading>
              <Text fontSize="sm" color={mutedText} mb={2}>
                {event.date}
              </Text>
              {event.details && <Box color={mutedText}>{event.details}</Box>}
            </Box>
          ))}
        </>
      )}
    </>
  );
}
