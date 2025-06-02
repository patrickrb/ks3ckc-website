import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { zNews } from '@/features/news/schemas';
import { ExtendedTRPCError } from '@/server/config/errors';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/config/trpc';
import { NewsWithAuthor } from '@/types/news';

// Helper function to ensure author properties are properly typed
const processNewsWithAuthor = (news: any): NewsWithAuthor => {
  if (news && news.author) {
    return {
      ...news,
      author: {
        ...news.author,
        // Handle nullable string fields - convert empty strings to null for consistency
        name: news.author.name || null,
        image: news.author.image || null,
        callsign: news.author.callsign || null,
        notes: news.author.notes || null,
        // Handle dmrid - ensure it's a number or null
        dmrid:
          typeof news.author.dmrid === 'string'
            ? Number(news.author.dmrid)
            : news.author.dmrid || null,
        // Handle boolean with default
        isPubliclyVisible:
          news.author.isPubliclyVisible !== undefined
            ? news.author.isPubliclyVisible
            : false,
        // Handle date field
        lastLoginAt: news.author.lastLoginAt || null,
      },
    };
  }
  return news as NewsWithAuthor;
};

// Helper function to process a list of news entries
const processNewsListWithAuthor = (newsList: any[]): NewsWithAuthor[] => {
  return newsList.map(processNewsWithAuthor);
};

export const newsRouter = createTRPCRouter({
  getAll: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/news',
        tags: ['news'],
      },
    })
    .input(
      z
        .object({
          searchTerm: z.string().optional(),
          limit: z.number().min(1).max(100).default(50),
          cursor: z.string().optional(),
        })
        .optional()
        .default({})
    )
    .output(
      z.object({
        items: z.array(zNews()),
        nextCursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { searchTerm, limit, cursor } = input;
      ctx.logger.info('Getting all news entries');

      const where: Prisma.NewsWhereInput = searchTerm
        ? {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { content: { contains: searchTerm, mode: 'insensitive' } },
            ],
          }
        : {};

      const news = await ctx.db.news.findMany({
        where,
        include: {
          author: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (news.length > limit) {
        const nextItem = news.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: processNewsListWithAuthor(news),
        nextCursor,
      };
    }),

  getAllForAdmin: protectedProcedure({ authorizations: ['CONTRIBUTOR', 'ADMIN'] })
    .meta({
      openapi: {
        method: 'GET',
        path: '/news/admin',
        protect: true,
        tags: ['news'],
      },
    })
    .input(
      z
        .object({
          searchTerm: z.string().optional(),
          limit: z.number().min(1).max(100).default(50),
          cursor: z.string().optional(),
        })
        .optional()
        .default({})
    )
    .output(
      z.object({
        items: z.array(zNews()),
        nextCursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { searchTerm, limit, cursor } = input;
      ctx.logger.info('Getting all news entries for admin');

      const where: Prisma.NewsWhereInput = searchTerm
        ? {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { content: { contains: searchTerm, mode: 'insensitive' } },
            ],
          }
        : {};

      const news = await ctx.db.news.findMany({
        where,
        include: {
          author: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (news.length > limit) {
        const nextItem = news.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: processNewsListWithAuthor(news),
        nextCursor,
      };
    }),

  getById: protectedProcedure({ authorizations: ['CONTRIBUTOR', 'ADMIN'] })
    .meta({
      openapi: {
        method: 'GET',
        path: '/news/{id}',
        protect: true,
        tags: ['news'],
      },
    })
    .input(
      zNews().pick({
        id: true,
      })
    )
    .output(zNews())
    .query(async ({ ctx, input }) => {
      ctx.logger.info('Getting news entry');
      const news = await ctx.db.news.findUnique({
        where: { id: input.id },
        include: {
          author: true,
        },
      });

      if (!news) {
        ctx.logger.warn('Unable to find news entry with the provided input');
        throw new TRPCError({
          code: 'NOT_FOUND',
        });
      }

      return processNewsWithAuthor(news);
    }),

  create: protectedProcedure({ authorizations: ['CONTRIBUTOR', 'ADMIN'] })
    .meta({
      openapi: {
        method: 'POST',
        path: '/news',
        protect: true,
        tags: ['news'],
      },
    })
    .input(
      zNews().required().pick({
        title: true,
        content: true,
      })
    )
    .output(zNews())
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info({ input }, 'Creating news entry');
      try {
        const news = await ctx.db.news.create({
          data: {
            title: input.title,
            content: input.content,
            author: { connect: { id: ctx.user.id } },
          },
          include: {
            author: true,
          },
        });

        return processNewsWithAuthor(news);
      } catch (e) {
        throw new ExtendedTRPCError({
          cause: e,
        });
      }
    }),

  updateById: protectedProcedure({ authorizations: ['CONTRIBUTOR', 'ADMIN'] })
    .meta({
      openapi: {
        method: 'PUT',
        path: '/news/{id}',
        protect: true,
        tags: ['news'],
      },
    })
    .input(
      zNews().required().pick({
        id: true,
        title: true,
        content: true,
      })
    )
    .output(zNews())
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info({ input }, 'Updating news entry');
      try {
        const news = await ctx.db.news.update({
          where: { id: input.id },
          data: {
            title: input.title,
            content: input.content,
          },
          include: {
            author: true,
          },
        });

        return processNewsWithAuthor(news);
      } catch (e) {
        throw new ExtendedTRPCError({
          cause: e,
        });
      }
    }),

  removeById: protectedProcedure({ authorizations: ['ADMIN'] })
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/news/{id}',
        protect: true,
        tags: ['news'],
      },
    })
    .input(
      zNews().required().pick({
        id: true,
      })
    )
    .output(zNews())
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info({ input }, 'Removing news entry');
      const news = await ctx.db.news.delete({
        where: { id: input.id },
        include: {
          author: true,
        },
      });

      return processNewsWithAuthor(news);
    }),
});