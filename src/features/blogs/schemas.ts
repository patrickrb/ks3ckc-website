import { z } from 'zod';

import { zUser } from '@/features/users/schemas';

export const zBlog = () =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    title: z.string(),
    content: z.string(),
    featuredImage: z.string().nullish(),
    tags: z.array(z.string()).default([]),
    authorId: z.string(),
    author: zUser(),
  });
