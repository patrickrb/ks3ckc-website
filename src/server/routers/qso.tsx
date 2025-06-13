import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { env } from '@/env.mjs';
import { zQso } from '@/features/qso/schemas';
import { createTRPCRouter, protectedProcedure } from '@/server/config/trpc';

export const qsoRouter = createTRPCRouter({
  getRecent: protectedProcedure()
    .input(z.void())
    .output(z.array(zQso()))
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

      // Don't proceed if CloudLog API settings aren't configured
      if (!env.CLOUDLOG_API_URL || !env.CLOUDLOG_API_KEY) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'CloudLog API is not configured',
        });
      }

      // Build the URL separately from the API key
      const apiURL = `${env.CLOUDLOG_API_URL}/recent_qsos`;

      try {
        // Use headers for authentication instead of URL
        const response = await fetch(apiURL, {
          headers: {
            'X-API-KEY': env.CLOUDLOG_API_KEY,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const qsos = await response.json();
        if (!qsos) {
          ctx.logger.warn('Unable to find qsos with the provided input');
          throw new TRPCError({
            code: 'NOT_FOUND',
          });
        }

        return qsos;
      } catch (error) {
        ctx.logger.error({ error }, 'Failed to fetch QSOs from CloudLog API');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch QSOs',
        });
      }
    }),
});
