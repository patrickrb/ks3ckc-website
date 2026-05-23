import { prisma } from 'prisma/seed/utils';

type SeedEvent = {
  name: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  address?: string;
  mapUrl?: string;
  embedMapUrl?: string;
  description?: string;
  isActive?: boolean;
};

const KNUCKLEHEADS = {
  location: 'Knuckleheads Garage',
  address: '701 N Montgall Ave, Kansas City, MO 64120',
  mapUrl: 'https://maps.app.goo.gl/Z9yboWxsEh63QzuDA',
  embedMapUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3095.376287263093!2d-94.55174202405244!3d39.12066797167728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0fa6efbb5e74b%3A0xc88eb26af129a68b!2s701%20N%20Montgall%20Ave%2C%20Kansas%20City%2C%20MO%2064120!5e0!3m2!1sen!2sus!4v1747367871060!5m2!1sen!2sus',
};

const ELK_CREEK = {
  location: 'Clinton State Park | Elk Creek Cabin',
  mapUrl: 'https://maps.app.goo.gl/MTJgqTcw69tigJkE6',
  embedMapUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3103.748792336924!2d-95.36182731749331!3d38.92971887188787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87bf6b908a5cd5d1%3A0x628e97bd646e3552!2sElk%20Creek%20Cabin!5e0!3m2!1sen!2sus!4v1747367052821!5m2!1sen!2sus',
};

const TALL_TRELLIS = {
  location: 'Tall Trellis Brew Co.',
  address: '25600 West Valley Parkway, Olathe, KS 66061',
  mapUrl:
    'https://www.google.com/maps/place/Tall+Trellis+Brew+Co./@38.9450675,-94.8871786,17z',
};

const SECKC_HQ = {
  location: 'SecKC HQ',
};

// Anchor everything around "today" so the events list always has a healthy
// mix of upcoming and past entries no matter when the seed runs.
const today = new Date();
today.setHours(0, 0, 0, 0);
const at = (daysFromToday: number, hour: number, minute = 0): Date => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysFromToday);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const EVENTS: SeedEvent[] = [
  // === upcoming ===
  {
    name: 'Wednesday Night Club Net',
    date: at(2, 21),
    startTime: '9:00 PM CT',
    endTime: '10:00 PM CT',
    location: '446.050 simplex / 145.555 backup',
    description:
      'Weekly informal club net. Visitors and new hams welcome — we keep it casual. NCS rotates between KD0LRN, N0RC, AC0DZ, and WB0WAO.',
  },
  {
    name: 'Antenna Build Day — 40m EFHW',
    date: at(5, 10),
    startTime: '10:00 AM',
    endTime: '3:00 PM',
    ...KNUCKLEHEADS,
    description:
      'Hands-on build session. Bring a soldering iron if you have one — we have spares. We will build, tune, and test 40m end-fed half-waves with 49:1 ununs. ~$25 in parts, supplied at cost.',
  },
  {
    name: 'Monthly Club Meeting + CW/Digital Practice',
    date: at(9, 17),
    startTime: '5:00 PM',
    endTime: '9:00 PM',
    ...KNUCKLEHEADS,
    description:
      'Monthly meetup for KS3CKC members. Networking, presentations, ham radio nerdery. After-meeting CW practice on the club shack equipment.',
  },
  {
    name: 'POTA Activation — Lewis & Clark (K-2284)',
    date: at(12, 9),
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    location: 'Lewis & Clark State Historic Site',
    description:
      'Group POTA activation. Bring portable gear or just hang out and log. We will have a KX2 + EFHW running and a backup IC-705 for digital modes.',
  },
  {
    name: 'License Exam Session',
    date: at(18, 18),
    startTime: '6:00 PM',
    ...SECKC_HQ,
    description:
      'Volunteer Examiner session. Tech, General, Extra all available. $15 ARRL fee. Pre-register on the club Discord so we know how many exams to print.',
  },
  {
    name: 'Local Meetup — Tall Trellis',
    date: at(23, 17),
    startTime: '5:00 PM',
    endTime: '9:00 PM',
    ...TALL_TRELLIS,
    description: 'Casual hangout for KS3CKC members at Tall Trellis Brew Co.',
  },
  {
    name: 'ARRL Field Day 2026',
    date: at(53, 15),
    startTime: '3:00 PM',
    endTime: '12:00 PM (Sunday)',
    ...ELK_CREEK,
    description:
      'ARRL Field Day 2026 — the premier emergency-preparedness exercise in amateur radio. Running 3A: HF SSB, HF CW, HF Digital + GOTA station. Setup begins Friday afternoon. Questions? Find us on [Discord](https://discord.gg/seckc).',
  },
  {
    name: 'KC Marathon Comms Support',
    date: at(140, 6),
    startTime: '6:00 AM',
    endTime: '12:00 PM',
    location: 'Various — KC Marathon course',
    description:
      '~24 hams needed for course comms (water stations, turn marshals). HT + extra battery + comfortable shoes. Free post-race breakfast. Sign up on Discord — slots fill fast.',
  },

  // === past ===
  {
    name: 'CW Practice Net (relaunch)',
    date: at(-7, 20),
    startTime: '8:00 PM CT',
    endTime: '9:00 PM CT',
    location: '28.060 MHz (10m) — alt 7.040 if 10m is dead',
    description:
      'Slow CW practice net. QRS welcome. NCS: AC0DZ. ~14 check-ins, mix of 8–18 wpm.',
  },
  {
    name: 'POTA Group Activation — Watkins Mill (K-2300)',
    date: at(-14, 9),
    location: 'Watkins Mill State Park',
    description: '6 ops, 184 contacts, 2 P2P. EFHW + KX2 setup.',
  },
  {
    name: 'Antenna Tower Workday',
    date: at(-28, 9),
    location: 'Club tower site',
    description:
      'Replaced rotator on the tribander, swapped feedline on 2m yagi. Crew of 7. Nobody fell off the tower. Counted as a win.',
  },
  {
    name: 'Monthly Meetup (April)',
    date: at(-35, 17),
    startTime: '5:00 PM',
    ...KNUCKLEHEADS,
    description: 'April monthly meetup. Talk on grayline propagation by N0RC.',
  },
  {
    name: 'License Exam Session',
    date: at(-49, 18),
    ...SECKC_HQ,
    description: '11 candidates · 9 passed · 2 new Extras.',
  },
  {
    name: 'Winter Field Day',
    date: at(-90, 14),
    startTime: '2:00 PM',
    endTime: '2:00 PM (Sunday)',
    ...ELK_CREEK,
    description:
      'Winter Field Day 2026. Cold but clear. ~340 contacts, mostly on 40m and 20m. Generators behaved. Coffee did not last.',
  },
  {
    name: 'New Year Net',
    date: at(-126, 21),
    location: '446.050 simplex',
    description: 'Special New Year Eve net. 23 check-ins.',
  },
];

export async function createEventEntries() {
  console.log(`⏳ Seeding event entries...`);

  let createdCounter = 0;
  const existingCount = await prisma.event.count();

  const user = await prisma.user.findUnique({
    where: { email: 'admin@admin.com' },
  });

  if (!user) {
    console.log('❌ Admin user not found, skipping event seeding');
    return;
  }

  for (const eventData of EVENTS) {
    const existing = await prisma.event.findFirst({
      where: {
        name: eventData.name,
        date: eventData.date,
      },
    });

    if (!existing) {
      await prisma.event.create({
        data: {
          ...eventData,
          isActive: eventData.isActive ?? true,
          authorId: user.id,
        },
      });
      createdCounter += 1;
    }
  }

  console.log(
    `✅ ${existingCount} existing event entries 👉 ${createdCounter} event entries created`
  );
}
