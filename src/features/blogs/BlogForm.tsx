import React from 'react';

import { Divider, Stack } from '@chakra-ui/react';
import { z } from 'zod';

import { BlogImageManager } from '@/components/BlogImageManager';
import { FieldImageUpload } from '@/components/FieldImageUpload';
import { FieldInput } from '@/components/FieldInput';
import { FieldMarkdown } from '@/components/FieldMarkdown';
import { FieldTags } from '@/components/FieldTags';

export type BlogFormFields = {
  title: string;
  content: string;
  featuredImage?: string;
  tags: string[];
};

export const BlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

interface BlogFormProps {
  blogId?: string;
}

export const BlogForm = ({ blogId }: BlogFormProps) => {
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
      <FieldTags
        name="tags"
        label="Tags"
        helper="Add tags to categorize your blog post. Type a tag and press Enter or comma to add it."
        placeholder="Type a tag and press Enter"
      />
      <FieldMarkdown
        name="content"
        label="Content (Markdown)"
        required="Content is required"
        helper="You can use Markdown to format your content"
        placeholder="Write your blog content here using Markdown..."
        blogId={blogId}
      />
      {blogId && (
        <>
          <Divider />
          <BlogImageManager blogId={blogId} />
        </>
      )}
    </Stack>
  );
};
