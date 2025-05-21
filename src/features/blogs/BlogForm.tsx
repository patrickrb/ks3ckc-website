import React from 'react';

import { Stack } from '@chakra-ui/react';
import { FieldProps, FormizStep } from '@formiz/core';
import { z } from 'zod';

import { FieldInput } from '@/components/FieldInput';
import { FieldTextarea } from '@/components/FieldTextarea';

export type BlogFormFields = {
  title: string;
  content: string;
};

export const BlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export const BlogForm = () => {
  return (
    <Stack spacing={4}>
      <FieldInput
        name="title"
        label="Title"
        required="Title is required"
        placeholder="Enter blog title"
      />
      <FieldTextarea
        name="content"
        label="Content"
        required="Content is required"
        placeholder="Write your blog content here..."
        textareaProps={{
          minHeight: '300px',
        }}
      />
    </Stack>
  );
};