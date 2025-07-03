import React from 'react';

import { Button, Flex, Heading, SkeletonText } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { ErrorPage } from '@/components/ErrorPage';
import { LoaderFull } from '@/components/LoaderFull';
import { useToastError, useToastSuccess } from '@/components/Toast';
import { AdminBackButton } from '@/features/admin/AdminBackButton';
import { AdminCancelButton } from '@/features/admin/AdminCancelButton';
import {
  AdminLayoutPage,
  AdminLayoutPageContent,
  AdminLayoutPageTopBar,
} from '@/features/admin/AdminLayoutPage';
import { trpc } from '@/lib/trpc/client';

import { BlogForm, BlogFormFields } from './BlogForm';

export default function PageAdminBlogUpdate() {
  const { t } = useTranslation(['common', 'users']);
  const trpcUtils = trpc.useUtils();

  const params = useParams();
  const router = useRouter();
  const blog = trpc.blogs.getById.useQuery(
    {
      id: params?.id?.toString() ?? '',
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const blogUpdate = trpc.blogs.updateById.useMutation({
    onSuccess: async () => {
      await trpcUtils.blogs.invalidate();
      toastSuccess({
        title: t('common:feedbacks.updateSuccess.title'),
      });
      router.back();
    },
    onError: () => {
      toastError({
        title: t('common:feedbacks.updateError.title'),
      });
    },
  });

  const isReady = !blog.isFetching;

  const form = useForm<BlogFormFields>({
    ready: isReady,
    initialValues: {
      title: blog.data?.title ?? '',
      content: blog.data?.content ?? '',
      featuredImage: blog.data?.featuredImage ?? undefined,
      tags: blog.data?.tags ?? [],
    },
    onValidSubmit: (values) => {
      if (!blog.data?.id) return;
      blogUpdate.mutate({
        id: blog.data.id,
        title: values.title,
        content: values.content,
        featuredImage: values.featuredImage ?? null,
        tags: values.tags || [],
      });
    },
  });

  return (
    <Formiz connect={form} autoForm>
      <AdminLayoutPage containerMaxWidth="container.md" showNavBar={false}>
        <AdminLayoutPageTopBar
          leftActions={<AdminBackButton withConfrim={!form.isPristine} />}
          rightActions={
            <>
              <AdminCancelButton withConfrim={!form.isPristine} />
              <Button
                type="submit"
                variant="@primary"
                isDisabled={!form.isValid && form.isSubmitted}
                isLoading={blogUpdate.isLoading || blogUpdate.isSuccess}
              >
                {t('common:actions.save')}
              </Button>
            </>
          }
        >
          {blog.isLoading || blog.isError ? (
            <SkeletonText maxW="6rem" noOfLines={2} />
          ) : (
            <Flex
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems={{ base: 'start', md: 'center' }}
              rowGap={1}
              columnGap={4}
            >
              <Heading size="sm">{blog.data?.title}</Heading>
            </Flex>
          )}
        </AdminLayoutPageTopBar>
        {!isReady && <LoaderFull />}
        {isReady && blog.isError && <ErrorPage />}
        {isReady && blog.isSuccess && (
          <AdminLayoutPageContent>
            <BlogForm blogId={blog.data?.id} />
          </AdminLayoutPageContent>
        )}
      </AdminLayoutPage>
    </Formiz>
  );
}
