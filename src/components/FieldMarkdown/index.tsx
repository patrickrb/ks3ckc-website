import React from 'react';

import { Textarea, TextareaProps } from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';

import { FormGroup, FormGroupProps } from '@/components/FormGroup';

type Value = TextareaProps['value'];

type UsualTextareaProps = 'placeholder';

export type FieldMarkdownProps<FormattedValue = Value> = FieldProps<
  Value,
  FormattedValue
> &
  FormGroupProps &
  Pick<TextareaProps, UsualTextareaProps> & {
    textareaProps?: Omit<TextareaProps, UsualTextareaProps>;
  };

export const FieldMarkdown = <FormattedValue = Value,>(
  props: FieldMarkdownProps<FormattedValue>
) => {
  const field = useField(props);

  const { textareaProps, children, placeholder, ...rest } = field.otherProps;

  const formGroupProps = {
    ...rest,
    errorMessage: field.errorMessage,
    id: field.id,
    isRequired: field.isRequired,
    showError: field.shouldDisplayError,
  } satisfies FormGroupProps;

  return (
    <FormGroup {...formGroupProps}>
      <Textarea
        {...textareaProps}
        placeholder={placeholder || 'Enter markdown content... (supports **bold**, *italic*, and more)'}
        id={field.id}
        value={field.value ?? ''}
        onChange={(e) => {
          field.setValue(e.target.value);
          textareaProps?.onChange?.(e);
        }}
        onFocus={(e) => {
          field.setIsTouched(false);
          textareaProps?.onFocus?.(e);
        }}
        onBlur={(e) => {
          field.setIsTouched(true);
          textareaProps?.onBlur?.(e);
        }}
        minHeight="400px"
        fontFamily="mono"
      />
      {field.value && (
        <div className="markdown-help" style={{ marginTop: '8px', fontSize: '0.8rem' }}>
          <p>Markdown syntax:</p>
          <ul style={{ marginLeft: '1rem', listStyleType: 'disc' }}>
            <li><code>**bold**</code> for <strong>bold</strong></li>
            <li><code>*italic*</code> for <em>italic</em></li>
            <li><code>[link](https://example.com)</code> for links</li>
            <li><code>![image alt](image-url.jpg)</code> for images</li>
            <li><code># Heading</code> for headings (# to #####)</li>
            <li><code>- item</code> for bullet lists</li>
          </ul>
        </div>
      )}
      {children}
    </FormGroup>
  );
};