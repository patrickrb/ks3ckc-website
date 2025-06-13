import { z } from 'zod';

// Event form validation schema
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

export type EventFormFields = z.infer<ReturnType<typeof zEventFormSchema>>;

// Event display schema (what we get from API)
export const zEvent = () =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    name: z.string(),
    date: z.date(),
    startTime: z.string().nullable(),
    endTime: z.string().nullable(),
    location: z.string().nullable(),
    address: z.string().nullable(),
    mapUrl: z.string().nullable(),
    embedMapUrl: z.string().nullable(),
    description: z.string().nullable(),
    isActive: z.boolean(),
    author: z.object({
      id: z.string(),
      name: z.string().nullable(),
      callsign: z.string().nullable(),
    }),
    authorId: z.string(),
  });

export type Event = z.infer<ReturnType<typeof zEvent>>;
