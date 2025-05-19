import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

export default function NewsItems() {
  const cardBg = useColorModeValue('white', 'gray.800');

  const newsItems = [
    {
      title: 'KS3CKC Achieves New Milestone in Long-Distance Communication',
      date: '2024-03-01',
      content:
        "The KS3CKC Ham Radio Club recently set a new record in long-distance communication, reaching an amateur radio operator in a remote location over 8,000 miles away. This achievement showcases the club's commitment to advancing radio communication technologies.",
    },
    {
      title:
        'Upcoming Workshop: Advanced Techniques in Radio Frequency Optimization',
      date: '2024-04-15',
      content:
        'Join us for an in-depth workshop on advanced radio frequency optimization techniques. The workshop, led by expert members of KS3CKC, will cover new strategies for enhancing signal strength and clarity.',
    },
    {
      title: 'Annual Ham Radio Contest: A Resounding Success',
      date: '2024-05-20',
      content:
        "KS3CKC's annual Ham radio contest brought together enthusiasts from all over the region. Participants competed in various categories, demonstrating skill and creativity in radio communication.",
    },
    {
      title:
        'KS3CKC to Host a Series of Guest Talks on Emergency Communication',
      date: '2024-06-10',
      content:
        'KS3CKC is proud to announce a series of guest lectures focusing on the role of amateur radio in emergency communication. Experts from various fields will discuss the importance of Ham radio during crises.',
    },
    {
      title: 'Member Spotlight: Journey of a Young Amateur Radio Operator',
      date: '2024-07-05',
      content:
        'In our member spotlight series, we feature the journey of a young radio enthusiast who discovered a passion for Ham radio through KS3CKC. Read about their inspiring journey in the world of amateur radio.',
    },
    {
      title: 'KS3CKC centers a div using RDF and APRS',
      date: '2025-04-07',
      content:
        'After hours of painstakingly attenuating antennas and debugging CSS, KS0CKC finally centered a <div> using only radio direction and APRS.',
    },
    {
      title: 'Monthly SECKC Meetings Will Be at a New Location',
      date: '2025-05-15',
      content:
        'SECKC is no longer meeting at Tall Tellis Brew Co. The next meeting will be hosted at Knuckleheads Garage. You can find more information on the events page.',
    },
    {
      title: 'SECKC Sweep Micro-contest Winners!',
      date: '2025-05-15',
      content:
        "From @hippieben on Discord - We have a winners! There was a tie between @adamfast and @Emma - VA2EMZ / K0UWU for the SecKC Sweep! Mini-contest. No tie breaker, you're both winners to me!  Thanks for for all those that played and contributed QSOs to others who were playing. New mini-contest will drop in a couple weeks to start on 00:00 UTC 1st of June.",
    },
  ];

  return (
    <>
      <Heading as="h3" ms={4} size="lg">
        Latest News
      </Heading>
      {Array.isArray(newsItems) &&
        [...newsItems].reverse().map((item, i) => (
          <Box key={i} bg={cardBg} p={4} borderRadius="md" mb={4}>
            <Heading as="h3" size="md" mb={2}>
              {item.title}
            </Heading>
            <Text fontSize="sm" color="gray.400" mb={2}>
              {item.date}
            </Text>
            <Text fontSize="sm">{item.content}</Text>
          </Box>
        ))}
    </>
  );
}
