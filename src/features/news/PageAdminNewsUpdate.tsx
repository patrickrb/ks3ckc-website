import React from 'react';

import { Button, ButtonGroup, Heading } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { LoaderFull } from '@/components/LoaderFull';
import { useToastError, useToastSuccess } from '@/components/Toast';
import {
  AdminLayoutPage,
  AdminLayoutPageContent,
} from '@/features/admin/AdminLayoutPage';
import { AdminBackButton } from '@/features/admin/AdminBackButton';
import { AdminNav } from '@/features/management/ManagementNav';
import { trpc } from '@/lib/trpc/client';

import { NewsForm, NewsFormFields, NewsSchema } from './NewsForm';

export default function PageAdminNewsUpdate() {
  const { t } = useTranslation(['common']);
  const router = useRouter();
  const params = useParams();
  const form = useForm<NewsFormFields>({ subscribe: false });

  const newsId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const { data: news, isLoading: newsLoading } = trpc.news.getById.useQuery(
    { id: newsId ?? '' },
    { enabled: !!newsId }
  );

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

  const submitUpdateNews = async (values: NewsFormFields) => {
    if (!newsId) return;
    const validatedData = NewsSchema.parse(values);
    await updateNews.mutateAsync({
      id: newsId,
      ...validatedData,
    });
  };

  if (newsLoading) {
    return <LoaderFull />;
  }

  return (
    <AdminLayoutPage nav={<AdminNav />}>
      <AdminLayoutPageContent>
        <AdminBackButton withConfirm={form.isValid && form.values}>
          {t('common:actions.cancel')}
        </AdminBackButton>
        <Heading size="md" mb="4">
          Update News Entry
        </Heading>
        <Formiz
          id="update-news-form"
          onValidSubmit={submitUpdateNews}
          connect={form}
          initialValues={{
            title: news?.title ?? '',
            content: news?.content ?? '',
          }}
        >
          <form noValidate onSubmit={form.submit}>
            <NewsForm />
            <ButtonGroup mt={4} w="full">
              <Button
                type="submit"
                variant="@primary"
                isLoading={updateNews.isLoading}
                isDisabled={!form.isValid}
              >
                {t('common:actions.update')}
              </Button>
            </ButtonGroup>
          </form>
        </Formiz>
      </AdminLayoutPageContent>
    </AdminLayoutPage>
  );
}