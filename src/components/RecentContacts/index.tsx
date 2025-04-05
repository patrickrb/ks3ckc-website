import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

import { trpc } from '@/lib/trpc/client';

import { DateAgo } from '../DateAgo';

interface QsoItem {
  COL_CALL: string;
  COL_TIME_ON: string;
  COL_FREQ: string;
  COL_MODE: string;
  COL_RST_SENT: string;
  COL_RST_RCVD: string;
  COL_COMMENT: string;
}

export default function RecentContacts() {
  const cardBg = useColorModeValue('white', 'gray.800');

  const qsoItems = trpc.qso.getRecent.useQuery();

  return (
    <>
      <Heading as="h4" size="md">
        Latest QSO's
      </Heading>
      {qsoItems.isSuccess &&
        Array.isArray(qsoItems.data) &&
        qsoItems.data.map((qso: QsoItem, i: number) => {
          return (
            <Box key={i} bg={cardBg} p={4} borderRadius="md" mb={4}>
              <Heading as="h5" size="sm" mb={2}>
                QSO with {qso.COL_CALL}
              </Heading>
              <Text fontSize="sm" color="gray.600" mb={2}>
                <DateAgo date={qso.COL_TIME_ON} />
              </Text>
              <Text fontSize="sm" mb={2}>
                Frequency: {qso.COL_FREQ}, Mode: {qso.COL_MODE}
              </Text>
              <Text fontSize="sm" mb={2}>
                RST Sent: {qso.COL_RST_SENT}, RST Received: {qso.COL_RST_RCVD}
              </Text>
              {qso.COL_COMMENT && (
                <Text fontSize="sm">Notes: {qso.COL_COMMENT}</Text>
              )}
            </Box>
          );
        })}
    </>
  );
}
