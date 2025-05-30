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
    NODE_ENV: zNodeEnv,

    // Require a strong secret for authentication
    AUTH_SECRET: z.string().min(32, "Auth secret should be at least 32 characters long"),

    EMAIL_SERVER: z.string().url(),
    EMAIL_FROM: z.string(),
    // Make CLOUDLOG_API_KEY required if CLOUDLOG_API_URL is set 
    CLOUDLOG_API_KEY: z.string().optional().refine(
      (val, ctx) => {
        if (ctx.path.CLOUDLOG_API_URL && !val) {
          return false;
        }
        return true;
      }, 
      { message: "CLOUDLOG_API_KEY is required when CLOUDLOG_API_URL is set" }
    ),
    CLOUDLOG_API_URL: z.string().url().optional(),
    LOGGER_LEVEL: z
      .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
      .default(process.env.NODE_ENV === 'production' ? 'error' : 'info'),
    LOGGER_PRETTY: z
      .enum(['true', 'false'])
      .default(process.env.NODE_ENV === 'production' ? 'false' : 'true')
      .transform((value) => value === 'true'),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_IS_DEMO: z
      .enum(['true', 'false'])
      .optional()
      .default('false')
      .transform((v) => v === 'true'),
    NEXT_PUBLIC_BASE_URL: z.string().url(),

    NEXT_PUBLIC_DEV_ENV_NAME: z.string().optional(),
    NEXT_PUBLIC_DEV_ENV_COLOR_SCHEME: z.string().optional(),
    NEXT_PUBLIC_NODE_ENV: zNodeEnv,
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    LOGGER_LEVEL: process.env.LOGGER_LEVEL,
    LOGGER_PRETTY: process.env.LOGGER_PRETTY,
    CLOUDLOG_API_KEY: process.env.CLOUDLOG_API_KEY,
    CLOUDLOG_API_URL: process.env.CLOUDLOG_API_URL,

    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_DEV_ENV_COLOR_SCHEME:
      process.env.NEXT_PUBLIC_DEV_ENV_COLOR_SCHEME,
    NEXT_PUBLIC_DEV_ENV_NAME: process.env.NEXT_PUBLIC_DEV_ENV_NAME,
    NEXT_PUBLIC_IS_DEMO: process.env.NEXT_PUBLIC_IS_DEMO,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
