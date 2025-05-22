import React, { useState } from 'react';

import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  TextareaProps,
} from '@chakra-ui/react';
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
  const [tabIndex, setTabIndex] = useState(0);

  const { textareaProps, children, placeholder, ...rest } = field.otherProps;

  const formGroupProps = {
    ...rest,
    errorMessage: field.errorMessage,
    id: field.id,
    isRequired: field.isRequired,
    showError: field.shouldDisplayError,
  } satisfies FormGroupProps;

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  // A simple markdown renderer
  const renderMarkdown = (markdown: string) => {
    if (!markdown) return null;

    const processedMarkdown = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
      // Lists
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n/gim, '<br />');

    return (
      <Box
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: processedMarkdown }}
      />
    );
  };

  return (
    <FormGroup {...formGroupProps}>
      <Tabs variant="enclosed" index={tabIndex} onChange={handleTabsChange}>
        <TabList>
          <Tab>Edit</Tab>
          <Tab>Preview</Tab>
        </TabList>
        <TabPanels>
          <TabPanel padding={0} paddingTop={4}>
            <Textarea
              {...textareaProps}
              placeholder={
                placeholder ||
                'Enter markdown content... (supports **bold**, *italic*, and more)'
              }
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
            {tabIndex === 0 && (
              <div
                className="markdown-help"
                style={{ marginTop: '8px', fontSize: '0.8rem' }}
              >
                <p>Markdown syntax:</p>
                <ul style={{ marginLeft: '1rem', listStyleType: 'disc' }}>
                  <li>
                    <code>**bold**</code> for <strong>bold</strong>
                  </li>
                  <li>
                    <code>*italic*</code> for <em>italic</em>
                  </li>
                  <li>
                    <code>[link](https://example.com)</code> for links
                  </li>
                  <li>
                    <code>![image alt](image-url.jpg)</code> for images
                  </li>
                  <li>
                    <code># Heading</code> for headings (# to #####)
                  </li>
                  <li>
                    <code>- item</code> for bullet lists
                  </li>
                </ul>
              </div>
            )}
          </TabPanel>
          <TabPanel padding={0} paddingTop={4}>
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              minHeight="400px"
              bg="white"
              color="gray.800"
            >
              {renderMarkdown(field.value?.toString() || '')}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      {children}
    </FormGroup>
  );
};
