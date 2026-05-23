'use client';

import { Box, Container, Grid, Link, Text } from '@chakra-ui/react';

import PhosPageHeader from '@/components/HomeRedesign/PhosPageHeader';
import PhosPanel from '@/components/HomeRedesign/PhosPanel';
import { PHOS } from '@/components/HomeRedesign/phosphorTheme';
import { trpc } from '@/lib/trpc/client';

interface Event {
  id: string;
  name: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  address?: string;
  mapUrl?: string;
  embedMapUrl?: string;
  description?: string;
  isActive: boolean;
}

const monthShort = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
const dayNum = (d: Date) => d.getDate().toString().padStart(2, '0');
const dayName = (d: Date) =>
  d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

function EventRow({ event, past = false }: { event: Event; past?: boolean }) {
  const d = new Date(event.date);
  return (
    <Grid
      templateColumns={{ base: '60px 1fr', md: '78px 1fr' }}
      gap={5}
      px={4}
      py={4}
      borderTop="1px dashed"
      borderColor={PHOS.line2}
      opacity={past ? 0.6 : 1}
    >
      <Box
        textAlign="center"
        borderRight="1px dashed"
        borderColor={PHOS.line2}
        pr={4}
      >
        <Text fontSize="10px" color={PHOS.greenDim}>
          {dayName(d)}
        </Text>
        <Text
          fontSize="28px"
          fontWeight="700"
          color={past ? PHOS.greenDim : PHOS.paper}
          lineHeight="1"
        >
          {dayNum(d)}
        </Text>
        <Text fontSize="10px" color={PHOS.greenDim}>
          {monthShort(d)}
        </Text>
      </Box>
      <Box>
        <Text
          fontSize={{ base: '14px', md: '16px' }}
          color={past ? PHOS.greenDim : PHOS.paper}
          mb={1}
        >
          {event.name}
        </Text>
        <Text fontSize="11px" color={PHOS.greenDim} mb={2}>
          {d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {event.startTime && ` · ${event.startTime}`}
          {event.endTime && ` – ${event.endTime}`}
        </Text>
        {event.location && (
          <Text fontSize="12px" color={PHOS.green} mb={1}>
            {'// '}
            {event.location}
          </Text>
        )}
        {event.address && event.mapUrl && (
          <Link
            href={event.mapUrl}
            isExternal
            color={PHOS.greenD}
            fontSize="12px"
            textDecoration="underline"
            textUnderlineOffset="3px"
            _hover={{ color: PHOS.green, bg: 'rgba(57,255,20,0.12)' }}
          >
            {event.address}
          </Link>
        )}
        {event.description && (
          <Text
            fontSize="13px"
            color={past ? PHOS.greenDim : PHOS.paper}
            opacity={0.85}
            mt={2}
            lineHeight="1.6"
          >
            {event.description}
          </Text>
        )}
      </Box>
    </Grid>
  );
}

export default function EventsPage() {
  const { data: upcoming = [], isLoading: upLoading } =
    trpc.events.getUpcoming.useQuery();
  const { data: past = [], isLoading: pastLoading } =
    trpc.events.getPast.useQuery();

  return (
    <Box>
      <PhosPageHeader
        cmd="crontab -l --upcoming"
        title="events &amp; nets"
        subtitle="club nets, build days, license sessions, field day. RSVP via discord — or just show up."
        comment="all times CT unless noted"
      />

      <Container maxW="container.lg" py={{ base: 8, md: 12 }}>
        <Box mb={8}>
          <PhosPanel
            title="./upcoming.tsv"
            meta={upLoading ? 'loading…' : `${upcoming.length} entries`}
          >
            {upLoading ? (
              <Box
                px={4}
                py={6}
                fontFamily={PHOS.mono}
                color={PHOS.greenDim}
                fontSize="13px"
              >
                $ loading events…
              </Box>
            ) : upcoming.length === 0 ? (
              <Box
                px={4}
                py={6}
                fontFamily={PHOS.mono}
                color={PHOS.greenDim}
                fontSize="13px"
              >
                ${' '}
                <Text as="span" color={PHOS.paper}>
                  echo &quot;no upcoming events scheduled&quot;
                </Text>
              </Box>
            ) : (
              <Box>
                {(upcoming as Event[]).map((e) => (
                  <EventRow key={e.id} event={e} />
                ))}
              </Box>
            )}
          </PhosPanel>
        </Box>

        {past.length > 0 && (
          <Box>
            <PhosPanel
              title="./past.tsv"
              meta={`${past.length} entries · archived`}
            >
              {pastLoading ? (
                <Box
                  px={4}
                  py={6}
                  fontFamily={PHOS.mono}
                  color={PHOS.greenDim}
                  fontSize="13px"
                >
                  $ loading…
                </Box>
              ) : (
                <Box>
                  {(past as Event[]).map((e) => (
                    <EventRow key={e.id} event={e} past />
                  ))}
                </Box>
              )}
            </PhosPanel>
          </Box>
        )}
      </Container>
    </Box>
  );
}
