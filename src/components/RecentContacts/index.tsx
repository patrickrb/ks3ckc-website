import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

export default function RecentContacts() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const qsoItems = [
    {
      id: 1,
      date: '2024-02-15',
      time: '18:30',
      frequency: '14.300 MHz',
      mode: 'SSB',
      myCallSign: 'N0CALL',
      theirCallSign: 'W1AW',
      rstSent: '59',
      rstReceived: '59',
      notes: 'Discussed antenna setups.',
    },
    {
      id: 2,
      date: '2024-02-16',
      time: '09:45',
      frequency: '7.040 MHz',
      mode: 'CW',
      myCallSign: 'N0CALL',
      theirCallSign: 'G4XYZ',
      rstSent: '599',
      rstReceived: '599',
      notes: 'First contact with UK on this band.',
    },
    {
      id: 3,
      date: '2024-02-16',
      time: '13:20',
      frequency: '21.360 MHz',
      mode: 'SSB',
      myCallSign: 'N0CALL',
      theirCallSign: 'JA1NUT',
      rstSent: '57',
      rstReceived: '57',
      notes: 'Great conversation about DXpeditions.',
    },
  ];

  return (
    <>
      <Heading as="h4" size="md">
        Latest QSO's
      </Heading>
      {Array.isArray(qsoItems) &&
        qsoItems.map((qso, i) => (
          <Box key={i} bg={cardBg} p={4} borderRadius="md" mb={4}>
            <Heading as="h5" size="sm" mb={2}>
              QSO with {qso.theirCallSign}
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Date: {qso.date}, Time: {qso.time}
            </Text>
            <Text fontSize="sm" mb={2}>
              Frequency: {qso.frequency}, Mode: {qso.mode}
            </Text>
            <Text fontSize="sm" mb={2}>
              RST Sent: {qso.rstSent}, RST Received: {qso.rstReceived}
            </Text>
            <Text fontSize="sm">Notes: {qso.notes}</Text>
          </Box>
        ))}
    </>
  );
}
