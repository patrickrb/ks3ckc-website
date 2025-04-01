import { PrismaClient } from '@prisma/client';

import { env } from '@/env.mjs';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const levels: Record<LogLevel, ('query' | 'error' | 'warn' | 'info')[]> = {
  trace: ['query', 'error', 'warn', 'info'],
  debug: ['error', 'warn', 'info'],
  info: ['error', 'warn', 'info'],
  warn: ['error', 'warn'],
  error: ['error'],
  fatal: ['error'],
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: levels[(env.LOGGER_LEVEL ?? 'info') as LogLevel],
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
