import { createRepositories } from 'prisma/seed/models/repository';
import { createUsers } from 'prisma/seed/models/user';
import { prisma } from 'prisma/seed/utils';

import { createBlogEntries } from './models/blogentry';
import { createNewsEntries } from './models/news';

async function main() {
  await createRepositories();
  await createUsers();
  await createBlogEntries();
  await createNewsEntries();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
