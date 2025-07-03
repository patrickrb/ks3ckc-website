import { createTRPCRouter } from '@/server/config/trpc';
import { accountRouter } from '@/server/routers/account';
import { authRouter } from '@/server/routers/auth';
import { blogImagesRouter } from '@/server/routers/blogImages';
import { blogsRouter } from '@/server/routers/blogs';
import { eventsRouter } from '@/server/routers/events';
import { newsRouter } from '@/server/routers/news';
import { qsoRouter } from '@/server/routers/qso';
import { repositoriesRouter } from '@/server/routers/repositories';
import { usersRouter } from '@/server/routers/users';

/**
 * This is the primary router for your server.
 *
 * All routers added in /src/server/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  account: accountRouter,
  auth: authRouter,
  repositories: repositoriesRouter,
  users: usersRouter,
  qso: qsoRouter,
  blogs: blogsRouter,
  blogImages: blogImagesRouter,
  events: eventsRouter,
  news: newsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
