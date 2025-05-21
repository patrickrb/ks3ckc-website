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
import { isErrorDatabaseConflict } from '@/lib/trpc/errors';

import { BlogForm, BlogFormFields } from './BlogForm';

export default function PageAdminBlogCreate() {
  const { t } = useTranslation(['common', 'users']);
  const router = useRouter();

  const toastError = useToastError();
  const toastSuccess = useToastSuccess();

  const blogCreate = trpc.blogs.create.useMutation({
    onSuccess: () => {
      router.push('/admin/management/blogs');
      toastSuccess({
        title: 'Blog created successfully',
      });
    },
    onError: (error) => {
      if (isErrorDatabaseConflict(error, 'title')) {
        toastError({
          title: 'A blog with this title may already exist',
        });
        return;
      }
      toastError({
        title: 'Failed to create blog',
      });
    },
  });

  const form = useForm<BlogFormFields>({
    onValidSubmit: (values) => {
      blogCreate.mutate({
        title: values.title,
        content: values.content,
        author: { id: '', email: '', createdAt: new Date(), updatedAt: new Date() }, // This field will be ignored on the server as the author is taken from the context
      });
    },
  });

  return (
    <Formiz connect={form} autoForm>
      <AdminLayoutPage containerMaxWidth="container.md" showNavBar={false}>
        <AdminLayoutPageTopBar
          leftActions={<AdminBackButton />}
          rightActions={
            <>
              <AdminCancelButton />
              <Button
                type="submit"
                variant="@primary"
                isLoading={blogCreate.isLoading}
                isDisabled={!form.isValid && form.isSubmitted}
              >
                {t('common:actions.create', 'Create')}
              </Button>
            </>
          }
        >
          <Heading size="sm">Create New Blog</Heading>
        </AdminLayoutPageTopBar>
        <AdminLayoutPageContent>
          <BlogForm />
        </AdminLayoutPageContent>
      </AdminLayoutPage>
    </Formiz>
  );
}
