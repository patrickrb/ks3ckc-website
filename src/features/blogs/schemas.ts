import { z } from 'zod';

export const zBlog = () =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    title: z.string(),
    content: z.string(),
    authorId: z.string(),
  });
