-- SQL Migration Script: Migrate Hardcoded Events to Database
-- Run this script after the Prisma schema has been deployed to add the hardcoded events

-- First, ensure we have an admin user to associate events with
-- This script assumes there's an admin user with email 'admin@admin.com'

-- Insert hardcoded events from the UpcomingEvents component
INSERT INTO "Event" (
  "id",
  "createdAt",
  "updatedAt",
  "name",
  "date",
  "startTime",
  "endTime",
  "location",
  "address",
  "mapUrl",
  "embedMapUrl",
  "description",
  "isActive",
  "authorId"
)
SELECT
  gen_random_uuid() as "id",
  NOW() as "createdAt",
  NOW() as "updatedAt",
  events_data."name",
  events_data."date",
  events_data."startTime",
  events_data."endTime",
  events_data."location",
  events_data."address",
  events_data."mapUrl",
  events_data."embedMapUrl",
  events_data."description",
  events_data."isActive",
  u."id" as "authorId"
FROM (
  VALUES
    (
      'Monthly Meetup',
      '2025-06-10 17:00:00'::timestamp,
      '5:00 PM',
      '9:00 PM',
      'Knuckleheads Garage',
      '701 N Montgall Ave, Kansas City, MO 64120',
      'https://maps.app.goo.gl/Z9yboWxsEh63QzuDA',
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3095.376287263093!2d-94.55174202405244!3d39.12066797167728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0fa6efbb5e74b%3A0xc88eb26af129a68b!2s701%20N%20Montgall%20Ave%2C%20Kansas%20City%2C%20MO%2064120!5e0!3m2!1sen!2sus!4v1747367871060!5m2!1sen!2sus',
      'Monthly meetup for KS3CKC members. Join us for networking, presentations, and ham radio discussions.',
      true
    ),
    (
      'ARRL Field Day 2025',
      '2025-06-27 15:00:00'::timestamp,
      '3:00 PM',
      '12:00 PM June 29, 2025',
      'Clinton State Park | Elk Creek Cabin',
      NULL,
      'https://maps.app.goo.gl/MTJgqTcw69tigJkE6',
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3103.748792336924!2d-95.36182731749331!3d38.92971887188787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87bf6b908a5cd5d1%3A0x628e97bd646e3552!2sElk%20Creek%20Cabin!5e0!3m2!1sen!2sus!4v1747367052821!5m2!1sen!2sus',
      'ARRL Field Day 2025 - Join us for the premier emergency preparedness exercise in amateur radio. Questions? Find us on Discord (https://discord.gg/seckc) and ask away!',
      true
    ),
    (
      'Local Meetup',
      '2025-05-15 17:00:00'::timestamp,
      '5:00 PM',
      '9:00 PM',
      'Tall Trellis Brew Co.',
      '25600 West Valley Parkway, Olathe, KS 66061 United States',
      'https://www.google.com/maps/place/Tall+Trellis+Brew+Co./@38.9450675,-94.8871786,17z/data=!3m1!4b1!4m6!3m5!1s0x87c09778274906e5:0x8534144f0ecc2ff9!8m2!3d38.9450634!4d-94.8845983!16s%2Fg%2F11stzc5h4p',
      NULL,
      'Local meetup for KS3CKC members at Tall Trellis Brew Co.',
      true
    ),
    (
      'Summer Field Day',
      '2024-06-15 12:00:00'::timestamp,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      'Summer Field Day event for amateur radio operators.',
      true
    ),
    (
      'DX Contest',
      '2024-04-30 12:00:00'::timestamp,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      'DX Contest for long-distance communication.',
      true
    )
) AS events_data(
  "name",
  "date",
  "startTime", 
  "endTime",
  "location",
  "address",
  "mapUrl",
  "embedMapUrl",
  "description",
  "isActive"
)
CROSS JOIN "User" u
WHERE u."email" = 'admin@admin.com'
AND NOT EXISTS (
  -- Only insert if the event doesn't already exist
  SELECT 1 FROM "Event" e 
  WHERE e."name" = events_data."name" 
  AND e."date" = events_data."date"
);

-- Verify the migration
SELECT 
  "name",
  "date",
  "location",
  "isActive",
  "createdAt"
FROM "Event"
ORDER BY "date" DESC;

-- Optional: Show count of events before and after
SELECT COUNT(*) as total_events FROM "Event";