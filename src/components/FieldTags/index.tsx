import React, { KeyboardEvent, useState } from 'react';

import {
  Box,
  Input,
  InputGroup,
  InputProps,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';

import { FormGroup, FormGroupProps } from '@/components/FormGroup';

type Value = string[];

type UsualInputProps = 'placeholder' | 'autoFocus';

export type FieldTagsProps<FormattedValue = Value> = FieldProps<
  Value,
  FormattedValue
> &
  FormGroupProps &
  Pick<InputProps, UsualInputProps> & {
    inputProps?: Omit<InputProps, UsualInputProps>;
  };

export const FieldTags = <FormattedValue = Value,>(
  props: FieldTagsProps<FormattedValue>
) => {
  const field = useField(props);
  const [inputValue, setInputValue] = useState('');

  const { inputProps, children, placeholder, autoFocus, ...rest } =
    field.otherProps;

  const formGroupProps = {
    ...rest,
    errorMessage: field.errorMessage,
    id: field.id,
    isRequired: field.isRequired,
    showError: field.shouldDisplayError,
  };

  const tags = field.value || [];

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      field.setValue([...tags, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    field.setValue(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      const lastTag = tags[tags.length - 1];
      if (lastTag) {
        removeTag(lastTag);
      }
    }
  };

  const handleInputBlur = () => {
    field.setIsTouched(true);
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <FormGroup {...formGroupProps}>
      <Box>
        {tags.length > 0 && (
          <Wrap spacing={2} mb={2}>
            {tags.map((tag, index) => (
              <WrapItem key={index}>
                <Tag size="md" variant="solid" colorScheme="orange">
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => removeTag(tag)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}
        <InputGroup size={inputProps?.size}>
          <Input
            {...inputProps}
            id={field.id}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => field.setIsTouched(false)}
            onBlur={handleInputBlur}
            placeholder={
              placeholder ? String(placeholder) : 'Type a tag and press Enter'
            }
            autoFocus={autoFocus}
          />
        </InputGroup>
      </Box>
      {children}
    </FormGroup>
  );
};
