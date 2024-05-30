import { useEffect, useState } from 'react';

import { Flex, Heading } from '@chakra-ui/react';

export default function HeroComponent() {
  // Pick a random hero image on page load
  const [heroImageNumber, setHeroImageNumber] = useState(
    Math.floor(Math.random() * 7) + 1
  );

  // setup a timer to change the hero image every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageNumber((prevNumber) => (prevNumber % 7) + 1);
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Flex
      bgImage={`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/heros/hero${heroImageNumber}.png')`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      h={{ base: '20rem', md: '25rem' }}
      align="center"
      justify="center"
      color="white"
    >
      <Flex flexDirection="column" align="center">
        <Heading as="h1" size="4xl">
          KS3CKC
        </Heading>
        <Heading as="h2" size="lg">
          SecKC Amateur Radio Club of Kansas City and Surrounding Cities for
          Amateur Radio
        </Heading>
      </Flex>
    </Flex>
  );
}
