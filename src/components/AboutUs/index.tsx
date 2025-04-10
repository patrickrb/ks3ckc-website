import {
  Box,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  useColorModeValue,
} from '@chakra-ui/react';

export default function AboutUs() {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <>
      <Heading as="h2" ms={4} size="lg">
        About Us
      </Heading>
      <Text fontSize="md" mx={4} mb={5}>
        Welcome to the SecKC Amateur Radio Club of Kansas City and Surrounding
        Cities for Amateur Radio, your local hub for all things related to ham
        radio and hacking! As a proud part of SecKC, the world's largest hacking
        meetup, our club brings together enthusiasts from diverse backgrounds
        who share a passion for exploring, innovating, and breaking barriers in
        the fields of radio communication and cybersecurity.
      </Text>
      <Box bg={cardBg} p={4} borderRadius="md" mb={4}>
        <Heading as="h3" size="md" mb={2}>
          Who We Are
        </Heading>
        <Text fontSize="md" mb={5}>
          Founded by a group of dedicated hobbyists and professionals, the SecKC
          Amateur Radio Club of Kansas City and Surrounding Cities for Amateur
          Radio is a community where technology enthusiasts can come together to
          learn, share, and collaborate. Our members range from novice tinkerers
          to seasoned experts, all united by a common interest in the
          fascinating world of ham radio and hacking.
        </Text>
        <Heading as="h3" size="md" mb={2}>
          What We Do
        </Heading>
        <Text fontSize="md" mb={5}>
          Our activities and events are designed to cater to a wide array of
          interests and skill levels. From hands-on workshops and technical
          talks to social gatherings and collaborative projects, there’s always
          something happening at our club. We cover topics such as:
        </Text>
        <Box m={15}>
          <UnorderedList>
            <ListItem>Ham radio operation and techniques</ListItem>
            <ListItem>Building and programming radio equipment</ListItem>
            <ListItem>Cybersecurity practices and ethical hacking</ListItem>
            <ListItem>Signal processing and data analysis</ListItem>
            <ListItem>Emergency communication setups</ListItem>
          </UnorderedList>
        </Box>
        <Heading as="h3" size="md" mb={2}>
          Join Us
        </Heading>
        <Text fontSize="md" mb={5}>
          Whether you're looking to hone your skills, gain new knowledge, or
          simply connect with like-minded individuals, the Kansas City Ham
          Hacker Club is the perfect place for you. We meet regularly to share
          our experiences, troubleshoot challenges, and work on exciting
          projects. Our community is open and welcoming, and we encourage anyone
          with an interest in ham radio or hacking to join us.
        </Text>
        <Heading as="h3" size="md" mb={2}>
          Get Involved
        </Heading>
        <Text fontSize="md" mb={5}>
          Stay updated with our latest news, events, and activities by following
          us on our social media channels and joining our mailing list.
          Membership is open to all, and we offer a variety of resources and
          support to help you get started on your journey.
        </Text>
        <Heading as="h3" size="md" mb={2}>
          Contact Us
        </Heading>
        <Text fontSize="md" mb={5}>
          For more information, or to get in touch with us, feel free to reach
          out via our contact page. We look forward to meeting you and exploring
          the limitless possibilities of ham radio and hacking together! Welcome
          to the SecKC Amateur Radio Club of Kansas City and Surrounding Cities
          for Amateur Radio – where curiosity meets innovation!
        </Text>
      </Box>
    </>
  );
}
