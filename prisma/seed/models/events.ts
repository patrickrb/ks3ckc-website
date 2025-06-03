import { prisma } from 'prisma/seed/utils';

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

  // Original hardcoded events from UpcomingEvents component
  const events = [
    {
      name: 'Monthly Meetup',
      date: new Date('2025-06-10T17:00:00.000Z'), // 5:00 PM
      startTime: '5:00 PM',
      endTime: '9:00 PM',
      location: 'Knuckleheads Garage',
      address: '701 N Montgall Ave, Kansas City, MO 64120',
      mapUrl: 'https://maps.app.goo.gl/Z9yboWxsEh63QzuDA',
      embedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3095.376287263093!2d-94.55174202405244!3d39.12066797167728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0fa6efbb5e74b%3A0xc88eb26af129a68b!2s701%20N%20Montgall%20Ave%2C%20Kansas%20City%2C%20MO%2064120!5e0!3m2!1sen!2sus!4v1747367871060!5m2!1sen!2sus',
      description: 'Monthly meetup for KS3CKC members. Join us for networking, presentations, and ham radio discussions.',
      isActive: true,
    },
    {
      name: 'ARRL Field Day 2025',
      date: new Date('2025-06-27T15:00:00.000Z'), // 3:00 PM
      startTime: '3:00 PM',
      endTime: '12:00 PM June 29, 2025',
      location: 'Clinton State Park | Elk Creek Cabin',
      mapUrl: 'https://maps.app.goo.gl/MTJgqTcw69tigJkE6',
      embedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3103.748792336924!2d-95.36182731749331!3d38.92971887188787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87bf6b908a5cd5d1%3A0x628e97bd646e3552!2sElk%20Creek%20Cabin!5e0!3m2!1sen!2sus!4v1747367052821!5m2!1sen!2sus',
      description: 'ARRL Field Day 2025 - Join us for the premier emergency preparedness exercise in amateur radio. Questions? Find us on [Discord](https://discord.gg/seckc) and ask away!',
      isActive: true,
    },
    {
      name: 'Local Meetup',
      date: new Date('2025-05-15T17:00:00.000Z'), // 5:00 PM
      startTime: '5:00 PM',
      endTime: '9:00 PM',
      location: 'Tall Trellis Brew Co.',
      address: '25600 West Valley Parkway, Olathe, KS 66061 United States',
      mapUrl: 'https://www.google.com/maps/place/Tall+Trellis+Brew+Co./@38.9450675,-94.8871786,17z/data=!3m1!4b1!4m6!3m5!1s0x87c09778274906e5:0x8534144f0ecc2ff9!8m2!3d38.9450634!4d-94.8845983!16s%2Fg%2F11stzc5h4p',
      description: 'Local meetup for KS3CKC members at Tall Trellis Brew Co.',
      isActive: true,
    },
    {
      name: 'Summer Field Day',
      date: new Date('2024-06-15T12:00:00.000Z'),
      description: 'Summer Field Day event for amateur radio operators.',
      isActive: true,
    },
    {
      name: 'DX Contest',
      date: new Date('2024-04-30T12:00:00.000Z'),
      description: 'DX Contest for long-distance communication.',
      isActive: true,
    },
  ];

  // Only create events if they don't already exist
  for (const eventData of events) {
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