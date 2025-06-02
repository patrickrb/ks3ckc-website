import React from 'react';

import { Button, ButtonGroup, HStack, VStack } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { isMaxLength, isMinLength, isRequired } from '@formiz/validations';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { FieldBooleanCheckbox } from '@/components/FieldBooleanCheckbox';
import { FieldInput } from '@/components/FieldInput';
import { FieldTextarea } from '@/components/FieldTextarea';

import { EventFormFields } from './schemas';

export type EventFormProps = {
  defaultValues?: Partial<EventFormFields>;
  onSubmit: (values: EventFormFields) => void;
  onCancel?: () => void;
  isLoading?: boolean;
};

export const EventForm = ({
  defaultValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
}: EventFormProps) => {
  const { t } = useTranslation(['common', 'events']);

  const form = useForm({
    onValidSubmit: (values) => {
      onSubmit({
        ...values,
        date: new Date(values.date),
      });
    },
  });

  const formatDateForInput = (date: Date | string | undefined) => {
    if (!date) return '';
    return dayjs(date).format('YYYY-MM-DDTHH:mm');
  };

  return (
    <Formiz connect={form}>
      <form noValidate onSubmit={form.submit}>
        <VStack spacing={6} align="stretch">
          <FieldInput
            name="name"
            label={t('events:form.name.label')}
            placeholder={t('events:form.name.placeholder')}
            defaultValue={defaultValues.name}
            required={t('events:form.name.required')}
            validations={[
              {
                handler: isRequired(),
                message: t('events:form.name.required'),
              },
              {
                handler: isMinLength(2),
                message: t('events:form.name.tooShort'),
              },
              {
                handler: isMaxLength(100),
                message: t('events:form.name.tooLong'),
              },
            ]}
          />

          <FieldInput
            name="date"
            type="datetime-local"
            label={t('events:form.date.label')}
            defaultValue={formatDateForInput(defaultValues.date)}
            required={t('events:form.date.required')}
            validations={[
              {
                handler: isRequired(),
                message: t('events:form.date.required'),
              },
            ]}
          />

          <HStack spacing={4}>
            <FieldInput
              name="startTime"
              label={t('events:form.startTime.label')}
              placeholder={t('events:form.startTime.placeholder')}
              defaultValue={defaultValues.startTime}
            />

            <FieldInput
              name="endTime"
              label={t('events:form.endTime.label')}
              placeholder={t('events:form.endTime.placeholder')}
              defaultValue={defaultValues.endTime}
            />
          </HStack>

          <FieldInput
            name="location"
            label={t('events:form.location.label')}
            placeholder={t('events:form.location.placeholder')}
            defaultValue={defaultValues.location}
          />

          <FieldInput
            name="address"
            label={t('events:form.address.label')}
            placeholder={t('events:form.address.placeholder')}
            defaultValue={defaultValues.address}
          />

          <FieldInput
            name="mapUrl"
            label={t('events:form.mapUrl.label')}
            placeholder={t('events:form.mapUrl.placeholder')}
            defaultValue={defaultValues.mapUrl}
          />

          <FieldInput
            name="embedMapUrl"
            label={t('events:form.embedMapUrl.label')}
            placeholder={t('events:form.embedMapUrl.placeholder')}
            defaultValue={defaultValues.embedMapUrl}
          />

          <FieldTextarea
            name="description"
            label={t('events:form.description.label')}
            placeholder={t('events:form.description.placeholder')}
            defaultValue={defaultValues.description}
            textareaProps={{ rows: 4 }}
          />

          <FieldBooleanCheckbox
            name="isActive"
            label={t('events:form.isActive.label')}
            defaultValue={defaultValues.isActive !== false}
            optionLabel={t('events:form.isActive.label')}
          />

          <ButtonGroup justifyContent="space-between" w="full">
            <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
              {t('common:actions.cancel')}
            </Button>
            <Button type="submit" colorScheme="brand" isLoading={isLoading}>
              {t('common:actions.save')}
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </Formiz>
  );
};
