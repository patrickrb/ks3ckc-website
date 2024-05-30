import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { env } from '@/env.mjs';
import { createTRPCRouter, protectedProcedure } from '@/server/config/trpc';

const apiURL = `${env.CLOUDLOG_API_URL}/recent_qsos/${env.CLOUDLOG_API_KEY}`;
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
