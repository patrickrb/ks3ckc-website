import React from 'react';

import { Button, ButtonGroup, Heading } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useToastError, useToastSuccess } from '@/components/Toast';
import {
  AdminLayoutPage,
  AdminLayoutPageContent,
} from '@/features/admin/AdminLayoutPage';
import { AdminBackButton } from '@/features/admin/AdminBackButton';
import { AdminNav } from '@/features/management/ManagementNav';
import { trpc } from '@/lib/trpc/client';

import { NewsForm, NewsFormFields, NewsSchema } from './NewsForm';

export default function PageAdminNewsCreate() {
  const { t } = useTranslation(['common']);
  const router = useRouter();
  const form = useForm<NewsFormFields>({ subscribe: false });

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const createNews = trpc.news.create.useMutation({
    onSuccess: () => {
      toastSuccess({
        title: t('common:feedbacks.createSuccess.title'),
      });
      router.back();
    },
    onError: () => {
      toastError({
        title: t('common:feedbacks.createError.title'),
      });
    },
  });

  const submitCreateNews = async (values: NewsFormFields) => {
    const validatedData = NewsSchema.parse(values);
    await createNews.mutateAsync(validatedData);
  };

  return (
    <AdminLayoutPage nav={<AdminNav />}>
      <AdminLayoutPageContent>
        <AdminBackButton withConfirm={form.isValid && form.values}>
          {t('common:actions.cancel')}
        </AdminBackButton>
        <Heading size="md" mb="4">
          Create News Entry
        </Heading>
        <Formiz
          id="create-news-form"
          onValidSubmit={submitCreateNews}
          connect={form}
        >
          <form noValidate onSubmit={form.submit}>
            <NewsForm />
            <ButtonGroup mt={4} w="full">
              <Button
                type="submit"
                variant="@primary"
                isLoading={createNews.isLoading}
                isDisabled={!form.isValid}
              >
                {t('common:actions.create')}
              </Button>
            </ButtonGroup>
          </form>
        </Formiz>
      </AdminLayoutPageContent>
    </AdminLayoutPage>
  );
}