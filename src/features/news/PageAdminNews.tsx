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
} from '@chakra-ui/react';
import { useQueryState } from 'nuqs';
import { Trans, useTranslation } from 'react-i18next';
import { LuPlus } from 'react-icons/lu';

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

import { AdminNewsActions } from './AdminNewsActions';

export default function PageAdminNews() {
  const { t } = useTranslation(['users']);
  const [searchTerm, setSearchTerm] = useQueryState('s', { defaultValue: '' });

  const news = trpc.news.getAllForAdmin.useInfiniteQuery(
    { searchTerm },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <AdminLayoutPage containerMaxWidth="container.xl" nav={<AdminNav />}>
      <AdminLayoutPageContent>
        <Stack spacing={4}>
          <HStack spacing={4} alignItems={{ base: 'end', md: 'center' }}>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              rowGap={2}
              columnGap={4}
              alignItems={{ base: 'start', md: 'center' }}
              flex={1}
            >
              <Heading flex="none" size="md">
                News Management
              </Heading>
              <SearchInput
                size="sm"
                value={searchTerm ?? ''}
                onChange={(value) => setSearchTerm(value || null)}
                onReset={() => setSearchTerm(null)}
              />
            </Flex>
            <ResponsiveIconButton
              as={LinkAdmin}
              href="/management/news/create"
              variant="@primary"
              size="sm"
              icon={<LuPlus />}
            >
              {t('users:list.actions.createUser')}
            </ResponsiveIconButton>
          </HStack>
          <DataList>
            {news.isLoading && <DataListLoadingState />}
            {news.isError && (
              <DataListErrorState
                title={t('users:feedbacks.loadingUserError.title')}
                retry={() => news.refetch()}
              />
            )}
            {news.isSuccess && !news.data?.pages?.[0]?.items?.length && (
              <DataListEmptyState searchTerm={searchTerm} />
            )}
            {news.data?.pages
              .flatMap((page) => page?.items ?? [])
              .map((newsItem) => (
                <DataListRow as={LinkBox} key={newsItem.id}>
                  <DataListCell>
                    <Text fontWeight="bold">
                      <LinkOverlay as={LinkAdmin} href={`/management/news/${newsItem.id}`}>
                        {newsItem.title}
                      </LinkOverlay>
                    </Text>
                    <DataListText fontSize="xs" color="text-dimmed">
                      {newsItem.content.length > 100
                        ? `${newsItem.content.substring(0, 100)}...`
                        : newsItem.content}
                    </DataListText>
                  </DataListCell>
                  <DataListCell>
                    <Text fontSize="sm" color="text-dimmed">
                      {newsItem.author?.name || newsItem.author?.email || 'Unknown'}
                    </Text>
                    <Text fontSize="xs" color="text-dimmed">
                      <Trans
                        t={t}
                        i18nKey="users:data.createdAt.ago"
                        components={{
                          dateAgo: <DateAgo date={newsItem.createdAt} />,
                        }}
                      />
                    </Text>
                  </DataListCell>
                  <DataListCell>
                    <AdminNewsActions newsItem={newsItem} />
                  </DataListCell>
                </DataListRow>
              ))}
            {news.hasNextPage && (
              <DataListRow>
                <DataListCell w="auto">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => news.fetchNextPage()}
                    isLoading={news.isFetchingNextPage}
                  >
                    Load more
                  </Button>
                </DataListCell>
                <DataListCell>
                  {/* Optional: Add load more info here like other admin pages */}
                </DataListCell>
                <DataListCell>
                  {/* Empty cell to maintain layout */}
                </DataListCell>
              </DataListRow>
            )}
          </DataList>
        </Stack>
      </AdminLayoutPageContent>
    </AdminLayoutPage>
  );
}