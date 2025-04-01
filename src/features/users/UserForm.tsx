import React from 'react';

import { Stack } from '@chakra-ui/react';
import { isEmail } from '@formiz/validations';
import { useTranslation } from 'react-i18next';

import { FieldBooleanCheckbox } from '@/components/FieldBooleanCheckbox';
import { FieldInput } from '@/components/FieldInput';
import { FieldSelect } from '@/components/FieldSelect';
import { FieldTextarea } from '@/components/FieldTextarea';
import {
  USER_AUTHORIZATIONS,
  UserAuthorization,
} from '@/features/users/schemas';
import {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE_KEY,
} from '@/lib/i18n/constants';

export type UserFormFields = {
  name: string;
  email: string;
  language: string;
  authorizations: UserAuthorization[];
  callsign?: string;
  dmrid?: string;
  isPubliclyVisible: boolean;
  notes?: string;
};

export const UserForm = () => {
  const { t } = useTranslation(['common', 'users']);

  return (
    <Stack spacing={4}>
      <FieldInput
        name="name"
        required={t('users:data.name.required')}
        label={t('users:data.name.label')}
      />
      <FieldInput
        name="email"
        label={t('users:data.email.label')}
        required={t('users:data.email.required')}
        validations={[
          {
            handler: isEmail(),
            message: t('users:data.email.invalid'),
          },
        ]}
      />
      <FieldInput
        name="callsign"
        label={t('users:data.callsign.label') || 'Callsign'}
      />
      <FieldInput
        name="dmrid"
        label={t('users:data.dmrid.label') || 'DMR ID'}
        type="number"
        validations={[
          {
            handler: (value) =>
              !value ||
              (Number(value) <= 2147483647 && Number(value) >= -2147483648),
            message:
              t('users:data.dmrid.invalidRange') ||
              'DMR ID must be between -2147483648 and 2147483647',
          },
        ]}
      />
      <FieldBooleanCheckbox
        name="isPubliclyVisible"
        label={t('users:data.isPubliclyVisible.label') || 'Public Visibility'}
        optionLabel={
          t('users:data.isPubliclyVisible.label') ||
          'Make user publicly visible'
        }
      />
      <FieldTextarea
        name="notes"
        label={t('users:data.notes.label') || 'Notes'}
        textareaProps={{ rows: 4 }}
      />
      <FieldSelect
        name="language"
        label={t('users:data.language.label')}
        options={AVAILABLE_LANGUAGES.map(({ key }) => ({
          label: t(`common:languages.${key}`),
          value: key,
        }))}
        defaultValue={DEFAULT_LANGUAGE_KEY}
      />
      <FieldSelect
        name="authorizations"
        label={t('users:data.authorizations.label')}
        required={t('users:data.authorizations.required')}
        options={USER_AUTHORIZATIONS.map((authorization) => ({
          value: authorization,
          label: t(`users:data.authorizations.options.${authorization}`),
        }))}
        isMulti
        defaultValue={['APP']}
      />
    </Stack>
  );
};
