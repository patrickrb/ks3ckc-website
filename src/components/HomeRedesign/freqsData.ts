export type FreqRow = {
  label: string;
  freq: string;
  tone: string;
  mode: string;
  type: 'primary' | 'sec';
  loc: string;
  lastHeard: string;
};

export const FREQUENCIES: FreqRow[] = [
  {
    label: '70cm',
    freq: '446.0500',
    tone: '69.3',
    mode: 'FM',
    type: 'primary',
    loc: 'KCMO',
    lastHeard: '12s',
  },
  {
    label: '2m',
    freq: '145.5550',
    tone: '69.3',
    mode: 'FM',
    type: 'primary',
    loc: 'KCMO',
    lastHeard: '4m',
  },
  {
    label: 'simplex',
    freq: '146.5200',
    tone: '—',
    mode: 'FM',
    type: 'sec',
    loc: 'natl',
    lastHeard: '1h',
  },
  {
    label: 'hf  net',
    freq: ' 14.2300',
    tone: '—',
    mode: 'SSB',
    type: 'sec',
    loc: '20m',
    lastHeard: '22m',
  },
  {
    label: 'digi',
    freq: ' 14.0740',
    tone: '—',
    mode: 'FT8',
    type: 'sec',
    loc: '20m',
    lastHeard: '3m',
  },
];
