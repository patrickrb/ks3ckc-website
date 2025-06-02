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

type PageAdminEventUpdateProps = {
  params: {
    id: string;
  };
};

export default function PageAdminEventUpdate({
  params,
}: PageAdminEventUpdateProps) {
  const { t } = useTranslation(['common', 'events']);
  const router = useRouter();

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const { data: event, isLoading } = trpc.events.getById.useQuery({
    id: params.id,
  });

  const updateEvent = trpc.events.update.useMutation({
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
      await updateEvent.mutateAsync({
        id: params.id,
        data: {
          ...values,
          date: new Date(values.date),
        },
      });
    },
  });

  if (isLoading) {
    return (
      <AdminLayoutPage containerMaxWidth="container.md" showNavBar={false}>
        <AdminLayoutPageTopBar leftActions={<AdminBackButton />}>
          <Heading size="sm">
            {t('common:loading', { defaultValue: 'Loading...' })}
          </Heading>
        </AdminLayoutPageTopBar>
        <AdminLayoutPageContent />
      </AdminLayoutPage>
    );
  }

  if (!event) {
    return (
      <AdminLayoutPage containerMaxWidth="container.md" showNavBar={false}>
        <AdminLayoutPageTopBar leftActions={<AdminBackButton />}>
          <Heading size="sm">
            {t('events:errors.notFound', { defaultValue: 'Event not found' })}
          </Heading>
        </AdminLayoutPageTopBar>
        <AdminLayoutPageContent />
      </AdminLayoutPage>
    );
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
                isLoading={updateEvent.isLoading || updateEvent.isSuccess}
                isDisabled={!form.isValid && form.isSubmitted}
              >
                {t('common:actions.update')}
              </Button>
            </>
          }
        >
          <Heading size="sm">
            {t('events:management.update.title', {
              defaultValue: 'Edit Event',
            })}
            : {event.name}
          </Heading>
        </AdminLayoutPageTopBar>
        <AdminLayoutPageContent>
          <EventForm
            defaultValues={{
              name: event.name,
              date: event.date,
              startTime: event.startTime || '',
              endTime: event.endTime || '',
              location: event.location || '',
              address: event.address || '',
              mapUrl: event.mapUrl || '',
              embedMapUrl: event.embedMapUrl || '',
              description: event.description || '',
              isActive: event.isActive,
            }}
          />
        </AdminLayoutPageContent>
      </AdminLayoutPage>
    </Formiz>
  );
}
