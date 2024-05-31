import { faker } from '@faker-js/faker';
import { prisma } from 'prisma/seed/utils';

export async function createNewsEntries() {
  console.log(`⏳ Seeding news entries...`);

  let createdCounter = 0;
  const existingCount = await prisma.news.count();

  const user = await prisma.user.findUnique({
    where: { email: 'admin@admin.com' },
  });

  await Promise.all(
    Array.from({ length: Math.max(0, 10 - existingCount) }, async () => {
      await prisma.news.create({
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
    `✅ ${existingCount} existing news entries 👉 ${createdCounter} news entries created`
  );
}
