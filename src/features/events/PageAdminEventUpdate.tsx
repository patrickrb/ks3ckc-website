import React from 'react';

import { Heading, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import {
  AdminLayoutPage,
  AdminLayoutPageContent,
} from '@/features/admin/AdminLayoutPage';
import { AdminBackButton } from '@/features/admin/AdminBackButton';
import { AdminNav } from '@/features/management/ManagementNav';
import { api } from '@/lib/trpc/client';

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

  const { data: event, isLoading } = api.events.getById.useQuery({
    id: params.id,
  });

  const updateEvent = api.events.update.useMutation({
    onSuccess: () => {
      router.push('/admin/management/events');
    },
  });

  const handleSubmit = (values: EventFormFields) => {
    updateEvent.mutate({
      id: params.id,
      data: values,
    });
  };

  const handleCancel = () => {
    router.push('/admin/management/events');
  };

  if (isLoading) {
    return (
      <AdminLayoutPage>
        <AdminLayoutPageContent>
          <Stack spacing={4}>
            <AdminBackButton href="/admin/management/events">
              {t('events:management.backToEvents', { defaultValue: 'Back to Events' })}
            </AdminBackButton>
            <Heading size="md">
              {t('common:loading', { defaultValue: 'Loading...' })}
            </Heading>
          </Stack>
        </AdminLayoutPageContent>
      </AdminLayoutPage>
    );
  }

  if (!event) {
    return (
      <AdminLayoutPage>
        <AdminLayoutPageContent>
          <Stack spacing={4}>
            <AdminBackButton href="/admin/management/events">
              {t('events:management.backToEvents', { defaultValue: 'Back to Events' })}
            </AdminBackButton>
            <Heading size="md">
              {t('events:errors.notFound', { defaultValue: 'Event not found' })}
            </Heading>
          </Stack>
        </AdminLayoutPageContent>
      </AdminLayoutPage>
    );
  }

  return (
    <AdminLayoutPage>
      <AdminLayoutPageContent>
        <Stack spacing={4}>
          <AdminBackButton href="/admin/management/events">
            {t('events:management.backToEvents', { defaultValue: 'Back to Events' })}
          </AdminBackButton>

          <Heading size="md">
            {t('events:management.update.title', { defaultValue: 'Edit Event' })}: {event.name}
          </Heading>

          <AdminNav />

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
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={updateEvent.isLoading}
          />
        </Stack>
      </AdminLayoutPageContent>
    </AdminLayoutPage>
  );
}