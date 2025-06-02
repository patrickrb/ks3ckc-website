import React from 'react';

import {
  Button,
  Flex,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  Badge,
} from '@chakra-ui/react';
import { useQueryState } from 'nuqs';
import { Trans, useTranslation } from 'react-i18next';
import { LuPlus, LuCalendar } from 'react-icons/lu';

import {
  DataList,
  DataListCell,
  DataListEmptyState,
  DataListErrorState,
  DataListLoadingState,
  DataListRow,
  DataListText,
} from '@/components/DataList';
import { DateAgo } from '@/components/DateAgo';
import { ResponsiveIconButton } from '@/components/ResponsiveIconButton';
import { SearchInput } from '@/components/SearchInput';
import {
  AdminLayoutPage,
  AdminLayoutPageContent,
} from '@/features/admin/AdminLayoutPage';
import { LinkAdmin } from '@/features/admin/LinkAdmin';
import { AdminNav } from '@/features/management/ManagementNav';
import { trpc } from '@/lib/trpc/client';

// import { AdminEventActions } from './AdminEventActions';

export default function PageAdminEvents() {
  const { t } = useTranslation(['common', 'events']);
  const [searchTerm, setSearchTerm] = useQueryState('s', { defaultValue: '' });

  const events = trpc.events.getAll.useQuery(
    { includeInactive: true },
    {
      staleTime: 0,
    }
  );

  return (
    <AdminLayoutPage>
      <AdminLayoutPageContent>
        <Stack spacing={4}>
          <HStack spacing={4} w="full">
            <Flex flex="1" direction={{ base: 'column', md: 'row' }} rowGap={2}>
              <Heading flex="1" size="md">
                {t('events:management.title', { defaultValue: 'Events Management' })}
              </Heading>
            </Flex>
            <ResponsiveIconButton
              as={LinkAdmin}
              href="/admin/management/events/create"
              icon={<LuPlus />}
              size="sm"
              colorScheme="brand"
            >
              {t('events:management.actions.create', { defaultValue: 'Create Event' })}
            </ResponsiveIconButton>
          </HStack>

          <AdminNav />

          {/* <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('events:management.search.placeholder', { defaultValue: 'Search events...' })}
          /> */}

          <DataList>
            {events.isLoading && <DataListLoadingState />}
            {events.isError && (
              <DataListErrorState
                title={t('events:feedbacks.loadingEventError.title', { defaultValue: 'Failed to load events' })}
                retry={() => events.refetch()}
              />
            )}
            {events.isSuccess && !events.data?.length && (
              <DataListEmptyState searchTerm={searchTerm}>
                <Text>
                  <Trans
                    t={t}
                    i18nKey="events:management.empty"
                    defaults="No events found"
                  />
                </Text>
              </DataListEmptyState>
            )}
            {events.data?.map((event) => (
              <DataListRow as={LinkBox} key={event.id} withHover>
                <DataListCell>
                  <HStack maxW="full">
                    <LinkOverlay
                      as={LinkAdmin}
                      href={`/admin/management/events/${event.id}`}
                    >
                      <DataListText fontWeight="bold">
                        {event.name}
                      </DataListText>
                      <DataListText color="text-dimmed">
                        <HStack spacing={2}>
                          <Text fontSize="sm">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                          {!event.isActive && (
                            <Badge colorScheme="gray" size="sm">
                              {t('events:status.inactive', { defaultValue: 'Inactive' })}
                            </Badge>
                          )}
                          {event.location && (
                            <Text fontSize="sm">
                              📍 {event.location}
                            </Text>
                          )}
                        </HStack>
                      </DataListText>
                    </LinkOverlay>
                  </HStack>
                </DataListCell>
                <DataListCell w="auto">
                  <Text fontSize="sm" color="gray.500">
                    {t('events:management.createdBy', { defaultValue: 'Created by' })}{' '}
                    {event.author.name || event.author.callsign}
                  </Text>
                </DataListCell>
                <DataListCell w="auto">
                  <DateAgo date={event.createdAt} />
                </DataListCell>
                {/* <DataListCell>
                  <AdminEventActions event={event} />
                </DataListCell> */}
              </DataListRow>
            ))}
          </DataList>
        </Stack>
      </AdminLayoutPageContent>
    </AdminLayoutPage>
  );
}