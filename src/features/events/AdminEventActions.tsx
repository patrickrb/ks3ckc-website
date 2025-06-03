import React from 'react';

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuProps,
  Portal,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuPenLine, LuTrash2 } from 'react-icons/lu';

import { ActionsButton } from '@/components/ActionsButton';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Icon } from '@/components/Icons';
import { useToastError } from '@/components/Toast';
import { LinkAdmin } from '@/features/admin/LinkAdmin';
import { trpc } from '@/lib/trpc/client';
import type { RouterOutputs } from '@/lib/trpc/types';

export type AdminEventActionsProps = Omit<MenuProps, 'children'> & {
  event: RouterOutputs['events']['getAll'][number];
};

export const AdminEventActions = ({
  event,
  ...rest
}: AdminEventActionsProps) => {
  const { t } = useTranslation(['common', 'events']);
  const trpcUtils = trpc.useUtils();

  const toastError = useToastError();

  // Get current user account to check permissions
  const account = trpc.account.get.useQuery();

  const deleteEvent = trpc.events.delete.useMutation({
    onSuccess: async () => {
      await trpcUtils.events.getAll.invalidate();
    },
    onError: () => {
      toastError({
        title: t('events:feedbacks.deleteEventError.title', {
          defaultValue: 'Error deleting event',
        }),
        description: t('events:feedbacks.deleteEventError.description', {
          defaultValue: 'Failed to delete event',
          name: event.name,
        }),
      });
    },
  });

  const isLoading = deleteEvent.isLoading;

  // Check if current user can delete events (only admins)
  const canDelete = account.data?.authorizations?.includes('ADMIN');

  // Check if current user can edit events (admins or event author)
  const canEdit =
    account.data?.authorizations?.includes('ADMIN') ||
    account.data?.authorizations?.includes('CONTRIBUTOR');

  return (
    <Menu placement="left-start" {...rest}>
      <MenuButton as={ActionsButton} isLoading={isLoading} />
      <Portal>
        <MenuList>
          {canEdit && (
            <MenuItem
              as={LinkAdmin}
              href={`/management/events/${event.id}`}
              icon={<Icon icon={LuPenLine} fontSize="lg" color="gray.400" />}
            >
              {t('common:actions.edit')}
            </MenuItem>
          )}

          {canDelete && (
            <ConfirmModal
              title={t('events:deleteModal.title', {
                defaultValue: 'Delete Event',
              })}
              message={t('events:deleteModal.message', {
                defaultValue:
                  'Are you sure you want to delete this event? This action cannot be undone.',
                name: event.name,
              })}
              onConfirm={() => deleteEvent.mutate({ id: event.id })}
              confirmText={t('common:actions.delete')}
              confirmVariant="@dangerSecondary"
            >
              <MenuItem
                icon={<Icon icon={LuTrash2} fontSize="lg" color="gray.400" />}
                color="text-danger"
              >
                {t('common:actions.delete')}
              </MenuItem>
            </ConfirmModal>
          )}
        </MenuList>
      </Portal>
    </Menu>
  );
};
