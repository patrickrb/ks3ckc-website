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
import { trpc } from '@/lib/trpc/client';

import { EventForm } from './EventForm';
import { EventFormFields } from './schemas';

export default function PageAdminEventCreate() {
  const { t } = useTranslation(['common', 'events']);
  const router = useRouter();

  const createEvent = trpc.events.create.useMutation({
    onSuccess: () => {
      router.push('/admin/management/events');
    },
  });

  const handleSubmit = (values: EventFormFields) => {
    createEvent.mutate(values);
  };

  const handleCancel = () => {
    router.push('/admin/management/events');
  };

  return (
    <AdminLayoutPage>
      <AdminLayoutPageContent>
        <Stack spacing={4}>
          <AdminBackButton />

          <Heading size="md">
            {t('events:management.create.title', { defaultValue: 'Create Event' })}
          </Heading>

          <AdminNav />

          <EventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createEvent.isLoading}
          />
        </Stack>
      </AdminLayoutPageContent>
    </AdminLayoutPage>
  );
}