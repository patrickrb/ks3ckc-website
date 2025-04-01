/* eslint-disable no-process-env */
// @ts-check
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const zNodeEnv = z
  .enum(['development', 'test', 'production'])
  .default('development');

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),
    NODE_ENV: zNodeEnv,
    EMAIL_SERVER: z.string().url(),
    EMAIL_FROM: z.string(),
    CLOUDLOG_API_KEY: z.string().optional(),
    CLOUDLOG_API_URL: z.string().url().optional(),
    LOGGER_LEVEL: z.string().optional(),
    LOGGER_PRETTY: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_NODE_ENV: zNodeEnv,
    NEXT_PUBLIC_IS_DEMO: z
      .string()
      .default('false')
      .transform((value) => value === 'true'),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_DEV_ENV_NAME: z.string().optional(),
    NEXT_PUBLIC_DEV_ENV_COLOR_SCHEME: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    CLOUDLOG_API_KEY: process.env.CLOUDLOG_API_KEY,
    CLOUDLOG_API_URL: process.env.CLOUDLOG_API_URL,
    LOGGER_LEVEL: process.env.LOGGER_LEVEL,
    LOGGER_PRETTY: process.env.LOGGER_PRETTY,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_IS_DEMO: process.env.NEXT_PUBLIC_IS_DEMO,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_DEV_ENV_NAME: process.env.NEXT_PUBLIC_DEV_ENV_NAME,
    NEXT_PUBLIC_DEV_ENV_COLOR_SCHEME: process.env.NEXT_PUBLIC_DEV_ENV_COLOR_SCHEME,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
