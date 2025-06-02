-- Migration script to populate News table with hardcoded news data
-- Run this after setting up the database

INSERT INTO "News" (id, "createdAt", "updatedAt", title, content, "authorId")
SELECT 
    'news_' || generate_random_uuid(),
    CASE 
        WHEN title = 'KS3CKC Achieves New Milestone in Long-Distance Communication' THEN '2024-03-01T00:00:00.000Z'::timestamp
        WHEN title = 'Upcoming Workshop: Advanced Techniques in Radio Frequency Optimization' THEN '2024-04-15T00:00:00.000Z'::timestamp
        WHEN title = 'Annual Ham Radio Contest: A Resounding Success' THEN '2024-05-20T00:00:00.000Z'::timestamp
        WHEN title = 'KS3CKC to Host a Series of Guest Talks on Emergency Communication' THEN '2024-06-10T00:00:00.000Z'::timestamp
        WHEN title = 'Member Spotlight: Journey of a Young Amateur Radio Operator' THEN '2024-07-05T00:00:00.000Z'::timestamp
        WHEN title = 'KS3CKC centers a div using RDF and APRS' THEN '2025-04-07T00:00:00.000Z'::timestamp
        WHEN title = 'Monthly SECKC Meetings Will Be at a New Location' THEN '2025-05-15T00:00:00.000Z'::timestamp
        WHEN title = 'SECKC Sweep Micro-contest Winners!' THEN '2025-05-15T12:00:00.000Z'::timestamp
    END,
    NOW(),
    title,
    content,
    (SELECT id FROM "User" WHERE email = 'admin@admin.com' LIMIT 1)
FROM (VALUES 
    ('KS3CKC Achieves New Milestone in Long-Distance Communication', 'The KS3CKC Ham Radio Club recently set a new record in long-distance communication, reaching an amateur radio operator in a remote location over 8,000 miles away. This achievement showcases the club''s commitment to advancing radio communication technologies.'),
    ('Upcoming Workshop: Advanced Techniques in Radio Frequency Optimization', 'Join us for an in-depth workshop on advanced radio frequency optimization techniques. The workshop, led by expert members of KS3CKC, will cover new strategies for enhancing signal strength and clarity.'),
    ('Annual Ham Radio Contest: A Resounding Success', 'KS3CKC''s annual Ham radio contest brought together enthusiasts from all over the region. Participants competed in various categories, demonstrating skill and creativity in radio communication.'),
    ('KS3CKC to Host a Series of Guest Talks on Emergency Communication', 'KS3CKC is proud to announce a series of guest lectures focusing on the role of amateur radio in emergency communication. Experts from various fields will discuss the importance of Ham radio during crises.'),
    ('Member Spotlight: Journey of a Young Amateur Radio Operator', 'In our member spotlight series, we feature the journey of a young radio enthusiast who discovered a passion for Ham radio through KS3CKC. Read about their inspiring journey in the world of amateur radio.'),
    ('KS3CKC centers a div using RDF and APRS', 'After hours of painstakingly attenuating antennas and debugging CSS, KS0CKC finally centered a <div> using only radio direction and APRS.'),
    ('Monthly SECKC Meetings Will Be at a New Location', 'SECKC is no longer meeting at Tall Tellis Brew Co. The next meeting will be hosted at Knuckleheads Garage. You can find more information on the events page.'),
    ('SECKC Sweep Micro-contest Winners!', 'From @hippieben on Discord - We have a winners! There was a tie between @adamfast and @Emma - VA2EMZ / K0UWU for the SecKC Sweep! Mini-contest. No tie breaker, you''re both winners to me!  Thanks for for all those that played and contributed QSOs to others who were playing. New mini-contest will drop in a couple weeks to start on 00:00 UTC 1st of June.')
) AS news_data(title, content)
WHERE NOT EXISTS (
    SELECT 1 FROM "News" WHERE title = news_data.title
);