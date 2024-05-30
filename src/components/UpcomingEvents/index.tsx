import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

export default function RecentContacts() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const upcomingEvents = [
    { id: 1, name: 'DX Contest', date: 'April 30, 2024' },
    { id: 2, name: 'Local Meetup', date: 'May 15, 2024' },
    { id: 2, name: 'Summer Field Day', date: 'June 15, 2024' },
  ];

  return (
    <>
      <Heading as="h4" size="md">
        Upcoming Contests
      </Heading>
      {upcomingEvents.map((event, i) => {
        return (
          <Box key={i} bg={cardBg} p={4} borderRadius="md" mb={4}>
            <Heading as="h5" size="sm" mb={2}>
              {event.name}
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={2}>
              {event.date}
            </Text>
          </Box>
        );
      })}
    </>
  );
}
