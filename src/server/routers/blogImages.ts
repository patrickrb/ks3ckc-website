import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { ExtendedTRPCError } from '@/server/config/errors';
import { createTRPCRouter, protectedProcedure } from '@/server/config/trpc';
import { blobStorage } from '@/server/services/blobStorage';

export const blogImagesRouter = createTRPCRouter({
  upload: protectedProcedure({ authorizations: ['CONTRIBUTOR', 'ADMIN'] })
    .input(
      z.object({
        blogId: z.string().cuid(),
        file: z.object({
          name: z.string(),
          type: z.string(),
          size: z.number(),
          data: z.string(), // base64 encoded file data
        }),
      })
    )
    .output(
      z.object({
        id: z.string(),
        filename: z.string(),
        originalName: z.string(),
        blobUrl: z.string(),
        blobName: z.string(),
        mimeType: z.string(),
        size: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info('Uploading blog image');

      try {
        // Validate blog exists and user has permission
        const blog = await ctx.db.blogs.findUnique({
          where: { id: input.blogId },
        });

        if (!blog) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Blog not found',
          });
        }

        // Check if user is admin or the author of the blog
        if (
          ctx.user.authorizations.includes('ADMIN') ||
          blog.authorId === ctx.user.id
        ) {
          // Convert base64 to File object
          const buffer = Buffer.from(input.file.data, 'base64');
          const file = new File([buffer], input.file.name, {
            type: input.file.type,
          });

          // Upload to Azure Blob Storage
          const uploadResult = await blobStorage.uploadImage(
            file,
            input.blogId
          );

          // Save to database
          return await ctx.db.blogImage.create({
            data: {
              filename: uploadResult.filename,
              originalName: input.file.name,
              blobUrl: uploadResult.blobUrl,
              blobName: uploadResult.blobName,
              mimeType: uploadResult.mimeType,
              size: uploadResult.size,
              blogId: input.blogId,
            },
          });
        } else {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to upload images to this blog',
          });
        }
      } catch (e) {
        throw new ExtendedTRPCError({
          cause: e,
        });
      }
    }),

  getByBlogId: protectedProcedure({ authorizations: ['CONTRIBUTOR', 'ADMIN'] })
    .input(
      z.object({
        blogId: z.string().cuid(),
      })
    )
    .output(
      z.array(
        z.object({
          id: z.string(),
          filename: z.string(),
          originalName: z.string(),
          blobUrl: z.string(),
          blobName: z.string(),
          mimeType: z.string(),
          size: z.number(),
          createdAt: z.date(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      ctx.logger.info('Getting blog images');

      try {
        return await ctx.db.blogImage.findMany({
          where: { blogId: input.blogId },
          orderBy: { createdAt: 'desc' },
        });
      } catch (e) {
        throw new ExtendedTRPCError({
          cause: e,
        });
      }
    }),

  delete: protectedProcedure({ authorizations: ['CONTRIBUTOR', 'ADMIN'] })
    .input(
      z.object({
        imageId: z.string().cuid(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info('Deleting blog image');

      try {
        // Find the image and check permissions
        const image = await ctx.db.blogImage.findUnique({
          where: { id: input.imageId },
          include: {
            blog: true,
          },
        });

        if (!image) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Image not found',
          });
        }

        // Check if user is admin or the author of the blog
        if (
          ctx.user.authorizations.includes('ADMIN') ||
          image.blog.authorId === ctx.user.id
        ) {
          // Delete from Azure Blob Storage
          await blobStorage.deleteImage(image.blobName);

          // Delete from database
          await ctx.db.blogImage.delete({
            where: { id: input.imageId },
          });

          return { success: true };
        } else {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this image',
          });
        }
      } catch (e) {
        throw new ExtendedTRPCError({
          cause: e,
        });
      }
    }),
});
