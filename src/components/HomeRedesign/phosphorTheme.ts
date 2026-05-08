import { keyframes } from '@emotion/react';

export const PHOS = {
  bg: '#0a0f0a',
  bg2: '#0d150d',
  panel: '#0e1a0e',
  line: '#1f3a1f',
  line2: '#2a5a2a',
  green: '#39ff14',
  greenD: '#00ff9c',
  greenDim: '#1a8a1a',
  greenDeep: '#0d2818',
  paper: '#e5ffe5',
  amber: '#ffb000',
  amberD: '#ffc845',
  red: '#ff3a3a',
  mono: "'JetBrains Mono', 'IBM Plex Mono', 'Fira Code', ui-monospace, Menlo, monospace",
};

export const flicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.97; }
  52% { opacity: 0.92; }
  53% { opacity: 1; }
`;

export const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

export const scan = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(2000%); }
`;

// Reusable styled-prop bundles for Chakra inputs/buttons that should
// match the phosphor terminal aesthetic.
export const phosInputProps = {
  bg: PHOS.bg,
  color: PHOS.paper,
  border: '1px solid',
  borderColor: PHOS.line2,
  borderRadius: 0,
  fontFamily: PHOS.mono,
  fontSize: '14px',
  _placeholder: { color: PHOS.greenDim, opacity: 1 },
  _hover: { borderColor: PHOS.greenDim },
  _focus: {
    borderColor: PHOS.green,
    boxShadow: `0 0 0 1px ${PHOS.green}`,
    bg: PHOS.bg,
  },
  _focusVisible: {
    borderColor: PHOS.green,
    boxShadow: `0 0 0 1px ${PHOS.green}`,
  },
  _autofill: {
    boxShadow: `0 0 0 1000px ${PHOS.bg} inset`,
    textFillColor: PHOS.paper,
  },
};

export const phosPrimaryBtn = {
  bg: PHOS.green,
  color: PHOS.bg,
  borderRadius: 0,
  fontFamily: PHOS.mono,
  fontWeight: 700,
  letterSpacing: '0.02em',
  border: '1px solid',
  borderColor: PHOS.green,
  _hover: { bg: PHOS.greenD, borderColor: PHOS.greenD },
  _active: { bg: PHOS.greenDim },
  _disabled: {
    opacity: 0.4,
    bg: PHOS.greenDim,
    cursor: 'not-allowed',
  },
};

export const phosGhostBtn = {
  bg: 'transparent',
  color: PHOS.green,
  borderRadius: 0,
  fontFamily: PHOS.mono,
  fontWeight: 600,
  letterSpacing: '0.02em',
  border: '1px solid',
  borderColor: PHOS.green,
  _hover: { bg: PHOS.greenDeep, color: PHOS.greenD },
  _active: { bg: PHOS.greenDeep },
};
