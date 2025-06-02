import { createRepositories } from 'prisma/seed/models/repository';
import { createUsers } from 'prisma/seed/models/user';
import { prisma } from 'prisma/seed/utils';

import { createBlogEntries } from './models/blog';
import { createEventEntries } from './models/events';
import { createNewsEntries } from './models/news';

async function main() {
  await createRepositories();
  await createUsers();
  await createBlogEntries();
  await createNewsEntries();
  await createEventEntries();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
