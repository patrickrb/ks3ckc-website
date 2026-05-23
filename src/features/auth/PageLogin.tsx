import React, { Suspense } from 'react';

import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { isEmail } from '@formiz/validations';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { FieldInput } from '@/components/FieldInput';
import PhosPanel from '@/components/HomeRedesign/PhosPanel';
import {
  PHOS,
  blink,
  phosGhostBtn,
  phosInputProps,
  phosPrimaryBtn,
} from '@/components/HomeRedesign/phosphorTheme';
import { useToastError } from '@/components/Toast';
import { LinkApp } from '@/features/app/LinkApp';
import { APP_PATH } from '@/features/app/constants';
import { DevLoginHint } from '@/features/devtools/DevLoginHint';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc/client';
import type { RouterInputs, RouterOutputs } from '@/lib/trpc/types';

function LoginContent() {
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshAuth } = useAuth();
  const toastError = useToastError();

  const handleOnSuccess = (
    data: RouterOutputs['auth']['login'],
    variables: RouterInputs['auth']['login']
  ) => {
    refreshAuth();
    const urlSearchParams = new URLSearchParams(searchParams.toString());
    urlSearchParams.set('email', variables.email);
    router.push(
      `${APP_PATH}/login/${data.token}?${urlSearchParams.toString()}`
    );
  };

  const login = trpc.auth.login.useMutation({
    onSuccess: handleOnSuccess,
    onError: () => {
      toastError({ title: t('auth:login.feedbacks.loginError.title') });
    },
  });

  const form = useForm<{ email: string }>({
    onValidSubmit: (values) => login.mutate(values),
  });

  return (
    <Stack spacing={5}>
      <Box>
        <HStack spacing={2} mb={2}>
          <Text color={PHOS.greenDim} fontSize="13px" fontFamily={PHOS.mono}>
            $
          </Text>
          <Text color={PHOS.green} fontSize="13px" fontFamily={PHOS.mono}>
            ssh ks3ckc.org
          </Text>
          <Box
            as="span"
            display="inline-block"
            color={PHOS.green}
            animation={`${blink} 1s steps(1) infinite`}
          >
            █
          </Box>
        </HStack>
        <Text
          as="h1"
          fontSize={{ base: '24px', md: '30px' }}
          color={PHOS.paper}
          fontWeight="700"
          lineHeight="1.1"
          textShadow="0 0 12px rgba(57,255,20,0.25)"
          fontFamily={PHOS.mono}
        >
          {t('auth:login.appTitle')}
        </Text>
        <Text
          mt={2}
          fontSize="13px"
          color={PHOS.paper}
          opacity={0.75}
          fontFamily={PHOS.mono}
        >
          {t('auth:login.appSubTitle')}
        </Text>
      </Box>

      <PhosPanel title="auth.session" meta="passwordless">
        <Box
          px={{ base: 4, md: 5 }}
          py={{ base: 4, md: 5 }}
          fontFamily={PHOS.mono}
        >
          <Stack spacing={5}>
            <Box>
              <Text
                fontSize="11px"
                color={PHOS.greenDim}
                textTransform="uppercase"
                letterSpacing="0.14em"
                mb={2}
              >
                {'// new operator?'}
              </Text>
              <Button
                as={LinkApp}
                href="/register"
                size="lg"
                w="100%"
                {...phosPrimaryBtn}
              >
                ▶ {t('auth:login.actions.register')}
              </Button>
            </Box>

            <Flex align="center" gap={3}>
              <Box flex={1} borderTop="1px dashed" borderColor={PHOS.line2} />
              <Text
                fontSize="10px"
                color={PHOS.greenDim}
                textTransform="uppercase"
                letterSpacing="0.18em"
              >
                {t('common:or')}
              </Text>
              <Box flex={1} borderTop="1px dashed" borderColor={PHOS.line2} />
            </Flex>

            <Box>
              <Text
                fontSize="11px"
                color={PHOS.greenDim}
                textTransform="uppercase"
                letterSpacing="0.14em"
                mb={2}
              >
                {'// existing operator — sign in'}
              </Text>
              <Formiz autoForm connect={form}>
                <Stack spacing={3}>
                  <FieldInput
                    name="email"
                    size="lg"
                    required={t('auth:data.email.required')}
                    validations={[
                      {
                        handler: isEmail(),
                        message: t('auth:data.email.invalid'),
                      },
                    ]}
                    formatValue={(v) => v?.toString()?.toLowerCase().trim()}
                    placeholder={t('auth:data.email.label')}
                    inputProps={phosInputProps}
                  />
                  <Button
                    isLoading={login.isLoading || login.isSuccess}
                    isDisabled={form.isSubmitted && !form.isValid}
                    type="submit"
                    size="lg"
                    w="100%"
                    {...phosGhostBtn}
                  >
                    {t('auth:login.actions.login')} →
                  </Button>
                  <DevLoginHint />
                </Stack>
              </Formiz>
            </Box>
          </Stack>
        </Box>
      </PhosPanel>
    </Stack>
  );
}

export default function PageLogin() {
  const { t } = useTranslation(['auth']);

  return (
    <Suspense
      fallback={
        <PhosPanel title="auth.session" meta="loading…">
          <Center py={10}>
            <Spinner color={PHOS.green} />
          </Center>
          <Text
            pb={4}
            textAlign="center"
            fontFamily={PHOS.mono}
            color={PHOS.greenDim}
            fontSize="12px"
          >
            $ {t('auth:login.appTitle')}
          </Text>
        </PhosPanel>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
