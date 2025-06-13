import { prisma } from 'prisma/seed/utils';

export async function createRepositories() {
  console.log(`⏳ Seeding repositories`);

  let createdCounter = 0;
  const existingCount = await prisma.repository.count();

  if (
    !(await prisma.repository.findUnique({ where: { name: 'KS3CKC Website' } }))
  ) {
    await prisma.repository.create({
      data: {
        name: 'KS3CKC Website',
        link: 'https://github.com/patrickrb/ks3ckc-website',
        description:
          '📻 KS3CKC Website - A modern club website for Kansas City Amateur Radio Club built with Next.js, TypeScript, and Chakra UI',
      },
    });
    createdCounter += 1;
  }

  if (
    !(await prisma.repository.findUnique({
      where: { name: 'KS3CKC Radio' },
    }))
  ) {
    await prisma.repository.create({
      data: {
        name: 'KS3CKC Radio',
        link: 'https://ks3ckc.radio',
        description:
          '📻 KS3CKC Radio - Kansas City Amateur Radio Club website with club information, events, and amateur radio resources for the ham radio community.',
      },
    });
    createdCounter += 1;
  }

  console.log(
    `✅ ${existingCount} existing repositories 👉 ${createdCounter} repositories created`
  );
}
