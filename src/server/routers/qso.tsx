import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/config/trpc';

export const qsoRouter = createTRPCRouter({
  getRecent: protectedProcedure({ authorizations: ['APP', 'ADMIN'] })
    .input(z.void())
    .meta({
      openapi: {
        method: 'GET',
        path: '/recentContacts',
        protect: true,
        tags: ['recentContacts'],
      },
    })
    .query(async ({ ctx }) => {
      ctx.logger.info('Getting recent qsos');
      const apiURL = `${process.env.NEXT_PUBLIC_CLOUDLOG_API_URL}/recent_qsos/${process.env.NEXT_PUBLIC_CLOUDLOG_API_KEY}`;
      const response = await fetch(apiURL);

      const qsos = await response.json();
      if (!qsos) {
        ctx.logger.warn('Unable to find qsos with the provided input');
        throw new TRPCError({
          code: 'NOT_FOUND',
        });
      }

      return qsos;
    }),
});
