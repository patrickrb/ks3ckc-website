import React from 'react';

import { Button, Heading } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

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

export default function PageAdminNewsCreate() {
  const { t } = useTranslation(['common']);
  const router = useRouter();

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const createNews = trpc.news.create.useMutation({
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
    onValidSubmit: async (values) => {
      const validatedData = NewsSchema.parse(values);
      await createNews.mutateAsync(validatedData);
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
                isLoading={createNews.isLoading || createNews.isSuccess}
                isDisabled={!form.isValid && form.isSubmitted}
              >
                {t('common:actions.create')}
              </Button>
            </>
          }
        >
          <Heading size="sm">Create News Entry</Heading>
        </AdminLayoutPageTopBar>
        <AdminLayoutPageContent>
          <NewsForm />
        </AdminLayoutPageContent>
      </AdminLayoutPage>
    </Formiz>
  );
}