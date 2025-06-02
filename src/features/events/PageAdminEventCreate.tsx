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

import { EventForm } from './EventForm';
import { EventFormFields } from './schemas';

export default function PageAdminEventCreate() {
  const { t } = useTranslation(['common', 'events']);
  const router = useRouter();

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const createEvent = trpc.events.create.useMutation({
    onSuccess: () => {
      toastSuccess({
        title: t('common:feedbacks.updateSuccess.title'),
      });
      router.push('/admin/management/events');
    },
    onError: () => {
      toastError({
        title: t('common:feedbacks.updateError.title'),
      });
    },
  });

  const form = useForm<EventFormFields>({
    onValidSubmit: async (values) => {
      await createEvent.mutateAsync({
        ...values,
        date: new Date(values.date),
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
                isLoading={createEvent.isLoading || createEvent.isSuccess}
                isDisabled={!form.isValid && form.isSubmitted}
              >
                {t('common:actions.create')}
              </Button>
            </>
          }
        >
          <Heading size="sm">
            {t('events:management.create.title', {
              defaultValue: 'Create Event',
            })}
          </Heading>
        </AdminLayoutPageTopBar>
        <AdminLayoutPageContent>
          <EventForm />
        </AdminLayoutPageContent>
      </AdminLayoutPage>
    </Formiz>
  );
}
