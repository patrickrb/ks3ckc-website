'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import { PHOS, blink } from './phosphorTheme';

const CALLSIGN = 'KS3CKC';
const MORSE_MAP: Record<string, string> = {
  K: '-.-',
  S: '...',
  '3': '...--',
  C: '-.-.',
};

const WPM = 18;
const UNIT_MS = 1200 / WPM;
const FREQ_HZ = 600;
const VOLUME = 0.18;
const ATTACK_S = 0.005;
const LEAD_IN_S = 0.05;

type Atom = {
  kind: 'tone' | 'gap';
  ms: number;
  charIdx: number;
  symIdx: number;
};

function buildSequence(text: string): Atom[] {
  const out: Atom[] = [];
  const chars = text.split('');
  chars.forEach((ch, ci) => {
    const pattern = MORSE_MAP[ch] ?? '';
    pattern.split('').forEach((sym, si) => {
      out.push({
        kind: 'tone',
        ms: sym === '-' ? 3 * UNIT_MS : UNIT_MS,
        charIdx: ci,
        symIdx: si,
      });
      if (si < pattern.length - 1) {
        out.push({ kind: 'gap', ms: UNIT_MS, charIdx: ci, symIdx: si });
      }
    });
    if (ci < chars.length - 1) {
      out.push({ kind: 'gap', ms: 3 * UNIT_MS, charIdx: ci, symIdx: -1 });
    }
  });
  return out;
}

export default function PhosMorse() {
  const [playing, setPlaying] = useState(false);
  const [activeChar, setActiveChar] = useState(-1);
  const [activeSym, setActiveSym] = useState(-1);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const timersRef = useRef<number[]>([]);

  const stopAll = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch {
        // already stopped
      }
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    setPlaying(false);
    setActiveChar(-1);
    setActiveSym(-1);
  };

  useEffect(() => {
    return () => {
      stopAll();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  const play = async () => {
    if (playing) {
      stopAll();
      return;
    }

    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
    const audio = audioCtxRef.current;
    if (audio.state === 'suspended') await audio.resume();

    const seq = buildSequence(CALLSIGN);

    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'sine';
    osc.frequency.value = FREQ_HZ;
    gain.gain.value = 0;
    osc.connect(gain).connect(audio.destination);

    let cursor = audio.currentTime + LEAD_IN_S;
    osc.start(cursor);
    oscRef.current = osc;

    let elapsedMs = 0;
    for (const atom of seq) {
      const startSec = cursor;
      const endSec = cursor + atom.ms / 1000;
      if (atom.kind === 'tone') {
        gain.gain.setValueAtTime(0, startSec);
        gain.gain.linearRampToValueAtTime(VOLUME, startSec + ATTACK_S);
        gain.gain.setValueAtTime(VOLUME, endSec - ATTACK_S);
        gain.gain.linearRampToValueAtTime(0, endSec);

        const charIdx = atom.charIdx;
        const symIdx = atom.symIdx;
        const at = elapsedMs;
        timersRef.current.push(
          window.setTimeout(() => {
            setActiveChar(charIdx);
            setActiveSym(symIdx);
          }, at)
        );
      } else {
        gain.gain.setValueAtTime(0, startSec);
      }
      cursor = endSec;
      elapsedMs += atom.ms;
    }
    osc.stop(cursor + 0.05);

    timersRef.current.push(
      window.setTimeout(() => {
        oscRef.current = null;
        setPlaying(false);
        setActiveChar(-1);
        setActiveSym(-1);
      }, elapsedMs + 100)
    );

    setPlaying(true);
  };

  const charPatterns = CALLSIGN.split('').map((ch) => ({
    ch,
    pattern: (MORSE_MAP[ch] ?? '').split(''),
  }));

  return (
    <Box
      as="section"
      px={{ base: 4, md: 8 }}
      py={{ base: 10, md: 12 }}
      borderTop="1px solid"
      borderColor={PHOS.line2}
      textAlign="center"
      fontFamily={PHOS.mono}
    >
      <Text
        fontSize="10px"
        color={PHOS.greenDim}
        textTransform="uppercase"
        letterSpacing="0.18em"
        mb={4}
      >
        {`// ./play_callsign.sh — KS3CKC @ ${WPM} wpm`}
      </Text>

      <Flex justify="center" gap={{ base: 4, md: 6 }} mb={5} flexWrap="wrap">
        {charPatterns.map((cp, ci) => (
          <Flex key={ci} direction="column" align="center" gap={1.5}>
            <Text
              fontSize="11px"
              color={ci === activeChar ? PHOS.amber : PHOS.greenDim}
              letterSpacing="0.18em"
              transition="color 80ms"
            >
              {cp.ch}
            </Text>
            <Flex gap={1.5}>
              {cp.pattern.map((sym, si) => {
                const isActive = ci === activeChar && si === activeSym;
                return (
                  <Text
                    key={si}
                    as="span"
                    fontSize={{ base: '26px', md: '36px' }}
                    lineHeight="1"
                    color={isActive ? PHOS.amber : PHOS.green}
                    textShadow={
                      isActive
                        ? '0 0 14px rgba(255,176,0,0.65)'
                        : '0 0 10px rgba(57,255,20,0.35)'
                    }
                    transition="color 60ms, text-shadow 60ms"
                  >
                    {sym === '-' ? '−' : '·'}
                  </Text>
                );
              })}
            </Flex>
          </Flex>
        ))}
      </Flex>

      <Box
        as="button"
        onClick={play}
        px={6}
        h="44px"
        bg={playing ? PHOS.amber : PHOS.greenDeep}
        border="1px solid"
        borderColor={playing ? PHOS.amber : PHOS.green}
        color={playing ? PHOS.bg : PHOS.green}
        cursor="pointer"
        fontSize="13px"
        fontFamily={PHOS.mono}
        letterSpacing="0.18em"
        textTransform="uppercase"
        fontWeight="700"
        transition="background 80ms, color 80ms, border-color 80ms"
        _hover={{
          bg: playing ? PHOS.amberD : PHOS.green,
          color: PHOS.bg,
          borderColor: playing ? PHOS.amberD : PHOS.green,
        }}
      >
        {playing ? '■ stop' : '▶ play KS3CKC'}
      </Box>

      <Text mt={3} fontSize="11px" color={PHOS.greenDim}>
        {playing ? '> transmitting…' : '> press to key the callsign'}
        <Box
          as="span"
          display="inline-block"
          ml="2px"
          color={PHOS.green}
          animation={`${blink} 1s steps(1) infinite`}
        >
          █
        </Box>
      </Text>
    </Box>
  );
}
