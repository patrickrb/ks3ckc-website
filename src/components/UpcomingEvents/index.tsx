import { Box, Heading, Link, Text, useColorModeValue } from '@chakra-ui/react';

export default function RecentContacts() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const upcomingEvents = [
    { id: 1, name: 'DX Contest', date: 'April 30, 2024' },
    {
      id: 2,
      name: 'Local Meetup',
      date: 'May 15, 2024',
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
            color="teal.500"
            fontSize="sm"
          >
            25600 West Valley Parkway, Olathe, KS 66061 United States
          </Link>
        </>
      ),
    },
    { id: 3, name: 'Summer Field Day', date: 'June 15, 2024' },
  ];

  return (
    <>
      <Heading as="h2" size="lg" ms={2} mb={4}>
        Upcoming Events
      </Heading>
      {upcomingEvents.map((event, i) => (
        <Box key={i} bg={cardBg} p={4} borderRadius="md" mb={4}>
          <Heading as="h3" size="md" mb={2}>
            {event.name}
          </Heading>
          <Text fontSize="sm" color="gray.400" mb={2}>
            {event.date}
          </Text>
          {event.details}
        </Box>
      ))}
    </>
  );
}
