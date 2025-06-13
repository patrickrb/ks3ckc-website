import React from 'react';

import { Button, Heading } from '@chakra-ui/react';
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

import { NewsForm, NewsFormFields, NewsSchema } from './NewsForm';

export default function PageAdminNewsUpdate() {
  const { t } = useTranslation(['common']);
  const router = useRouter();
  const params = useParams();

  const newsId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const {
    data: news,
    isLoading: newsLoading,
    isError,
  } = trpc.news.getById.useQuery({ id: newsId ?? '' }, { enabled: !!newsId });

  const updateNews = trpc.news.updateById.useMutation({
    onSuccess: () => {
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

  const form = useForm<NewsFormFields>({
    ready: !newsLoading,
    initialValues: {
      title: news?.title ?? '',
      content: news?.content ?? '',
    },
    onValidSubmit: async (values) => {
      if (!newsId) return;
      const validatedData = NewsSchema.parse(values);
      await updateNews.mutateAsync({
        id: newsId,
        ...validatedData,
      });
    },
  });

  if (newsLoading) {
    return <LoaderFull />;
  }

  if (isError) {
    return <ErrorPage />;
  }

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
                isLoading={updateNews.isLoading || updateNews.isSuccess}
                isDisabled={!form.isValid && form.isSubmitted}
              >
                {t('common:actions.update')}
              </Button>
            </>
          }
        >
          <Heading size="sm">Update News Entry</Heading>
        </AdminLayoutPageTopBar>
        <AdminLayoutPageContent>
          <NewsForm />
        </AdminLayoutPageContent>
      </AdminLayoutPage>
    </Formiz>
  );
}
