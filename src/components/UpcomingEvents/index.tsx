import { Box, Heading, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { api } from '@/lib/trpc/client';

export default function UpcomingEvents() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const mutedText = useColorModeValue('gray.500', 'gray.400');

  // Fetch upcoming and past events from the database
  const { data: upcomingEvents = [], isLoading: isLoadingUpcoming } = api.events.getUpcoming.useQuery();
  const { data: pastEvents = [], isLoading: isLoadingPast } = api.events.getPast.useQuery();

  const renderEventDetails = (event: any) => {
    if (!event.startTime && !event.location && !event.description) {
      return null;
    }

    return (
      <>
        {event.startTime && (
          <Text fontSize="md" mb={1}>
            {event.startTime}{event.endTime && ` - ${event.endTime}`}
          </Text>
        )}
        {event.location && (
          <Text fontSize="md" fontWeight="bold" mb={1}>
            {event.location}
          </Text>
        )}
        {event.address && event.mapUrl && (
          <Link href={event.mapUrl} isExternal>
            {event.address}
          </Link>
        )}
        {event.embedMapUrl && (
          <Box mt={3} mb={3} borderRadius="md" overflow="hidden">
            <iframe
              src={event.embedMapUrl}
              width="200"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        )}
        {event.description && (
          <Text fontSize="md" mb={1}>
            {event.description}
          </Text>
        )}
      </>
    );
  };

  if (isLoadingUpcoming || isLoadingPast) {
    return <Text>Loading events...</Text>;
  }

  return (
    <>
      {/* Upcoming Events Section */}
      <Heading as="h2" size="lg" ms={2} mb={4}>
        Upcoming Events
      </Heading>
      {upcomingEvents.length > 0 ? (
        upcomingEvents.map((event) => (
          <Box key={event.id} bg={cardBg} p={4} borderRadius="md" mb={4}>
            <Heading as="h3" size="md" mb={2}>
              {event.name}
            </Heading>
            <Text fontSize="sm" color="gray.400" mb={2}>
              {new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            {renderEventDetails(event)}
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
                {new Date(event.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Box color={mutedText}>{renderEventDetails(event)}</Box>
            </Box>
          ))}
        </>
      )}
    </>
  );
}