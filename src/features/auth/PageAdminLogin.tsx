import React, { Suspense } from 'react';

import {
  Box,
  Button,
  Center,
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
  phosInputProps,
} from '@/components/HomeRedesign/phosphorTheme';
import { useToastError } from '@/components/Toast';
import { ADMIN_PATH } from '@/features/admin/constants';
import { DevLoginHint } from '@/features/devtools/DevLoginHint';
import { trpc } from '@/lib/trpc/client';
import type { RouterInputs, RouterOutputs } from '@/lib/trpc/types';

function AdminLoginContent() {
  const { t } = useTranslation(['auth']);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toastError = useToastError();

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
          <Text color={PHOS.amber} fontSize="13px" fontFamily={PHOS.mono}>
            sudo ssh ks3ckc.org
          </Text>
          <Box
            as="span"
            display="inline-block"
            color={PHOS.amber}
            animation={`${blink} 1s steps(1) infinite`}
          >
            █
          </Box>
        </HStack>
        <Text
          as="h1"
          fontSize={{ base: '22px', md: '28px' }}
          color={PHOS.paper}
          fontWeight="700"
          lineHeight="1.1"
          textShadow="0 0 12px rgba(255,176,0,0.25)"
          fontFamily={PHOS.mono}
        >
          {t('auth:login.adminTitle')}
        </Text>
      </Box>

      <PhosPanel title="admin.session" meta="elevated">
        <Box
          px={{ base: 4, md: 5 }}
          py={{ base: 4, md: 5 }}
          fontFamily={PHOS.mono}
        >
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
                inputProps={{
                  ...phosInputProps,
                  borderColor: PHOS.amber,
                  _hover: { borderColor: PHOS.amber },
                  _focus: {
                    borderColor: PHOS.amber,
                    boxShadow: `0 0 0 1px ${PHOS.amber}`,
                    bg: PHOS.bg,
                  },
                }}
              />
              <Button
                isLoading={login.isLoading || login.isSuccess}
                isDisabled={form.isSubmitted && !form.isValid}
                type="submit"
                size="lg"
                w="100%"
                bg={PHOS.amber}
                color={PHOS.bg}
                borderRadius={0}
                fontFamily={PHOS.mono}
                fontWeight={700}
                letterSpacing="0.02em"
                border="1px solid"
                borderColor={PHOS.amber}
                _hover={{ bg: PHOS.amberD, borderColor: PHOS.amberD }}
              >
                ▶ {t('auth:login.actions.login')}
              </Button>
              <DevLoginHint />
            </Stack>
          </Formiz>
        </Box>
      </PhosPanel>
    </Stack>
  );
}

export default function PageAdminLogin() {
  return (
    <Suspense
      fallback={
        <PhosPanel title="admin.session" meta="loading…">
          <Center py={10}>
            <Spinner color={PHOS.amber} />
          </Center>
        </PhosPanel>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
