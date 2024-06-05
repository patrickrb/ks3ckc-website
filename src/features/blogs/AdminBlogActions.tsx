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

export type AdminBlogActionProps = Omit<MenuProps, 'children'> & {
  blog: RouterOutputs['blogs']['getAll']['items'][number];
};

export const AdminBlogActions = ({ blog, ...rest }: AdminBlogActionProps) => {
  const { t } = useTranslation(['common', 'users']);
  const trpcUtils = trpc.useUtils();

  const toastError = useToastError();

  const removeBlog = trpc.blogs.removeById.useMutation({
    onSuccess: async () => {
      await trpcUtils.blogs.getAll.invalidate();
    },
    onError: () => {
      toastError({
        title: t('users:feedbacks.deleteUserError.title'),
        description: `Error removing blog: ${blog.id}`,
      });
    },
  });

  const isLoading = removeBlog.isLoading;

  return (
    <Menu placement="left-start" {...rest}>
      <MenuButton as={ActionsButton} isLoading={isLoading} />
      <Portal>
        <MenuList>
          <MenuItem
            as={LinkAdmin}
            href={`/management/blogs/${blog.id}`}
            icon={<Icon icon={LuPenLine} fontSize="lg" color="gray.400" />}
          >
            {t('common:actions.edit')}
          </MenuItem>

          <>
            <ConfirmModal
              title={t('users:deleteModal.title')}
              message={t('users:deleteModal.message', {
                name: blog.title,
              })}
              onConfirm={() => removeBlog.mutate({ id: blog.id })}
              confirmText={t('common:actions.delete')}
              confirmVariant="@dangerSecondary"
            >
              <MenuItem
                icon={<Icon icon={LuTrash2} fontSize="lg" color="gray.400" />}
              >
                {t('common:actions.delete')}
              </MenuItem>
            </ConfirmModal>
          </>
        </MenuList>
      </Portal>
    </Menu>
  );
};
