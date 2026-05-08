import { faker } from '@faker-js/faker';
import { emphasis, prisma } from 'prisma/seed/utils';

type SeedMember = {
  name: string;
  email: string;
  callsign: string;
  dmrid?: number;
  notes?: string;
  isPubliclyVisible?: boolean;
};

const SEED_MEMBERS: SeedMember[] = [
  {
    name: 'Patrick Burns',
    email: 'patrick@ks3ckc.radio',
    callsign: 'KS3CKC',
    dmrid: 3120042,
    notes: 'club trustee · 20m SSB, FT8, packet · likes raspi-on-radio chaos.',
    isPubliclyVisible: true,
  },
  {
    name: 'Reid Crowe',
    email: 'reid@n0rc.test',
    callsign: 'N0RC',
    dmrid: 3120155,
    notes: 'co-founder · CW @ 22wpm, contesting, antenna nerdery.',
    isPubliclyVisible: true,
  },
  {
    name: 'Dana Whitfield',
    email: 'dana.whitfield@example.com',
    callsign: 'KD0LRN',
    dmrid: 3120201,
    notes: 'VHF/UHF · mesh node operator · runs the wednesday net.',
    isPubliclyVisible: true,
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    callsign: 'AC0DZ',
    dmrid: 3120388,
    notes: 'POTA hunter · /AE class · CW + FT8 on 15m.',
    isPubliclyVisible: true,
  },
  {
    name: 'Hailey Sato',
    email: 'hailey.sato@example.com',
    callsign: 'KE0XYZ',
    dmrid: 3120417,
    notes: 'digital modes · WSJT-X, JS8Call · weather spotter.',
    isPubliclyVisible: true,
  },
  {
    name: 'Theo Moreno',
    email: 'theo.moreno@example.com',
    callsign: 'WB0WAO',
    dmrid: 3120512,
    notes: 'ARRL VE · field day captain · loves end-fed halfwaves.',
    isPubliclyVisible: true,
  },
  {
    name: 'Priya Anand',
    email: 'priya.anand@example.com',
    callsign: 'N0SPY',
    dmrid: 3120623,
    notes: 'SDR + GNU Radio · sigint hobbyist · 70cm + DMR.',
    isPubliclyVisible: true,
  },
  {
    name: 'Jordan Park',
    email: 'jordan.park@example.com',
    callsign: 'AA0JP',
    dmrid: 3120701,
    notes: 'hf rookie (extra ’24) · 100w + dipole in the attic.',
    isPubliclyVisible: true,
  },
  {
    name: 'Mira Halberg',
    email: 'mira.h@example.com',
    callsign: 'KF0MRA',
    dmrid: 3120814,
    notes: 'embedded engineer · meshtastic + LoRa builds.',
    isPubliclyVisible: true,
  },
  {
    name: 'Sasha Romero',
    email: 'sasha.r@example.com',
    callsign: 'W0SRG',
    dmrid: 3120902,
    notes: 'POTA/SOTA portable ops · QRP cw · KX2 + AX1.',
    isPubliclyVisible: true,
  },
  {
    name: 'Linus Okafor',
    email: 'linus.o@example.com',
    callsign: 'KD0OKF',
    dmrid: 3121048,
    notes: 'satellite ops · AO-91/AO-92 · arrow ii antenna.',
    isPubliclyVisible: true,
  },
  {
    name: 'Tess Ainsworth',
    email: 'tess.a@example.com',
    callsign: 'KE0TAW',
    notes: 'new ham — tech ’26 · likes 2m fm + scanner listening.',
    isPubliclyVisible: true,
  },
  {
    name: 'Ravi Mehta',
    email: 'ravi.mehta@example.com',
    callsign: 'KF0RVM',
    dmrid: 3121211,
    notes: 'aprs + raspberry pi igate · runs an i-gate from KC.',
    isPubliclyVisible: true,
  },
  {
    name: 'Nora Bissette',
    email: 'nora.b@example.com',
    callsign: 'KC0NOR',
    notes: 'CW only · 800+ qsos this year · mountain topper.',
    isPubliclyVisible: true,
  },
  {
    name: 'Felix Bourque',
    email: 'felix.b@example.com',
    callsign: 'WB0FXB',
    dmrid: 3121399,
    notes: 'emcomm · ARES district lead · winlink + js8call.',
    isPubliclyVisible: true,
  },
  {
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@example.com',
    callsign: 'JA1XKG',
    dmrid: 4401501,
    notes: 'visiting member from JA-land · DXCC #312 · 20m + 17m.',
    isPubliclyVisible: true,
  },
  {
    name: 'Owen Pritchard',
    email: 'owen.p@example.com',
    callsign: 'AB0OWN',
    dmrid: 3121603,
    notes: 'antenna analyzer enjoyer · loves NEC2 · hexbeam owner.',
    isPubliclyVisible: true,
  },
  {
    name: 'Camila Ortega',
    email: 'camila.o@example.com',
    callsign: 'KE0CMO',
    notes: 'first qso last week · she/her · learning straight key.',
    isPubliclyVisible: true,
  },
  {
    name: 'Drew Halverson',
    email: 'drew.h@example.com',
    callsign: 'N0DRH',
    dmrid: 3121788,
    notes: 'contester · NAQP, sweepstakes, CQWW · 80m beam dreaming.',
    isPubliclyVisible: true,
  },
  {
    name: 'Sienna Park',
    email: 'sienna.park@example.com',
    callsign: 'KF0SNP',
    dmrid: 3121822,
    notes: 'ux dev · helps maintain the club site · digital modes.',
    isPubliclyVisible: true,
  },
];

export async function createUsers() {
  console.log(`⏳ Seeding users`);

  let createdCounter = 0;
  const existingCount = await prisma.user.count();

  // Seed the named ham-radio members first (idempotent by email).
  for (const m of SEED_MEMBERS) {
    const existing = await prisma.user.findUnique({
      where: { email: m.email },
    });
    if (existing) continue;

    await prisma.user.create({
      data: {
        name: m.name,
        email: m.email,
        callsign: m.callsign,
        dmrid: m.dmrid,
        notes: m.notes,
        isPubliclyVisible: m.isPubliclyVisible ?? true,
        accountStatus: 'ENABLED',
      },
    });
    createdCounter += 1;
  }

  // Top up to ~98 with anonymous faker users (private by default) so the
  // userbase looks realistic but doesn't drown the public roster.
  const totalAfterNamed = await prisma.user.count();
  const target = 98;
  await Promise.all(
    Array.from({ length: Math.max(0, target - totalAfterNamed) }, async () => {
      await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          accountStatus: 'ENABLED',
        },
      });
      createdCounter += 1;
    })
  );

  if (!(await prisma.user.findUnique({ where: { email: 'user@user.com' } }))) {
    await prisma.user.create({
      data: {
        name: 'User',
        email: 'user@user.com',
        accountStatus: 'ENABLED',
      },
    });
    createdCounter += 1;
  }

  if (
    !(await prisma.user.findUnique({ where: { email: 'admin@admin.com' } }))
  ) {
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@admin.com',
        callsign: 'KS3CKC',
        authorizations: ['APP', 'ADMIN'],
        accountStatus: 'ENABLED',
      },
    });
    createdCounter += 1;
  }

  console.log(
    `✅ ${existingCount} existing user 👉 ${createdCounter} users created`
  );
  console.log(`👉 Admin connect with: ${emphasis('admin@admin.com')}`);
  console.log(`👉 User connect with: ${emphasis('user@user.com')}`);
}
