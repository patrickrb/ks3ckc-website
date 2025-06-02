import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/config/trpc';

// Event input validation schema
export const zEventFormSchema = () =>
  z.object({
    name: z.string().min(1, 'Event name is required'),
    date: z.date(),
    startTime: z.string().optional(),
    endTime: z.string().optional(), 
    location: z.string().optional(),
    address: z.string().optional(),
    mapUrl: z.string().url().optional().or(z.literal('')),
    embedMapUrl: z.string().url().optional().or(z.literal('')),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
  });

export const eventsRouter = createTRPCRouter({
  // Public - Get all active upcoming events
  getUpcoming: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();
    
    return ctx.db.event.findMany({
      where: {
        isActive: true,
        date: {
          gte: now,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            callsign: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }),

  // Public - Get all active past events
  getPast: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();
    
    return ctx.db.event.findMany({
      where: {
        isActive: true,
        date: {
          lt: now,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            callsign: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }),

  // Admin/Contributor - Get all events (including inactive)
  getAll: protectedProcedure({ authorizations: ['ADMIN', 'CONTRIBUTOR'] })
    .input(
      z.object({
        includeInactive: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause = input.includeInactive ? {} : { isActive: true };

      return ctx.db.event.findMany({
        where: whereClause,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              callsign: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
    }),

  // Admin/Contributor - Get single event by ID
  getById: protectedProcedure({ authorizations: ['ADMIN', 'CONTRIBUTOR'] })
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              callsign: true,
            },
          },
        },
      });

      if (!event) {
        throw new Error('Event not found');
      }

      return event;
    }),

  // Admin/Contributor - Create new event
  create: protectedProcedure({ authorizations: ['ADMIN', 'CONTRIBUTOR'] })
    .input(zEventFormSchema())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.event.create({
        data: {
          ...input,
          authorId: ctx.user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              callsign: true,
            },
          },
        },
      });
    }),

  // Admin/Contributor - Update existing event
  update: protectedProcedure({ authorizations: ['ADMIN', 'CONTRIBUTOR'] })
    .input(
      z.object({
        id: z.string(),
        data: zEventFormSchema().partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if event exists
      const existingEvent = await ctx.db.event.findUnique({
        where: { id: input.id },
        select: { id: true, authorId: true },
      });

      if (!existingEvent) {
        throw new Error('Event not found');
      }

      // Only allow editing own events unless user is admin
      const isAdmin = ctx.user.authorizations.includes('ADMIN');
      if (!isAdmin && existingEvent.authorId !== ctx.user.id) {
        throw new Error('You can only edit your own events');
      }

      return ctx.db.event.update({
        where: {
          id: input.id,
        },
        data: input.data,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              callsign: true,
            },
          },
        },
      });
    }),

  // Admin - Delete event (only admins can delete)
  delete: protectedProcedure({ authorizations: ['ADMIN'] })
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if event exists
      const existingEvent = await ctx.db.event.findUnique({
        where: { id: input.id },
        select: { id: true },
      });

      if (!existingEvent) {
        throw new Error('Event not found');
      }

      return ctx.db.event.delete({
        where: {
          id: input.id,
        },
      });
    }),

  // Admin/Contributor - Toggle event active status
  toggleActive: protectedProcedure({ authorizations: ['ADMIN', 'CONTRIBUTOR'] })
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingEvent = await ctx.db.event.findUnique({
        where: { id: input.id },
        select: { id: true, isActive: true, authorId: true },
      });

      if (!existingEvent) {
        throw new Error('Event not found');
      }

      // Only allow toggling own events unless user is admin
      const isAdmin = ctx.user.authorizations.includes('ADMIN');
      if (!isAdmin && existingEvent.authorId !== ctx.user.id) {
        throw new Error('You can only toggle your own events');
      }

      return ctx.db.event.update({
        where: {
          id: input.id,
        },
        data: {
          isActive: !existingEvent.isActive,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              callsign: true,
            },
          },
        },
      });
    }),
});