import { z } from 'zod';

import { zUser } from '@/features/users/schemas';

export type UserAccount = z.infer<ReturnType<typeof zUserAccount>>;
export const zUserAccount = () =>
  zUser().pick({
    id: true,
    name: true,
    email: true,
    callsign: true,
    dmrid: true,
    isPubliclyVisible: true,
    notes: true,
    authorizations: true,
    language: true,
    image: true,
  });
