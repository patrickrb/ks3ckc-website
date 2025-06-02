import React from 'react';

import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LuMoreHorizontal, LuPenTool, LuTrash2 } from 'react-icons/lu';

import { ConfirmModal } from '@/components/ConfirmModal';
import { ResponsiveIconButton } from '@/components/ResponsiveIconButton';
import { useToastError, useToastSuccess } from '@/components/Toast';
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
  const router = useRouter();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();
  const trpcUtils = trpc.useUtils();

  const newsRemove = trpc.news.removeById.useMutation({
    onSuccess: () => {
      toastSuccess({
        title: t('users:feedbacks.deleteUserSuccess.title'),
      });
      trpcUtils.news.getAllForAdmin.invalidate();
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
      <MenuButton
        as={ResponsiveIconButton}
        icon={<LuMoreHorizontal />}
        variant="ghost"
        size="xs"
      />
      <MenuList>
        <MenuItem as={LinkAdmin} href={`/management/news/${newsItem.id}`} icon={<LuPenTool />}>
          {t('common:actions.edit')}
        </MenuItem>
        <ConfirmModal
          title={t('users:deleteModal.title')}
          message={t('users:deleteModal.message', { name: newsItem.title })}
          onConfirm={onNewsRemove}
          confirmText={t('common:actions.delete')}
          confirmVariant="@dangerSecondary"
        >
          <MenuItem icon={<LuTrash2 />} color="text-danger">
            {t('common:actions.delete')}
          </MenuItem>
        </ConfirmModal>
      </MenuList>
    </Menu>
  );
};