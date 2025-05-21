import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { zBlog } from '@/features/blogs/schemas';
import { ExtendedTRPCError } from '@/server/config/errors';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/config/trpc';
import { BlogWithAuthor } from '@/types/blog';

// Helper function to ensure dmrid is properly typed as number and adds missing Author properties
const processBlogWithAuthor = (blog: any): BlogWithAuthor => {
  if (blog && blog.author) {
    return {
      ...blog,
      author: {
        ...blog.author,
        dmrid:
          typeof blog.author.dmrid === 'string'
            ? Number(blog.author.dmrid)
            : blog.author.dmrid || null,
        // Add missing properties if not present
        callsign: blog.author.callsign || null,
        isPubliclyVisible:
          blog.author.isPubliclyVisible !== undefined
            ? blog.author.isPubliclyVisible
            : false,
        notes: blog.author.notes || null,
      },
    };
  }
  return blog as BlogWithAuthor;
};

// Helper function to ensure dmrid is properly typed as number in a list of blogs
const processBlogsWithAuthor = (blogs: BlogWithAuthor[]): BlogWithAuthor[] => {
  return blogs.map(processBlogWithAuthor);
};

export const blogsRouter = createTRPCRouter({
  getById: protectedProcedure({ authorizations: ['ADMIN'] })
    .meta({
      openapi: {
        method: 'GET',
        path: '/blogs/{id}',
        protect: true,
        tags: ['blogs'],
      },
    })
    .input(
      zBlog().pick({
        id: true,
      })
    )
    .output(zBlog())
    .query(async ({ ctx, input }) => {
      ctx.logger.info('Getting blog');
      const blog = await ctx.db.blogs.findUnique({
        where: { id: input.id },
        include: {
          author: true,
        },
      });

      if (!blog) {
        ctx.logger.warn('Unable to find blog with the provided input');
        throw new TRPCError({
          code: 'NOT_FOUND',
        });
      }

      // Process blog to ensure dmrid is properly typed
      return processBlogWithAuthor(blog);
    }),

  getAll: publicProcedure()
    .meta({
      openapi: {
        method: 'GET',
        path: '/blogs',
        protect: true,
        tags: ['blogs'],
      },
    })
    .input(
      z
        .object({
          cursor: z.string().cuid().optional(),
          limit: z.number().min(1).max(100).default(20),
          searchTerm: z.string().optional(),
        })
        .default({})
    )
    .output(
      z.object({
        items: z.array(zBlog()),
        nextCursor: z.string().cuid().optional(),
        total: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      ctx.logger.info('Getting blogs from database');

      const where = {
        OR: [
          {
            title: {
              contains: input.searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      } satisfies Prisma.BlogsWhereInput;

      const [total, items] = await ctx.db.$transaction([
        ctx.db.blogs.count({
          where,
        }),
        ctx.db.blogs.findMany({
          // Get an extra item at the end which we'll use as next cursor
          take: input.limit + 1,
          cursor: input.cursor ? { id: input.cursor } : undefined,
          orderBy: {
            id: 'desc',
          },
          where,
          include: {
            author: true,
          },
        }),
      ]);

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      // Process items to ensure dmrid is properly typed
      const processedItems = processBlogsWithAuthor(
        items.map((item) => processBlogWithAuthor(item))
      );

      return {
        items: processedItems,
        nextCursor,
        total,
      };
    }),

  create: protectedProcedure({ authorizations: ['ADMIN'] })
    .meta({
      openapi: {
        method: 'POST',
        path: '/blogs',
        protect: true,
        tags: ['blogs'],
      },
    })
    .input(
      zBlog().required().pick({
        title: true,
        content: true,
        author: true,
      })
    )
    .output(zBlog())
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info('Creating blog');
      try {
        const blog = await ctx.db.blogs.create({
          data: {
            title: input.title,
            content: input.content,
            author: { connect: { id: ctx.user.id } },
          },
          include: {
            author: true,
          },
        });

        // Process blog to ensure dmrid is properly typed
        return processBlogWithAuthor(blog);
      } catch (e) {
        throw new ExtendedTRPCError({
          cause: e,
        });
      }
    }),

  updateById: protectedProcedure({ authorizations: ['ADMIN'] })
    .meta({
      openapi: {
        method: 'PUT',
        path: '/blogs/{id}',
        protect: true,
        tags: ['blogs'],
      },
    })
    .input(
      zBlog().required().pick({
        id: true,
        name: true,
        email: true,
        language: true,
        authorizations: true,
      })
    )
    .output(zBlog())
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info({ input }, 'Updating blog');
      try {
        const blog = await ctx.db.blogs.update({
          where: { id: input.id },
          data: input,
          include: {
            author: true,
          },
        });

        // Process blog to ensure dmrid is properly typed
        return processBlogWithAuthor(blog);
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
        path: '/blogs/{id}',
        protect: true,
        tags: ['blogs'],
      },
    })
    .input(
      zBlog().required().pick({
        id: true,
      })
    )
    .output(zBlog())
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.id === input.id) {
        ctx.logger.warn('Logged user cannot delete itself');
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You cannot remove yourself',
        });
      }

      ctx.logger.info({ input }, 'Removing blog');
      const blog = await ctx.db.blogs.delete({
        where: { id: input.id },
        include: {
          author: true,
        },
      });

      // Process blog to ensure dmrid is properly typed
      return processBlogWithAuthor(blog);
    }),
});
