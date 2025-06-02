import { z } from 'zod';

import { zUser } from '@/features/users/schemas';

export const zNews = () =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    title: z.string(),
    content: z.string(),
    authorId: z.string(),
    author: zUser(),
  });