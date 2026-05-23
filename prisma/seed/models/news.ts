import { prisma } from 'prisma/seed/utils';

type SeedNews = {
  title: string;
  content: string;
};

const NEWS: SeedNews[] = [
  {
    title: 'Field Day 2026 site selected — Clinton State Park, Elk Creek Cabin',
    content: `We're back at Clinton State Park (Elk Creek Cabin) for ARRL Field
Day 2026, June 27–28. Same site that worked great in 2025: shade, parking,
power, and a clean horizon to the west. Setup begins Friday afternoon.

If you want to operate a station, sign up on the club Discord — we're
running 3A this year (HF SSB, HF CW, HF Digital) plus a GOTA station.`,
  },
  {
    title: 'License exam session — June 12, SecKC HQ',
    content: `Volunteer Examiners are running a session on June 12 at SecKC HQ.
Walk-ins welcome but pre-register on the club Discord so we know how many
exams to bring. $15 ARRL fee, cash or Venmo. Tech, General, and Extra all
available. Average pass rate at our sessions is around 88%.`,
  },
  {
    title: 'New 70cm repeater on the air — 444.875+ PL 107.2',
    content: `Repeater #2 is back on the air after maintenance. 444.875 +5,
PL 107.2 in/out. Coverage is roughly 25 miles south, 35 miles north. It's
linked to the 146.910 machine via the club reflector — key up either one
and the other follows.`,
  },
  {
    title: 'Wednesday night net — 21:00 CT, 446.050 / 145.555',
    content: `Reminder that the club net runs Wednesdays 21:00 CT (9pm).
Primary frequency 446.050 simplex, backup 145.555 simplex if 70cm is unusable.
NCS rotation: KD0LRN, N0RC, AC0DZ, WB0WAO. Visitors and new hams encouraged
— we keep it informal.`,
  },
  {
    title: 'Club shack open hours expanded — Tues + Thurs evenings',
    content: `Starting this month the club shack is open Tuesdays AND
Thursdays, 18:00–22:00 CT. Good time to come hands-on with the FT-991A,
IC-7300, or the new bench equipment if you don't have an HF rig at home.

Bring your own coax adapters. We have most things. We do not have BNC-to-N
adapters in any quantity that survives a Tuesday.`,
  },
  {
    title: 'POTA group activations — calendar posted',
    content: `Group POTA activations posted on the events calendar through
August. Lewis & Clark, Watkins Mill, Weston Bend, and a stretch goal trip
to Truman Reservoir. Bring portable gear or just hang out and log. Carpools
organized via Discord the week of.`,
  },
  {
    title: 'Donation: matching $500 from anonymous member toward antenna fund',
    content: `An anonymous club member has offered to match up to $500 in
donations toward the new tower-top yagi project. We've raised $315 so far —
needs another $185 to lock the match. Donations via the club's Stripe link
on the membership page.`,
  },
  {
    title: 'Volunteer slots open — KC Marathon comms support, Oct 18',
    content: `The KC Marathon needs ~24 hams for comms support along the
course on Oct 18. Mostly water-station and turn-marshal positions. HT + extra
battery + comfortable shoes. Free entry to the post-race breakfast. Sign up
on the club Discord, slots fill fast.`,
  },
];

export async function createNewsEntries() {
  console.log(`⏳ Seeding news entries...`);

  let createdCounter = 0;
  const existingCount = await prisma.news.count();

  const author = await prisma.user.findUnique({
    where: { email: 'admin@admin.com' },
  });
  if (!author) {
    console.log('❌ Admin user not found, skipping news seeding');
    return;
  }

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (const [i, item] of NEWS.entries()) {
    const existing = await prisma.news.findFirst({
      where: { title: item.title },
    });
    if (existing) continue;

    const daysBack = 2 + i * 5 + Math.floor(Math.random() * 3);
    const createdAt = new Date(now - daysBack * dayMs);

    await prisma.news.create({
      data: {
        title: item.title,
        content: item.content,
        authorId: author.id,
        createdAt,
        updatedAt: createdAt,
      },
    });
    createdCounter += 1;
  }

  console.log(
    `✅ ${existingCount} existing news entries 👉 ${createdCounter} news entries created`
  );
}
