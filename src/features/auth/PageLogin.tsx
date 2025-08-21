import React, { Suspense } from 'react';

import {
  Button,
  Center,
  Divider,
  HStack,
  Heading,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { LinkApp } from '@/features/app/LinkApp';
import { APP_PATH } from '@/features/app/constants';
import { LoginForm } from '@/features/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import type { RouterInputs, RouterOutputs } from '@/lib/trpc/types';

function LoginContent() {
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshAuth } = useAuth();

  const handleOnSuccess = (
    data: RouterOutputs['auth']['login'],
    variables: RouterInputs['auth']['login']
  ) => {
    // Refresh auth state to trigger navbar update
    refreshAuth();

    const urlSearchParams = new URLSearchParams(searchParams.toString());
    urlSearchParams.set('email', variables.email);
    router.push(
      `${APP_PATH}/login/${data.token}?${urlSearchParams.toString()}`
    );
  };

  return (
    <Stack spacing={6}>
      <Stack spacing={1}>
        <Heading size="md">{t('auth:login.appTitle')}</Heading>
        <Text fontSize="sm" color="text-dimmed">
          {t('auth:login.appSubTitle')}
        </Text>
      </Stack>

      <Button variant="@primary" size="lg" as={LinkApp} href="/register">
        {t('auth:login.actions.register')}
      </Button>

      <HStack>
        <Divider flex={1} />
        <Text
          fontSize="xs"
          color="gray.400"
          fontWeight="bold"
          textTransform="uppercase"
        >
          {t('common:or')}
        </Text>
        <Divider flex={1} />
      </HStack>

      <LoginForm onSuccess={handleOnSuccess} buttonVariant="@secondary" />
    </Stack>
  );
}

export default function PageLogin() {
  const { t } = useTranslation(['auth', 'common']);

  return (
    <Suspense
      fallback={
        <Stack spacing={6}>
          <Stack spacing={1}>
            <Heading size="md">{t('auth:login.appTitle')}</Heading>
            <Text fontSize="sm" color="text-dimmed">
              {t('auth:login.appSubTitle')}
            </Text>
          </Stack>
          <Center p={8}>
            <Spinner />
          </Center>
        </Stack>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
