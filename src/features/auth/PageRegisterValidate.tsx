import React from 'react';

import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';

import PhosPanel from '@/components/HomeRedesign/PhosPanel';
import {
  PHOS,
  blink,
  phosGhostBtn,
} from '@/components/HomeRedesign/phosphorTheme';
import { APP_PATH } from '@/features/app/constants';
import {
  VerificationCodeForm,
  useOnVerificationCodeError,
  useOnVerificationCodeSuccess,
} from '@/features/auth/VerificationCodeForm';
import { useRtl } from '@/hooks/useRtl';
import { trpc } from '@/lib/trpc/client';

export default function PageRegisterValidate() {
  const { t } = useTranslation(['common']);
  const { rtlValue } = useRtl();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const token = params?.token?.toString() ?? '';
  const email = searchParams.get('email');

  const form = useForm<{ code: string }>({
    onValidSubmit: (values) => validate.mutate({ ...values, token }),
  });

  const onVerificationCodeSuccess = useOnVerificationCodeSuccess({
    defaultRedirect: APP_PATH,
  });
  const onVerificationCodeError = useOnVerificationCodeError({ form });

  const validate = trpc.auth.registerValidate.useMutation({
    onSuccess: onVerificationCodeSuccess,
    onError: onVerificationCodeError,
  });

  return (
    <Stack spacing={5}>
      <Box>
        <HStack spacing={2} mb={2}>
          <Text color={PHOS.greenDim} fontSize="13px" fontFamily={PHOS.mono}>
            $
          </Text>
          <Text color={PHOS.green} fontSize="13px" fontFamily={PHOS.mono}>
            verify --register
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
      </Box>

      <PhosPanel title="auth.verify" meta="6-digit code">
        <Box
          px={{ base: 4, md: 5 }}
          py={{ base: 4, md: 5 }}
          fontFamily={PHOS.mono}
        >
          <Stack spacing={4}>
            <Button
              me="auto"
              size="sm"
              leftIcon={rtlValue(<LuArrowLeft />, <LuArrowRight />)}
              onClick={() => router.back()}
              {...phosGhostBtn}
            >
              {t('common:actions.back')}
            </Button>
            <Formiz connect={form} autoForm>
              <VerificationCodeForm
                email={email ?? ''}
                isLoading={validate.isLoading || validate.isSuccess}
              />
            </Formiz>
          </Stack>
        </Box>
      </PhosPanel>
    </Stack>
  );
}
