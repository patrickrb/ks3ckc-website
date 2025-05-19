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

import { AdminBlogActions } from './AdminBlogActions';

// import { AdminUserActions } from './AdminUserActions';

export default function PageAdminBlogs() {
  const { t } = useTranslation(['users']);
  const [searchTerm, setSearchTerm] = useQueryState('s', { defaultValue: '' });

  // const account = trpc.account.get.useQuery();

  const blogs = trpc.blogs.getAll.useInfiniteQuery(
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
                Blogs Management
              </Heading>
              <SearchInput
                size="sm"
                value={searchTerm}
                onChange={(value) => setSearchTerm(value || null)}
                maxW={{ base: 'none', md: '20rem' }}
              />
            </Flex>
            <ResponsiveIconButton
              as={LinkAdmin}
              href="/management/blogs/create"
              variant="@primary"
              size="sm"
              icon={<LuPlus />}
            >
              Create Blog
            </ResponsiveIconButton>
          </HStack>

          <DataList>
            {blogs.isLoading && <DataListLoadingState />}
            {blogs.isError && (
              <DataListErrorState
                title={t('users:feedbacks.loadingUserError.title')}
                retry={() => blogs.refetch()}
              />
            )}
            {blogs.isSuccess &&
              !blogs.data.pages.flatMap((p) => p.items).length && (
                <DataListEmptyState searchTerm={searchTerm} />
              )}
            {blogs.data?.pages
              .flatMap((p) => p.items)
              .map((blog) => (
                <DataListRow as={LinkBox} key={blog.id} withHover>
                  {/* <DataListCell w="auto">
                    <Avatar size="sm" name={user.email ?? ''} />
                  </DataListCell> */}
                  <DataListCell flex={2}>
                    <DataListText fontWeight="bold">
                      <LinkOverlay
                        as={LinkAdmin}
                        href={`/management/blogs/${blog.id}`}
                      >
                        {blog.title}
                      </LinkOverlay>
                    </DataListText>
                    <DataListText color="text-dimmed">
                      {blog.authorId}
                    </DataListText>
                  </DataListCell>
                  <DataListCell
                    pointerEvents="none"
                    display={{ base: 'none', md: 'flex' }}
                  >
                    <DataListText
                      noOfLines={2}
                      pointerEvents="auto"
                      color="text-dimmed"
                    >
                      <Trans
                        i18nKey="users:data.createdAt.ago"
                        t={t}
                        components={{
                          dateAgo: <DateAgo date={blog.createdAt} />,
                        }}
                      />
                    </DataListText>
                  </DataListCell>
                  <DataListCell w="auto">
                    <AdminBlogActions blog={blog} />
                  </DataListCell>
                </DataListRow>
              ))}
            {blogs.isSuccess && (
              <DataListRow mt="auto">
                <DataListCell w="auto">
                  <Button
                    size="sm"
                    onClick={() => blogs.fetchNextPage()}
                    isLoading={blogs.isFetchingNextPage}
                    isDisabled={!blogs.hasNextPage}
                  >
                    {t('users:list.loadMore.button')}
                  </Button>
                </DataListCell>
                <DataListCell>
                  {blogs.isSuccess && !!blogs.data.pages[0]?.total && (
                    <Text fontSize="xs" color="text-dimmed">
                      {`Showing ${
                        blogs.data.pages.flatMap((p) => p.items).length
                      } of ${blogs.data.pages[0].total} blogs`}
                    </Text>
                  )}
                </DataListCell>
              </DataListRow>
            )}
          </DataList>
        </Stack>
      </AdminLayoutPageContent>
    </AdminLayoutPage>
  );
}
