import React from 'react';

import { Stack } from '@chakra-ui/react';
import { z } from 'zod';

import { FieldInput } from '@/components/FieldInput';
import { FieldTextarea } from '@/components/FieldTextarea';

export type NewsFormFields = {
  title: string;
  content: string;
};

export const NewsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export const NewsForm = () => {
  return (
    <Stack spacing={4}>
      <FieldInput
        name="title"
        label="Title"
        required="Title is required"
        placeholder="Enter news title"
      />
      <FieldTextarea
        name="content"
        label="Content"
        required="Content is required"
        placeholder="Write your news content here..."
        rows={6}
      />
    </Stack>
  );
};