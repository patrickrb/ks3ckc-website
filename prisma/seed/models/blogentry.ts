import { faker } from '@faker-js/faker';
import { prisma } from 'prisma/seed/utils';

export async function createBlogEntries() {
  console.log(`⏳ Seeding blog entries...`);

  let createdCounter = 0;
  const existingCount = await prisma.blogEntry.count();

  const user = await prisma.user.findUnique({
    where: { email: 'admin@admin.com' },
  });

  await Promise.all(
    Array.from({ length: Math.max(0, 10 - existingCount) }, async () => {
      await prisma.blogEntry.create({
        data: {
          title: faker.hacker.phrase(),
          content: faker.lorem.paragraphs(3),
          authorId: user!.id,
        },
      });
      createdCounter += 1;
    })
  );

  console.log(
    `✅ ${existingCount} existing blog entries 👉 ${createdCounter} blog entries created`
  );
}
