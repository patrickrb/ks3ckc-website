import React, { useEffect } from 'react';

import { Box, Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { Formiz, useForm, useFormFields } from '@formiz/core';
import { isEmail } from '@formiz/validations';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { FieldInput } from '@/components/FieldInput';
import { FieldSelect } from '@/components/FieldSelect';
import PhosPanel from '@/components/HomeRedesign/PhosPanel';
import {
  PHOS,
  blink,
  phosInputProps,
  phosPrimaryBtn,
} from '@/components/HomeRedesign/phosphorTheme';
import { useToastError } from '@/components/Toast';
import { LinkApp } from '@/features/app/LinkApp';
import { APP_PATH } from '@/features/app/constants';
import { DemoRegisterHint } from '@/features/demo-mode/DemoRegisterHint';
import { AVAILABLE_LANGUAGES, Language } from '@/lib/i18n/constants';
import { trpc } from '@/lib/trpc/client';

export default function PageRegister() {
  const { t, i18n } = useTranslation(['common', 'auth']);

  const toastError = useToastError();
  const router = useRouter();

  const register = trpc.auth.register.useMutation({
    onSuccess: (data, variables) => {
      router.push(
        `${APP_PATH}/register/${data.token}?email=${variables.email}`
      );
    },
    onError: () => {
      toastError({
        title: t('auth:register.feedbacks.registrationError.title'),
      });
    },
  });

  const form = useForm<{
    language: string;
    name: string;
    email: string;
  }>({
    onValidSubmit: (values) => register.mutate(values),
  });

  const values = useFormFields({
    connect: form,
    fields: ['language'] as const,
    selector: (field) => field.value,
  });

  useEffect(() => {
    i18n.changeLanguage(values?.language);
  }, [i18n, values?.language]);

  return (
    <Stack spacing={5}>
      <Box>
        <HStack spacing={2} mb={2}>
          <Text color={PHOS.greenDim} fontSize="13px" fontFamily={PHOS.mono}>
            $
          </Text>
          <Text color={PHOS.green} fontSize="13px" fontFamily={PHOS.mono}>
            useradd --new
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
          {t('auth:register.title')}
        </Text>
        <Box
          mt={2}
          fontSize="13px"
          color={PHOS.paper}
          opacity={0.75}
          fontFamily={PHOS.mono}
        >
          <Text as="span">
            {t('auth:register.actions.alreadyHaveAnAccount')}{' '}
          </Text>
          <Button
            as={LinkApp}
            href="/login"
            variant="link"
            size="sm"
            color={PHOS.green}
            fontFamily={PHOS.mono}
            fontWeight="700"
            textDecoration="underline"
            textUnderlineOffset="3px"
            _hover={{ color: PHOS.greenD }}
          >
            {t('auth:register.actions.login')}
          </Button>
        </Box>
      </Box>

      <PhosPanel title="useradd ./operator" meta="3 fields">
        <Box
          px={{ base: 4, md: 5 }}
          py={{ base: 4, md: 5 }}
          fontFamily={PHOS.mono}
        >
          <Formiz connect={form} autoForm>
            <Stack spacing={4}>
              <FieldSelect
                name="language"
                label={t('auth:data.language.label')}
                options={AVAILABLE_LANGUAGES.map(({ key }) => ({
                  label: t(`common:languages.${key}`),
                  value: key,
                }))}
                defaultValue={i18n.language as Language['key']}
                selectProps={{
                  chakraStyles: {
                    control: (provided) => ({
                      ...provided,
                      bg: PHOS.bg,
                      borderColor: PHOS.line2,
                      borderRadius: 0,
                      color: PHOS.paper,
                      _hover: { borderColor: PHOS.greenDim },
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      bg: PHOS.panel,
                      borderRadius: 0,
                      borderColor: PHOS.line2,
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      bg: state.isFocused ? PHOS.greenDeep : PHOS.panel,
                      color: state.isSelected ? PHOS.green : PHOS.paper,
                      borderRadius: 0,
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: PHOS.paper,
                    }),
                    input: (provided) => ({
                      ...provided,
                      color: PHOS.paper,
                    }),
                  },
                }}
              />
              <FieldInput
                name="name"
                label={t('auth:data.name.label')}
                required={t('auth:data.name.required')}
                inputProps={phosInputProps}
              />
              <FieldInput
                name="email"
                label={t('auth:data.email.label')}
                required={t('auth:data.email.required')}
                validations={[
                  {
                    handler: isEmail(),
                    message: t('auth:data.email.invalid'),
                  },
                ]}
                inputProps={phosInputProps}
              />
              <Flex>
                <Button
                  isLoading={register.isLoading}
                  isDisabled={form.isSubmitted && !form.isValid}
                  type="submit"
                  flex={1}
                  size="lg"
                  {...phosPrimaryBtn}
                >
                  ▶ {t('auth:register.actions.create')}
                </Button>
              </Flex>
              <DemoRegisterHint loginPath={`${APP_PATH}/login`} />
            </Stack>
          </Formiz>
        </Box>
      </PhosPanel>
    </Stack>
  );
}
