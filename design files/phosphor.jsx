/* global React */
// Direction A — PHOSPHOR TERMINAL
// Full-tilt CRT/terminal vibe. Single tall scrollable mockup of the public site.

const { useState, useEffect, useRef } = React;

// ─── Helpers ───
const PhosNav = () => (
  <header
    style={{
      borderBottom: '1px solid var(--line-2)',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      background: 'var(--bg)',
      zIndex: 5,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ fontSize: 11, color: 'var(--green-dim)' }}>
        [ root@ks3ckc ~ ]$
      </span>
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--green)',
          letterSpacing: '0.04em',
        }}
      >
        KS3CKC<span style={{ color: 'var(--green-dim)' }}>.radio</span>
      </span>
      <span
        style={{
          fontSize: 10,
          color: 'var(--amber)',
          border: '1px solid var(--amber)',
          padding: '2px 6px',
        }}
      >
        501(c)(3)
      </span>
    </div>
    <nav style={{ display: 'flex', gap: 4, fontSize: 12 }}>
      {[
        '~/home',
        './about',
        './events',
        './projects',
        './freqs',
        './license',
        './join',
      ].map((l) => (
        <a
          key={l}
          href="#"
          style={{
            padding: '6px 10px',
            textDecoration: 'none',
            color: l === '~/home' ? 'var(--green)' : 'var(--green-dim)',
            background: l === '~/home' ? 'var(--green-deep)' : 'transparent',
          }}
        >
          {l}
        </a>
      ))}
    </nav>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 11,
        color: 'var(--green-dim)',
      }}
    >
      <span>↻ 14.230 MHz</span>
      <span style={{ color: 'var(--green)' }}>● ON-AIR</span>
      <a href="#" style={{ color: 'var(--green)' }}>
        login
      </a>
    </div>
  </header>
);

// SecKC figlet banner (in the style of the metasploit boot screen)
const ASCII_CALLSIGN = [
  '   sssssssssssssss                                                KKKKKKKKK    KKKKKKK     CCCCCCCCCCCCC',
  ' ss::::::::::::::s                                                K:::::::K    K:::::K  CCC::::::::::::C',
  'ss:::::::::::::::s                                                K:::::::K    K:::::KCC:::::::::::::::C',
  's::::::ssss:::::s                                                 K:::::::K   K::::::KC:::::CCCCCCCC::::C',
  ' s:::::s  ssssss      eeeeeeeeeeee        cccccccccccccccc        KK::::::K  K:::::KKKC:::::C       CCCCCC',
  '   s::::::s         ee::::::::::::ee    cc:::::::::::::::c          K:::::K K:::::K  C:::::C',
  '      s::::::s     e::::::eeeee:::::ee c:::::::::::::::::c          K::::::K:::::K   C:::::C',
  'ssssss   s:::::s  e::::::e     e:::::ec:::::::cccccc:::::c          K:::::::::::K    C:::::C',
  's:::::ssss::::::s e:::::::eeeee::::::ec::::::c     ccccccc          K:::::::::::K    C:::::C',
  's::::::::::::::s  e:::::::::::::::::e c:::::c                       K::::::K:::::K   C:::::C',
  ' s:::::::::::ss   e::::::eeeeeeeeeee  c:::::c                       K:::::K K:::::K  C:::::C',
  '         s::::::s e:::::::e           c::::::c     ccccccc        KK::::::K  K:::::KKKC:::::C       CCCCCC',
  ' ssssss   s:::::s e::::::::e          c:::::::cccccc:::::c        K:::::::K   K::::::KC:::::CCCCCCCC::::C',
  ' s:::::ssss::::::s e::::::::eeeeeeee   c:::::::::::::::::c        K:::::::K    K:::::K  CC:::::::::::::::C',
  ' s::::::::::::::s   ee:::::::::::::e    cc:::::::::::::::c        K:::::::K    K:::::K    CCC::::::::::::C',
  '  s:::::::::::ss      eeeeeeeeeeeeee      cccccccccccccccc        KKKKKKKKK    KKKKKKK       CCCCCCCCCCCCC',
  '   sssssssssss',
].join('\n');

// Cowsay (well, cow-bull) saying SECKC — style of the screenshot
const ASCII_TOWER = [
  ' ______________________________',
  '<  S E C K C  // KS3CKC SUBNET >',
  ' ------------------------------',
  '        \\   ^__^',
  '         \\  (oo)\\_______',
  '            (__)\\       )\\/\\',
  '                ||----w |',
  '                ||     ||',
].join('\n');

// Metasploit-style boot lines under the banner
const MSF_BOOT = [
  '       =[ metasploit v4.0.1-dev [core:4.0 api:1.0]',
  '+ -- --=[ 720 exploits - 362 auxiliary - 73 post',
  '+ -- --=[ 226 payloads - 27 encoders - 8 nops',
  '       =[ ks3ckc.radio  ham subnet  online since 2019',
].join('\n');

const PhosHero = () => {
  const [tickerIdx, setTickerIdx] = useState(0);
  const tickerLines = [
    '> sysop: welcome to ks3ckc — the seckc ham radio club',
    '> motd: nets every wednesday 21:00 CT on 446.050 (pl 69.3)',
    '> propagation: SFI=148  A=8  K=3  STORM=none  conditions: fair',
    '> last_qso: KE0XYZ → KS3CKC  20m SSB  +12 dB  3 minutes ago',
    '> next_meeting: T-2d 14h 22m — recursion brewing co. — KCMO',
  ];
  useEffect(() => {
    const t = setInterval(
      () => setTickerIdx((i) => (i + 1) % tickerLines.length),
      2400
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="phos-crt phos-flicker"
      style={{
        padding: '48px 32px 64px',
        minHeight: 720,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="phos-scanbar" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 48,
          alignItems: 'start',
        }}
      >
        <div>
          <div
            style={{ fontSize: 11, color: 'var(--green-dim)', marginBottom: 8 }}
          >
            // ks3ckc.radio :: ham subgroup of #seckc :: kansas city, mo
          </div>
          <pre
            style={{
              fontFamily: 'var(--mono)',
              color: 'var(--green)',
              fontSize: 9,
              lineHeight: 1.05,
              margin: 0,
              textShadow: '0 0 8px rgba(57,255,20,0.4)',
              overflow: 'hidden',
            }}
          >
            {ASCII_CALLSIGN}
          </pre>
          <pre
            style={{
              fontFamily: 'var(--mono)',
              color: 'var(--paper)',
              fontSize: 11,
              lineHeight: 1.15,
              margin: '8px 0 0',
              opacity: 0.9,
            }}
          >
            {ASCII_TOWER}
          </pre>
          <pre
            style={{
              fontFamily: 'var(--mono)',
              color: 'var(--green)',
              fontSize: 11,
              lineHeight: 1.4,
              margin: '14px 0 0',
              opacity: 0.85,
            }}
          >
            {MSF_BOOT}
          </pre>
          <h1
            style={{
              fontSize: 48,
              margin: '28px 0 14px',
              color: 'var(--paper)',
              textShadow: '0 0 12px rgba(57,255,20,0.35)',
            }}
          >
            we hack <span style={{ color: 'var(--green)' }}>radios</span>.<br />
            we radio <span style={{ color: 'var(--amber)' }}>hackers</span>.
          </h1>
          <p
            style={{
              fontSize: 16,
              maxWidth: 580,
              color: 'var(--paper)',
              opacity: 0.85,
              marginBottom: 28,
            }}
          >
            KS3CKC is the amateur radio club of <a href="#">SecKC</a> — the
            largest cybersecurity meetup in the country. We solder badges, chase
            DX, run nets, and break things on purpose. No ham license?{' '}
            <a href="#">we'll get you one</a>.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a className="phos-btn phos-btn-prim" href="#">
              ▶ join the club
            </a>
            <a className="phos-btn" href="#">
              cat ./next-meeting
            </a>
            <a className="phos-btn" href="#">
              man license
            </a>
          </div>

          {/* Live ticker */}
          <div
            style={{
              marginTop: 40,
              border: '1px solid var(--line-2)',
              background: 'rgba(13,40,24,0.5)',
              padding: '10px 14px',
              maxWidth: 620,
              fontSize: 13,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
                fontSize: 10,
                color: 'var(--green-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--green)',
                  boxShadow: '0 0 8px var(--green)',
                }}
              />
              live · /var/log/ks3ckc.log
            </div>
            <div
              style={{ color: 'var(--green)', minHeight: 20 }}
              className="phos-cursor"
            >
              {tickerLines[tickerIdx]}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              width: '100%',
              border: '1px solid var(--line-2)',
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: 'var(--green-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: 8,
              }}
            >
              $ whoami
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.7 }}>
              <div>
                <span style={{ color: 'var(--green-dim)' }}>callsign </span>
                <span style={{ color: 'var(--green)' }}>KS3CKC</span>
              </div>
              <div>
                <span style={{ color: 'var(--green-dim)' }}>grid </span>
                <span style={{ color: 'var(--paper)' }}>EM28pw</span>
              </div>
              <div>
                <span style={{ color: 'var(--green-dim)' }}>members </span>
                <span style={{ color: 'var(--paper)' }}>147 (+12 ytd)</span>
              </div>
              <div>
                <span style={{ color: 'var(--green-dim)' }}>founded </span>
                <span style={{ color: 'var(--paper)' }}>2019</span>
              </div>
              <div>
                <span style={{ color: 'var(--green-dim)' }}>status </span>
                <span style={{ color: 'var(--green)' }}>501(c)(3) ✓</span>
              </div>
              <div>
                <span style={{ color: 'var(--green-dim)' }}>parent </span>
                <span style={{ color: 'var(--paper)' }}>SecKC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Frequencies panel
const PhosFreqs = () => {
  const repeaters = [
    {
      label: '70cm RPT',
      freq: '446.0500',
      tone: '69.3',
      mode: 'FM',
      type: 'primary',
      loc: 'KCMO',
    },
    {
      label: '2m  RPT',
      freq: '145.5550',
      tone: '69.3',
      mode: 'FM',
      type: 'primary',
      loc: 'KCMO',
    },
    {
      label: 'simplex',
      freq: '146.5200',
      tone: '—',
      mode: 'FM',
      type: 'sec',
      loc: 'natl',
    },
    {
      label: 'hf  net',
      freq: ' 14.2300',
      tone: '—',
      mode: 'SSB',
      type: 'sec',
      loc: '20m',
    },
    {
      label: 'digi',
      freq: ' 14.0740',
      tone: '—',
      mode: 'FT8',
      type: 'sec',
      loc: '20m',
    },
  ];
  return (
    <section
      style={{ padding: '64px 32px', borderTop: '1px solid var(--line-2)' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <span style={{ color: 'var(--green-dim)' }}>$</span>
        <h2 style={{ fontSize: 28, margin: 0, color: 'var(--paper)' }}>
          cat /etc/frequencies
        </h2>
        <span style={{ color: 'var(--green-dim)', fontSize: 12 }}>
          # club repeaters & nets — bookmark this
        </span>
      </div>

      <div className="phos-panel">
        <div className="phos-panel-h">
          <span>club_repeaters.tsv</span>
          <span style={{ fontSize: 10 }}>5 entries · last update 2d ago</span>
        </div>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--mono)',
            fontSize: 13,
          }}
        >
          <thead>
            <tr
              style={{
                color: 'var(--green-dim)',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              <th style={{ textAlign: 'left', padding: '10px 14px' }}>name</th>
              <th style={{ textAlign: 'left', padding: '10px 14px' }}>
                freq (mhz)
              </th>
              <th style={{ textAlign: 'left', padding: '10px 14px' }}>tone</th>
              <th style={{ textAlign: 'left', padding: '10px 14px' }}>mode</th>
              <th style={{ textAlign: 'left', padding: '10px 14px' }}>loc</th>
              <th style={{ textAlign: 'right', padding: '10px 14px' }}>
                last_heard
              </th>
            </tr>
          </thead>
          <tbody>
            {repeaters.map((r, i) => (
              <tr
                key={i}
                style={{
                  borderTop: '1px dashed var(--line-2)',
                  background:
                    r.type === 'primary'
                      ? 'rgba(57,255,20,0.04)'
                      : 'transparent',
                }}
              >
                <td
                  style={{
                    padding: '10px 14px',
                    color:
                      r.type === 'primary' ? 'var(--green)' : 'var(--paper)',
                  }}
                >
                  {r.type === 'primary' && (
                    <span style={{ color: 'var(--amber)' }}>★ </span>
                  )}
                  {r.label}
                </td>
                <td
                  style={{
                    padding: '10px 14px',
                    color:
                      r.type === 'primary' ? 'var(--green)' : 'var(--paper)',
                  }}
                >
                  {r.freq}
                </td>
                <td style={{ padding: '10px 14px', color: 'var(--paper)' }}>
                  {r.tone}
                </td>
                <td style={{ padding: '10px 14px', color: 'var(--green-dim)' }}>
                  {r.mode}
                </td>
                <td style={{ padding: '10px 14px', color: 'var(--green-dim)' }}>
                  {r.loc}
                </td>
                <td
                  style={{
                    padding: '10px 14px',
                    textAlign: 'right',
                    color: 'var(--green-dim)',
                  }}
                >
                  {['12s', '4m', '1h', '22m', '3m'][i]} ago
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, color: 'var(--green-dim)' }}>
        $ <span className="phos-cursor">curl ks3ckc.radio/freqs.json | jq</span>{' '}
        &nbsp;&nbsp; <span style={{ color: 'var(--paper)' }}># yes really</span>
      </div>
    </section>
  );
};

// Waterfall + recent QSOs
const PhosWaterfall = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = (c.width = 800),
      H = (c.height = 220);
    let frame = 0;
    let raf;
    const draw = () => {
      // Shift up
      const img = ctx.getImageData(0, 1, W, H - 1);
      ctx.putImageData(img, 0, 0);
      // New row at bottom
      for (let x = 0; x < W; x++) {
        const noise = Math.random();
        const sig1 = Math.exp(
          -Math.pow((x - 200 + Math.sin(frame * 0.05) * 8) / 6, 2)
        );
        const sig2 =
          Math.exp(-Math.pow((x - 480) / 4, 2)) *
          (0.5 + Math.sin(frame * 0.2) * 0.5);
        const sig3 =
          Math.exp(-Math.pow((x - 620 + Math.cos(frame * 0.03) * 30) / 10, 2)) *
          0.7;
        const v = Math.min(1, noise * 0.15 + sig1 + sig2 + sig3);
        // Phosphor green palette
        const g = Math.floor(v * 255);
        const r = Math.floor(v * 80);
        ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + Math.floor(v * 40) + ')';
        ctx.fillRect(x, H - 1, 1, 1);
      }
      frame++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const qsos = [
    {
      call: 'WB0WAO',
      time: '21:42:18Z',
      band: '20m',
      mode: 'SSB',
      rst: '59',
      grid: 'EM28',
    },
    {
      call: 'KE0XYZ',
      time: '21:39:02Z',
      band: '40m',
      mode: 'FT8',
      rst: '-08',
      grid: 'EN35',
    },
    {
      call: 'N0SPY',
      time: '21:31:55Z',
      band: '70cm',
      mode: 'FM',
      rst: '59+',
      grid: 'EM28',
    },
    {
      call: 'AC0DZ',
      time: '21:28:11Z',
      band: '15m',
      mode: 'CW',
      rst: '579',
      grid: 'DM79',
    },
    {
      call: 'KD0LRN',
      time: '21:14:33Z',
      band: '2m',
      mode: 'FM',
      rst: 'fb',
      grid: 'EM28',
    },
    {
      call: 'JA1XKG',
      time: '20:51:09Z',
      band: '20m',
      mode: 'FT8',
      rst: '-14',
      grid: 'PM95',
    },
  ];

  return (
    <section
      style={{ padding: '64px 32px', borderTop: '1px solid var(--line-2)' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="phos-panel">
          <div className="phos-panel-h">
            <span>./waterfall.sh — 14.074 MHz · ft8</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--green)',
                  boxShadow: '0 0 6px var(--green)',
                }}
              />
              streaming
            </span>
          </div>
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              width: '100%',
              height: 220,
              background: '#000',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 10px',
              fontSize: 10,
              color: 'var(--green-dim)',
              borderTop: '1px solid var(--line-2)',
            }}
          >
            <span>−1500 Hz</span>
            <span>0</span>
            <span>+1500 Hz</span>
          </div>
        </div>

        <div className="phos-panel">
          <div className="phos-panel-h">
            <span>tail -f recent_qsos.log</span>
            <span style={{ fontSize: 10 }}>auto-refresh 30s</span>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
            {qsos.map((q, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '74px 70px 50px 60px 60px 1fr',
                  padding: '8px 12px',
                  borderBottom: '1px dashed var(--line)',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ color: 'var(--green-dim)' }}>{q.time}</span>
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>
                  {q.call}
                </span>
                <span style={{ color: 'var(--paper)' }}>{q.band}</span>
                <span style={{ color: 'var(--amber)' }}>{q.mode}</span>
                <span style={{ color: 'var(--paper)' }}>{q.rst}</span>
                <span
                  style={{
                    color: 'var(--green-dim)',
                    fontSize: 10,
                    textAlign: 'right',
                  }}
                >
                  {q.grid}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Morse code clickable
const PhosMorse = () => {
  const [pressed, setPressed] = useState([]);
  const [lastTap, setLastTap] = useState(Date.now());
  const word = 'KS3CKC';
  const morseMap = { K: '-.-', S: '...', 3: '...--', C: '-.-.' };
  return (
    <section
      style={{
        padding: '48px 32px',
        borderTop: '1px solid var(--line-2)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: 'var(--green-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          marginBottom: 8,
        }}
      >
        // press the key to spell K-S-3-C-K-C
      </div>
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 32,
          color: 'var(--green)',
          letterSpacing: '0.4em',
          textShadow: '0 0 12px rgba(57,255,20,0.4)',
        }}
      >
        {word
          .split('')
          .map((ch, i) => morseMap[ch])
          .join('  ')}
      </div>
      <div
        style={{
          marginTop: 18,
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <button
          onMouseDown={() => setPressed((p) => [...p, '·'])}
          onMouseUp={() => setLastTap(Date.now())}
          style={{
            width: 80,
            height: 50,
            background: 'var(--green-deep)',
            border: '1px solid var(--green)',
            color: 'var(--green)',
            cursor: 'pointer',
            fontSize: 24,
            fontFamily: 'var(--mono)',
          }}
        >
          ·
        </button>
        <button
          onMouseDown={() => setPressed((p) => [...p, '−'])}
          onMouseUp={() => setLastTap(Date.now())}
          style={{
            width: 80,
            height: 50,
            background: 'var(--green-deep)',
            border: '1px solid var(--green)',
            color: 'var(--green)',
            cursor: 'pointer',
            fontSize: 24,
            fontFamily: 'var(--mono)',
          }}
        >
          −
        </button>
        <button
          onClick={() => setPressed([])}
          style={{
            width: 80,
            height: 50,
            background: 'transparent',
            border: '1px dashed var(--line-2)',
            color: 'var(--green-dim)',
            cursor: 'pointer',
            fontSize: 11,
            fontFamily: 'var(--mono)',
          }}
        >
          clear
        </button>
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: 'var(--mono)',
          color: 'var(--amber)',
          fontSize: 18,
          minHeight: 24,
          letterSpacing: '0.3em',
        }}
      >
        {pressed.join(' ')}
        <span className="phos-cursor"></span>
      </div>
    </section>
  );
};

// Events / next meeting
const PhosEvents = () => {
  const events = [
    {
      d: 'WED',
      n: '15',
      month: 'MAY',
      title: 'club net :: 21:00 CT',
      loc: '446.050 / 145.555',
      tag: 'NET',
      recurring: true,
    },
    {
      d: 'SAT',
      n: '18',
      month: 'MAY',
      title: 'field day prep — antenna build',
      loc: 'shawnee mission park',
      tag: 'IRL',
    },
    {
      d: 'TUE',
      n: '21',
      month: 'MAY',
      title: 'monthly meeting + cw/digi practice',
      loc: 'recursion brewing co.',
      tag: 'IRL',
      primary: true,
    },
    {
      d: 'SAT',
      n: '08',
      month: 'JUN',
      title: 'arrl field day 2026',
      loc: 'tba — 3a kansas',
      tag: 'BIG',
    },
    {
      d: 'WED',
      n: '12',
      month: 'JUN',
      title: 'license exam session',
      loc: 'seckc hq',
      tag: 'EXAM',
    },
  ];
  return (
    <section
      style={{ padding: '64px 32px', borderTop: '1px solid var(--line-2)' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <span style={{ color: 'var(--green-dim)' }}>$</span>
        <h2 style={{ fontSize: 28, margin: 0, color: 'var(--paper)' }}>
          crontab -l
        </h2>
        <span style={{ color: 'var(--green-dim)', fontSize: 12 }}>
          # scheduled events — show all
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {events.map((e, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '78px 1fr auto',
              gap: 20,
              padding: '18px 16px',
              borderTop: '1px dashed var(--line-2)',
              borderLeft: e.primary
                ? '3px solid var(--green)'
                : '3px solid transparent',
              alignItems: 'center',
              background: e.primary ? 'rgba(57,255,20,0.04)' : 'transparent',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                borderRight: '1px dashed var(--line-2)',
                paddingRight: 16,
              }}
            >
              <div style={{ fontSize: 10, color: 'var(--green-dim)' }}>
                {e.d}
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: e.primary ? 'var(--green)' : 'var(--paper)',
                  lineHeight: 1,
                }}
              >
                {e.n}
              </div>
              <div style={{ fontSize: 10, color: 'var(--green-dim)' }}>
                {e.month}
              </div>
            </div>
            <div>
              <div
                style={{ fontSize: 16, color: 'var(--paper)', marginBottom: 4 }}
              >
                {e.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--green-dim)' }}>
                // {e.loc}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 10,
                  padding: '3px 8px',
                  border: '1px solid var(--line-2)',
                  color:
                    e.tag === 'BIG'
                      ? 'var(--amber)'
                      : e.tag === 'EXAM'
                        ? 'var(--red)'
                        : 'var(--green-d)',
                  borderColor:
                    e.tag === 'BIG'
                      ? 'var(--amber)'
                      : e.tag === 'EXAM'
                        ? 'var(--red)'
                        : 'var(--line-2)',
                }}
              >
                {e.tag}
              </span>
              <a
                href="#"
                className="phos-btn"
                style={{ fontSize: 11, padding: '4px 10px' }}
              >
                ./rsvp
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Projects
const PhosProjects = () => {
  const projects = [
    {
      name: 'seckc-badge-dc31',
      desc: 'esp32-s3 conference badge w/ wifi marauder firmware',
      stars: 142,
      lang: 'C++',
    },
    {
      name: 'nextlog',
      desc: 'modern amateur radio logging w/ lotw + cloudlog api',
      stars: 87,
      lang: 'TypeScript',
    },
    {
      name: 'sigint-project',
      desc: 'rtl-sdr based intruder detection. classify rf intent.',
      stars: 54,
      lang: 'Python',
    },
    {
      name: 'space-weather-bot',
      desc: 'discord bot posting solar/propagation stats daily',
      stars: 31,
      lang: 'Python',
    },
    {
      name: 'spectrum_painter',
      desc: 'convert images to iq streams. show up in waterfalls.',
      stars: 218,
      lang: 'Python',
    },
    {
      name: 'meshtastic-net',
      desc: 'kc area mesh network + firmware notes',
      stars: 19,
      lang: 'C',
    },
  ];
  return (
    <section
      style={{
        padding: '64px 32px',
        borderTop: '1px solid var(--line-2)',
        background: 'var(--bg-2)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <span style={{ color: 'var(--green-dim)' }}>$</span>
        <h2 style={{ fontSize: 28, margin: 0, color: 'var(--paper)' }}>
          ls -la ~/projects/
        </h2>
        <span style={{ color: 'var(--green-dim)', fontSize: 12 }}>
          # things we're building. PRs welcome.
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {projects.map((p, i) => (
          <a
            key={i}
            href="#"
            className="phos-panel"
            style={{
              textDecoration: 'none',
              padding: 0,
              transition: 'all .12s',
            }}
          >
            <div className="phos-panel-h" style={{ background: 'transparent' }}>
              <span style={{ color: 'var(--green)' }}>./{p.name}</span>
              <span style={{ color: 'var(--amber)' }}>★ {p.stars}</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--paper)',
                  marginBottom: 14,
                  lineHeight: 1.5,
                }}
              >
                {p.desc}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 11,
                  color: 'var(--green-dim)',
                }}
              >
                <span>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      display: 'inline-block',
                      background: 'var(--green)',
                      borderRadius: '50%',
                      marginRight: 6,
                    }}
                  />
                  {p.lang}
                </span>
                <span>git clone →</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

// License + Join section
const PhosJoin = () => (
  <section
    style={{ padding: '64px 32px', borderTop: '1px solid var(--line-2)' }}
  >
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      <div className="phos-panel">
        <div className="phos-panel-h">
          <span>./get-licensed.sh</span>
          <span style={{ color: 'var(--amber)' }}>recommended</span>
        </div>
        <div style={{ padding: '20px 22px' }}>
          <h3
            style={{ fontSize: 22, margin: '0 0 10px', color: 'var(--paper)' }}
          >
            no license? we got you.
          </h3>
          <p
            style={{
              fontSize: 14,
              color: 'var(--green-dim)',
              margin: '0 0 18px',
              lineHeight: 1.6,
            }}
          >
            the FCC technician class license is 35 questions, mostly multiple
            choice. we run free study sessions and you can test with us at $15.
          </p>
          <ol
            style={{
              paddingLeft: 18,
              margin: 0,
              color: 'var(--paper)',
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            <li>
              <span style={{ color: 'var(--green)' }}>$ </span>install{' '}
              <a href="#">hamstudy.org</a> — free practice tests
            </li>
            <li>
              <span style={{ color: 'var(--green)' }}>$ </span>show up to a
              wednesday club net, lurk
            </li>
            <li>
              <span style={{ color: 'var(--green)' }}>$ </span>book a vec
              session — 2nd wed of each month
            </li>
            <li>
              <span style={{ color: 'var(--green)' }}>$ </span>pass. callsign in
              ~10 days. welcome.
            </li>
          </ol>
          <a
            href="#"
            className="phos-btn phos-btn-prim"
            style={{ marginTop: 22 }}
          >
            ./bootstrap-license.sh
          </a>
        </div>
      </div>
      <div
        className="phos-panel"
        style={{ background: 'rgba(57,255,20,0.04)' }}
      >
        <div className="phos-panel-h">
          <span>sudo join ks3ckc</span>
          <span>$25/yr</span>
        </div>
        <div style={{ padding: '20px 22px' }}>
          <h3
            style={{ fontSize: 22, margin: '0 0 10px', color: 'var(--paper)' }}
          >
            become a member
          </h3>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 18px',
              fontSize: 14,
              color: 'var(--paper)',
              lineHeight: 1.9,
            }}
          >
            <li>
              <span style={{ color: 'var(--green)' }}>+</span> repeater access
              (446.050, 145.555)
            </li>
            <li>
              <span style={{ color: 'var(--green)' }}>+</span> club callsign
              privileges (KS3CKC/portable)
            </li>
            <li>
              <span style={{ color: 'var(--green)' }}>+</span> field day team +
              special events
            </li>
            <li>
              <span style={{ color: 'var(--green)' }}>+</span> badge kits at
              cost · solder lab access
            </li>
            <li>
              <span style={{ color: 'var(--green)' }}>+</span> our discord, our
              shame
            </li>
            <li>
              <span style={{ color: 'var(--green-dim)' }}>
                + tax-deductible — 501(c)(3)
              </span>
            </li>
          </ul>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="#" className="phos-btn phos-btn-prim">
              execve("/usr/bin/join")
            </a>
            <a href="#" className="phos-btn">
              donate
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PhosFooter = () => (
  <footer
    style={{
      padding: '40px 32px 32px',
      borderTop: '1px solid var(--line-2)',
      background: 'var(--bg-2)',
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: 32,
        marginBottom: 28,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--green)',
            marginBottom: 6,
          }}
        >
          KS3CKC<span style={{ color: 'var(--green-dim)' }}>.radio</span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--green-dim)',
            maxWidth: 320,
            lineHeight: 1.6,
          }}
        >
          the amateur radio subgroup of seckc. kansas city, mo. EM28pw.
          501(c)(3) ein 88-XXXXXXX. all donations tax deductible.
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: 10,
            color: 'var(--green-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: 10,
          }}
        >
          // nav
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            fontSize: 13,
          }}
        >
          <a href="#">about</a>
          <a href="#">events</a>
          <a href="#">projects</a>
          <a href="#">license</a>
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: 10,
            color: 'var(--green-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: 10,
          }}
        >
          // peer
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            fontSize: 13,
          }}
        >
          <a href="#">seckc.org</a>
          <a href="#">github</a>
          <a href="#">discord</a>
          <a href="#">qrz.com</a>
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: 10,
            color: 'var(--green-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: 10,
          }}
        >
          // freqs
        </div>
        <div
          style={{ fontSize: 13, fontFamily: 'var(--mono)', lineHeight: 1.7 }}
        >
          <div style={{ color: 'var(--green)' }}>
            446.050 <span style={{ color: 'var(--green-dim)' }}>69.3</span>
          </div>
          <div style={{ color: 'var(--green)' }}>
            145.555 <span style={{ color: 'var(--green-dim)' }}>69.3</span>
          </div>
        </div>
      </div>
    </div>
    <hr className="phos-rule" style={{ margin: '0 0 16px' }} />
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 11,
        color: 'var(--green-dim)',
      }}
    >
      <span>© 2019–2026 ks3ckc · MIT-ish · made with solder + segfaults</span>
      <span>
        <span className="phos-cursor">73 de KS3CKC</span>
      </span>
    </div>
  </footer>
);

const PhosphorPage = () => (
  <div className="phos">
    <PhosNav />
    <PhosHero />
    <PhosFreqs />
    <PhosWaterfall />
    <PhosMorse />
    <PhosEvents />
    <PhosProjects />
    <PhosJoin />
    <PhosFooter />
  </div>
);

window.PhosphorPage = PhosphorPage;
