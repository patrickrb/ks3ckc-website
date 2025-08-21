import React, { Suspense } from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { ADMIN_PATH } from '@/features/admin/constants';
import { LoginForm } from '@/features/auth/LoginForm';
import type { RouterInputs, RouterOutputs } from '@/lib/trpc/types';

function AdminLoginContent() {
  const { t } = useTranslation(['auth']);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOnSuccess = (
    data: RouterOutputs['auth']['login'],
    variables: RouterInputs['auth']['login']
  ) => {
    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set('email', variables.email);
    router.push(
      `${ADMIN_PATH}/login/${data.token}?${urlSearchParams.toString()}`
    );
  };

  return (
    <Card boxShadow="card">
      <CardHeader pb={0}>
        <Heading size="md">{t('auth:login.adminTitle')}</Heading>
      </CardHeader>
      <CardBody>
        <LoginForm onSuccess={handleOnSuccess} />
      </CardBody>
    </Card>
  );
}

export default function PageAdminLogin() {
  return (
    <Suspense
      fallback={
        <Card boxShadow="card">
          <CardBody>
            <Center p={8}>
              <Spinner />
            </Center>
          </CardBody>
        </Card>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
