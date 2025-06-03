import React from 'react';

import { Button, Heading, SkeletonText } from '@chakra-ui/react';
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

import { EventForm } from './EventForm';
import { EventFormFields } from './schemas';

export default function PageAdminEventUpdate() {
  const { t } = useTranslation(['common', 'events']);
  const params = useParams();
  const router = useRouter();

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const {
    data: event,
    isLoading,
    isError,
    isSuccess,
  } = trpc.events.getById.useQuery({
    id: params?.id?.toString() ?? '',
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

  const isReady = !isLoading;

  const form = useForm<EventFormFields>({
    ready: isReady,
    initialValues: {
      name: event?.name ?? '',
      date: event?.date ?? new Date(),
      startTime: event?.startTime ?? '',
      endTime: event?.endTime ?? '',
      location: event?.location ?? '',
      address: event?.address ?? '',
      mapUrl: event?.mapUrl ?? '',
      embedMapUrl: event?.embedMapUrl ?? '',
      description: event?.description ?? '',
      isActive: event?.isActive ?? true,
    },
    onValidSubmit: async (values) => {
      if (!event?.id) return;
      await updateEvent.mutateAsync({
        id: event.id,
        data: {
          ...values,
          date: new Date(values.date),
        },
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
                isLoading={updateEvent.isLoading || updateEvent.isSuccess}
                isDisabled={!form.isValid && form.isSubmitted}
              >
                {t('common:actions.update')}
              </Button>
            </>
          }
        >
          {isLoading || isError ? (
            <SkeletonText maxW="6rem" noOfLines={2} />
          ) : (
            <Heading size="sm">
              {t('events:management.update.title', {
                defaultValue: 'Edit Event',
              })}
              {event?.name && `: ${event.name}`}
            </Heading>
          )}
        </AdminLayoutPageTopBar>
        {!isReady && <LoaderFull />}
        {isReady && isError && <ErrorPage />}
        {isReady && isSuccess && (
          <AdminLayoutPageContent>
            <EventForm
              defaultValues={{
                name: event?.name ?? '',
                date: event?.date ?? new Date(),
                startTime: event?.startTime ?? '',
                endTime: event?.endTime ?? '',
                location: event?.location ?? '',
                address: event?.address ?? '',
                mapUrl: event?.mapUrl ?? '',
                embedMapUrl: event?.embedMapUrl ?? '',
                description: event?.description ?? '',
                isActive: event?.isActive ?? true,
              }}
            />
          </AdminLayoutPageContent>
        )}
      </AdminLayoutPage>
    </Formiz>
  );
}
