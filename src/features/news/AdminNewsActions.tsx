import React from 'react';

import { Menu, MenuButton, MenuItem, MenuList, Portal } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuPenTool, LuTrash2 } from 'react-icons/lu';

import { ActionsButton } from '@/components/ActionsButton';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Icon } from '@/components/Icons';
import { useToastError } from '@/components/Toast';
import { LinkAdmin } from '@/features/admin/LinkAdmin';
import { trpc } from '@/lib/trpc/client';

export type AdminNewsActionsProps = {
  newsItem: {
    id: string;
    title: string;
  };
};

export const AdminNewsActions = ({ newsItem }: AdminNewsActionsProps) => {
  const { t } = useTranslation(['common', 'users']);
  const toastError = useToastError();
  const trpcUtils = trpc.useUtils();

  const newsRemove = trpc.news.removeById.useMutation({
    onSuccess: () => {
      trpcUtils.news.getAllForAdmin?.invalidate();
    },
    onError: () => {
      toastError({
        title: t('users:feedbacks.deleteUserError.title'),
      });
    },
  });

  const onNewsRemove = () => {
    newsRemove.mutate({ id: newsItem.id });
  };

  return (
    <Menu isLazy placement="left-start">
      <MenuButton as={ActionsButton} />
      <Portal>
        <MenuList>
          <MenuItem
            as={LinkAdmin}
            href={`/management/news/${newsItem.id}`}
            icon={<Icon icon={LuPenTool} fontSize="lg" color="gray.400" />}
          >
            {t('common:actions.edit')}
          </MenuItem>
          <ConfirmModal
            title={t('users:deleteModal.title')}
            message={t('users:deleteModal.message', { name: newsItem.title })}
            onConfirm={onNewsRemove}
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
        </MenuList>
      </Portal>
    </Menu>
  );
};
