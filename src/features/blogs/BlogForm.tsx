import React from 'react';

import { Stack } from '@chakra-ui/react';
import { z } from 'zod';

import { FieldImageUpload } from '@/components/FieldImageUpload';
import { FieldInput } from '@/components/FieldInput';
import { FieldMarkdown } from '@/components/FieldMarkdown';

export type BlogFormFields = {
  title: string;
  content: string;
  featuredImage?: string;
};

export const BlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional(),
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
      <FieldImageUpload
        name="featuredImage"
        label="Featured Image"
        helper="This image will be displayed on the blog list page"
      />
      <FieldMarkdown
        name="content"
        label="Content (Markdown)"
        required="Content is required"
        helper="You can use Markdown to format your content"
        placeholder="Write your blog content here using Markdown..."
      />
    </Stack>
  );
};
