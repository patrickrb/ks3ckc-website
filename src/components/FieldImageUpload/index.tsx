import React, { useRef, useState } from 'react';

import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputProps,
  Text,
} from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';

import { FormGroup, FormGroupProps } from '@/components/FormGroup';

export type FieldImageUploadProps = FieldProps<string> &
  FormGroupProps & {
    accept?: string;
    inputProps?: InputProps;
  };

export const FieldImageUpload = (props: FieldImageUploadProps) => {
  const field = useField(props);
  const { inputProps = {}, children, accept = 'image/*', ...rest } = field.otherProps;
  const [previewUrl, setPreviewUrl] = useState<string | null>(field.value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formGroupProps = {
    ...rest,
    errorMessage: field.errorMessage,
    id: field.id,
    isRequired: field.isRequired,
    showError: field.shouldDisplayError,
  } satisfies FormGroupProps;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      field.setValue('');
      setPreviewUrl(null);
      return;
    }

    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);

    // In a real application, you would upload the file to a server
    // and set the returned URL as the field value
    // For now, we'll just store the file object as a base64 string
    const reader = new FileReader();
    reader.onload = () => {
      field.setValue(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    field.setValue('');
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <FormGroup {...formGroupProps}>
      <Box>
        <Input
          {...inputProps}
          id={field.id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          ref={fileInputRef}
          display="none"
          onFocus={(e) => {
            field.setIsTouched(false);
            inputProps?.onFocus?.(e);
          }}
          onBlur={(e) => {
            field.setIsTouched(true);
            inputProps?.onBlur?.(e);
          }}
        />
        <Flex direction="column" alignItems="center">
          {previewUrl ? (
            <Box mb={4}>
              <Image 
                src={previewUrl} 
                maxHeight="200px" 
                alt="Blog preview image" 
                borderRadius="md"
              />
            </Box>
          ) : null}
          
          <Flex mt={2}>
            <Button onClick={handleClick} mr={2} size="sm" variant="outline">
              {previewUrl ? 'Change Image' : 'Select Image'}
            </Button>
            {previewUrl && (
              <Button onClick={handleRemove} size="sm" colorScheme="red" variant="outline">
                Remove
              </Button>
            )}
          </Flex>
          
          {!previewUrl && (
            <Text fontSize="sm" color="gray.500" mt={2}>
              Recommended size: 1200x630 pixels
            </Text>
          )}
        </Flex>
      </Box>
      {children}
    </FormGroup>
  );
};