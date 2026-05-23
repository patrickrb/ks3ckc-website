/* global React */
// Direction B — CONSOLE / BLUEPRINT
// QSL postcard layouts, schematic accents, waveform graphics, hacker editorial.

const ConNav = () => (
  <header
    style={{
      padding: '20px 40px',
      borderBottom: '1px solid var(--line)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      background: 'rgba(11,13,18,0.92)',
      backdropFilter: 'blur(8px)',
      zIndex: 5,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width="32" height="32" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
        <circle cx="16" cy="16" r="3" fill="var(--orange)" />
        <circle
          cx="16"
          cy="16"
          r="8"
          fill="none"
          stroke="var(--orange)"
          strokeWidth="1"
          opacity="0.6"
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke="var(--orange)"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="16"
          y1="2"
          x2="16"
          y2="6"
          stroke="var(--orange)"
          strokeWidth="1.5"
        />
        <line
          x1="16"
          y1="26"
          x2="16"
          y2="30"
          stroke="var(--orange)"
          strokeWidth="1.5"
        />
        <line
          x1="2"
          y1="16"
          x2="6"
          y2="16"
          stroke="var(--orange)"
          strokeWidth="1.5"
        />
        <line
          x1="26"
          y1="16"
          x2="30"
          y2="16"
          stroke="var(--orange)"
          strokeWidth="1.5"
        />
      </svg>
      <div>
        <div
          className="mono label"
          style={{ marginBottom: 2, color: 'var(--orange)' }}
        >
          KS3CKC · EM28PW
        </div>
        <div
          style={{
            fontFamily: 'var(--display)',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '-0.01em',
          }}
        >
          SecKC Amateur Radio
        </div>
      </div>
    </div>
    <nav style={{ display: 'flex', gap: 28, fontSize: 14, fontWeight: 500 }}>
      {[
        'Home',
        'About',
        'Events',
        'Projects',
        'Frequencies',
        'License',
        'Members',
      ].map((l, i) => (
        <a
          key={l}
          href="#"
          style={{
            color: i === 0 ? 'var(--ink)' : 'var(--ink-2)',
            borderBottom: i === 0 ? '2px solid var(--orange)' : 'none',
            paddingBottom: 4,
          }}
        >
          {l}
        </a>
      ))}
    </nav>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span
        className="mono label"
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--green)',
            boxShadow: '0 0 8px var(--green)',
          }}
        />
        ON-AIR
      </span>
      <a
        href="#"
        className="con-btn"
        style={{ padding: '8px 16px', fontSize: 13 }}
      >
        Join the club
      </a>
    </div>
  </header>
);

// Animated waveform SVG hero accent
const ConWaveform = ({
  color = 'var(--orange)',
  opacity = 1,
  speed = 1,
  amp = 1,
}) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    let raf,
      t = 0;
    const draw = () => {
      const path = ref.current;
      if (!path) return;
      let d = 'M 0 50';
      for (let x = 0; x <= 800; x += 8) {
        const y =
          50 +
          Math.sin(x * 0.02 + t) * 18 * amp +
          Math.sin(x * 0.05 + t * 1.6) * 10 * amp +
          Math.sin(x * 0.13 + t * 0.7) * 4 * amp;
        d += ` L ${x} ${y}`;
      }
      path.setAttribute('d', d);
      t += 0.04 * speed;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [speed, amp]);
  return (
    <svg
      viewBox="0 0 800 100"
      preserveAspectRatio="none"
      style={{ width: '100%', height: '100%', opacity }}
    >
      <path ref={ref} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

const ConHero = () => (
  <section
    className="con-blueprint con-grid-bg"
    style={{
      padding: '80px 40px 60px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Background waveform */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.5,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: 0,
          right: 0,
          height: 100,
        }}
      >
        <ConWaveform color="var(--orange)" opacity={0.15} speed={0.6} amp={2} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: 0,
          right: 0,
          height: 100,
        }}
      >
        <ConWaveform color="var(--cyan)" opacity={0.1} speed={0.4} amp={1.4} />
      </div>
    </div>

    {/* Cross-hair + corner ticks */}
    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 4,
      }}
    >
      <span className="mono label label-orange">FILE-04 / HERO.SVG</span>
      <span className="mono label">REV 0026.05.04 · DRAFT</span>
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 60,
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}
        >
          <span
            className="con-stamp label-orange"
            style={{ color: 'var(--orange)' }}
          >
            ● Subgroup of #SecKC
          </span>
          <span className="con-stamp label" style={{ color: 'var(--ink-2)' }}>
            501(c)(3) · est. 2019
          </span>
        </div>
        <h1 style={{ fontSize: 88, margin: '0 0 24px', lineHeight: 0.95 }}>
          Hackers who
          <br />
          <span style={{ color: 'var(--orange)', fontStyle: 'italic' }}>
            broadcast
          </span>{' '}
          back.
        </h1>
        <p
          style={{
            fontSize: 19,
            color: 'var(--ink-2)',
            maxWidth: 580,
            marginBottom: 36,
            lineHeight: 1.55,
          }}
        >
          KS3CKC is the amateur radio club of{' '}
          <a href="#" style={{ borderBottom: '1px dashed currentColor' }}>
            SecKC
          </a>
          , the largest cybersecurity meetup in the country. We solder badges,
          run nets, chase DX, and reverse engineer protocols you've never heard
          of. Beginners welcome — we'll get you licensed.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a href="#" className="con-btn">
            Join the club <span>→</span>
          </a>
          <a href="#" className="con-btn con-btn-out">
            Get your license
          </a>
          <a
            href="#"
            style={{ color: 'var(--ink-2)', fontSize: 14, marginLeft: 8 }}
          >
            or just lurk a net ↗
          </a>
        </div>
      </div>

      {/* QSL card mockup */}
      <div style={{ position: 'relative', transform: 'rotate(-2deg)' }}>
        <div
          className="con-card"
          style={{
            background: 'linear-gradient(135deg, #1a1f2e 0%, #11141c 100%)',
            padding: 0,
            boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--line-2)',
          }}
        >
          <div className="con-corner-tl" />
          <div className="con-corner-tr" />
          <div className="con-corner-bl" />
          <div className="con-corner-br" />
          {/* QSL header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px dashed var(--line-2)',
            }}
          >
            <div className="mono label" style={{ marginBottom: 4 }}>
              RADIO QSO CONFIRMATION CARD
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--display)',
                  fontSize: 38,
                  fontWeight: 700,
                  color: 'var(--orange)',
                  letterSpacing: '0.02em',
                }}
              >
                KS3CKC
              </div>
              <div
                className="mono"
                style={{ fontSize: 11, color: 'var(--ink-3)' }}
              >
                FCC · GRID EM28PW
              </div>
            </div>
          </div>
          {/* Antenna SVG */}
          <div style={{ padding: '24px', position: 'relative', height: 180 }}>
            <svg
              viewBox="0 0 320 160"
              style={{ width: '100%', height: '100%' }}
            >
              {/* Concentric propagation rings */}
              {[1, 2, 3, 4].map((i) => (
                <circle
                  key={i}
                  cx="60"
                  cy="120"
                  r={i * 28}
                  fill="none"
                  stroke="var(--orange)"
                  strokeWidth="0.6"
                  opacity={0.5 / i}
                  strokeDasharray="2 4"
                />
              ))}
              {/* Tower */}
              <line
                x1="60"
                y1="120"
                x2="60"
                y2="40"
                stroke="var(--ink)"
                strokeWidth="1.5"
              />
              <line
                x1="50"
                y1="60"
                x2="70"
                y2="60"
                stroke="var(--ink)"
                strokeWidth="1"
              />
              <line
                x1="48"
                y1="80"
                x2="72"
                y2="80"
                stroke="var(--ink)"
                strokeWidth="1"
              />
              <line
                x1="46"
                y1="100"
                x2="74"
                y2="100"
                stroke="var(--ink)"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="60"
                x2="60"
                y2="40"
                stroke="var(--ink)"
                strokeWidth="0.5"
              />
              <line
                x1="70"
                y1="60"
                x2="60"
                y2="40"
                stroke="var(--ink)"
                strokeWidth="0.5"
              />
              <circle cx="60" cy="40" r="3" fill="var(--orange)" />
              {/* Signal arrow + KC -> Tokyo annotation */}
              <path
                d="M 60 40 Q 180 5 290 35"
                fill="none"
                stroke="var(--orange)"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <polygon points="290,35 282,30 284,38" fill="var(--orange)" />
              <text
                x="170"
                y="20"
                fill="var(--ink-2)"
                fontSize="9"
                fontFamily="var(--mono)"
              >
                14.230 MHz · SSB · +12dB
              </text>
              {/* Receiver dot */}
              <circle
                cx="290"
                cy="35"
                r="4"
                fill="none"
                stroke="var(--cyan)"
                strokeWidth="1.5"
              />
              <text
                x="265"
                y="55"
                fill="var(--cyan)"
                fontSize="9"
                fontFamily="var(--mono)"
              >
                JA1XKG
              </text>
              {/* Ground */}
              <line
                x1="0"
                y1="120"
                x2="320"
                y2="120"
                stroke="var(--ink-3)"
                strokeWidth="0.5"
                strokeDasharray="2 4"
              />
              <text
                x="0"
                y="135"
                fill="var(--ink-3)"
                fontSize="8"
                fontFamily="var(--mono)"
              >
                EM28pw
              </text>
              <text
                x="266"
                y="135"
                fill="var(--ink-3)"
                fontSize="8"
                fontFamily="var(--mono)"
              >
                PM95tn
              </text>
            </svg>
          </div>
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px dashed var(--line-2)',
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 12,
            }}
          >
            {[
              ['DATE', '04 MAY 26'],
              ['TIME', '21:42 UTC'],
              ['BAND', '20m'],
              ['MODE', 'SSB'],
            ].map(([k, v]) => (
              <div key={k}>
                <div
                  className="mono label"
                  style={{ fontSize: 9, marginBottom: 2 }}
                >
                  {k}
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 13, color: 'var(--ink)' }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Postage stamp */}
        <div
          style={{
            position: 'absolute',
            top: -16,
            right: -16,
            transform: 'rotate(8deg)',
            border: '1px solid var(--orange)',
            padding: '6px 10px',
            background: 'var(--bg)',
            textAlign: 'center',
            fontFamily: 'var(--mono)',
          }}
        >
          <div style={{ fontSize: 8, color: 'var(--ink-3)' }}>VIA RADIO</div>
          <div
            style={{ fontSize: 14, fontWeight: 700, color: 'var(--orange)' }}
          >
            73
          </div>
        </div>
      </div>
    </div>

    {/* Stats strip */}
    <div
      style={{
        marginTop: 64,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 0,
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      {[
        ['147', 'licensed members', '+12 ytd'],
        ['2', 'club repeaters', '70cm + 2m'],
        ['4,112', 'qsos logged', 'last 12 months'],
        ['$25', 'annual dues', 'tax deductible'],
      ].map(([n, l, s], i) => (
        <div
          key={i}
          style={{
            padding: '20px 24px',
            borderRight: i < 3 ? '1px solid var(--line)' : 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--display)',
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            {n}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 2 }}>
            {l}
          </div>
          <div className="mono label">{s}</div>
        </div>
      ))}
    </div>
  </section>
);

// Frequencies card
const ConFreqs = () => (
  <section style={{ padding: '80px 40px', position: 'relative' }}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr',
        gap: 60,
        alignItems: 'start',
      }}
    >
      <div>
        <div className="label label-orange" style={{ marginBottom: 12 }}>
          SECTION 02 / TUNE IN
        </div>
        <h2 style={{ fontSize: 56, margin: '0 0 20px' }}>
          Bookmark
          <br />
          these<span style={{ color: 'var(--orange)' }}>.</span>
        </h2>
        <p
          style={{
            color: 'var(--ink-2)',
            fontSize: 16,
            marginBottom: 24,
            maxWidth: 420,
          }}
        >
          Our two club repeaters cover the metro. Both keyed up by 69.3 Hz CTCSS
          tone. Members get extended privileges (link, autopatch, IRLP).
          Lurkers, listen freely.
        </p>
        <a
          href="#"
          style={{ color: 'var(--orange)', fontSize: 14, fontWeight: 600 }}
        >
          All frequencies & nets →
        </a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          {
            band: '70 cm',
            freq: '446.050',
            tone: '69.3 Hz',
            mode: 'FM Voice',
            note: 'Primary club repeater · KCMO · IRLP node 4042',
            primary: true,
            color: 'var(--orange)',
          },
          {
            band: '2 m',
            freq: '145.555',
            tone: '69.3 Hz',
            mode: 'FM Voice',
            note: 'Secondary club repeater · KCMO · linked Wed nights',
            primary: true,
            color: 'var(--amber)',
          },
          {
            band: '20 m',
            freq: '14.230',
            tone: '—',
            mode: 'SSB',
            note: 'HF club net · Sunday 20:00 CT · weather permitting',
            color: 'var(--cyan)',
          },
          {
            band: '20 m',
            freq: '14.074',
            tone: '—',
            mode: 'FT8',
            note: 'Digital — where we hide when bands are flat',
            color: 'var(--magenta)',
          },
        ].map((r, i) => (
          <div
            key={i}
            className="con-card"
            style={{
              padding: 0,
              borderColor: r.primary ? 'var(--line-2)' : 'var(--line)',
            }}
          >
            <div className="con-corner-tl" style={{ borderColor: r.color }} />
            <div className="con-corner-br" style={{ borderColor: r.color }} />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr auto auto',
                gap: 20,
                padding: '20px 22px',
                alignItems: 'center',
              }}
            >
              <div
                className="mono label"
                style={{ color: r.color, fontSize: 13 }}
              >
                {r.band}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--display)',
                    fontSize: 32,
                    fontWeight: 700,
                    color: r.primary ? 'var(--ink)' : 'var(--ink-2)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {r.freq}{' '}
                  <span
                    style={{
                      fontSize: 14,
                      color: 'var(--ink-3)',
                      fontWeight: 400,
                    }}
                  >
                    MHz
                  </span>
                </div>
                <div className="mono label" style={{ marginTop: 2 }}>
                  {r.note}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono label">TONE</div>
                <div
                  className="mono"
                  style={{ fontSize: 14, color: 'var(--ink)' }}
                >
                  {r.tone}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono label">MODE</div>
                <div
                  className="mono"
                  style={{ fontSize: 14, color: 'var(--ink)' }}
                >
                  {r.mode}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Events
const ConEvents = () => {
  const events = [
    {
      d: '15',
      m: 'MAY',
      dow: 'Wed',
      title: 'Weekly Club Net',
      sub: '21:00 CT · 446.050 / 145.555 · all welcome',
      tag: 'NET',
      primary: true,
    },
    {
      d: '18',
      m: 'MAY',
      dow: 'Sat',
      title: 'Field Day Antenna Build',
      sub: 'Shawnee Mission Park · BYOC (bring your own coax)',
      tag: 'BUILD',
    },
    {
      d: '21',
      m: 'MAY',
      dow: 'Tue',
      title: 'Monthly Meeting',
      sub: 'Recursion Brewing Co. · CW & digi practice after',
      tag: 'IRL',
      primary: true,
    },
    {
      d: '08',
      m: 'JUN',
      dow: 'Sat',
      title: 'ARRL Field Day 2026',
      sub: '24h on-air, class 3A KS · all hands · brisket',
      tag: 'BIG',
    },
    {
      d: '12',
      m: 'JUN',
      dow: 'Wed',
      title: 'License Exam Session',
      sub: 'SecKC HQ · $15 · Tech / General / Extra',
      tag: 'EXAM',
    },
  ];
  return (
    <section
      style={{
        padding: '80px 40px',
        background: 'var(--bg-2)',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 36,
        }}
      >
        <div>
          <div className="label label-cyan" style={{ marginBottom: 12 }}>
            SECTION 03 / SCHEDULE
          </div>
          <h2 style={{ fontSize: 56, margin: 0 }}>
            What's on
            <br />
            the air<span style={{ color: 'var(--orange)' }}>.</span>
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono label" style={{ marginBottom: 4 }}>
            NEXT MEETING IN
          </div>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 32,
              color: 'var(--orange)',
              fontWeight: 700,
            }}
          >
            02d : 14h : 22m
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16,
        }}
      >
        {events.map((e, i) => (
          <div
            key={i}
            className="con-card"
            style={{
              padding: 24,
              position: 'relative',
              minHeight: 220,
              background: e.primary
                ? 'linear-gradient(180deg, rgba(255,107,46,0.08), transparent)'
                : 'var(--panel)',
            }}
          >
            {e.primary && (
              <>
                <div className="con-corner-tl" />
                <div className="con-corner-tr" />
              </>
            )}
            <div className="mono label" style={{ marginBottom: 8 }}>
              {e.dow}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 6,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--display)',
                  fontSize: 56,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: e.primary ? 'var(--orange)' : 'var(--ink)',
                }}
              >
                {e.d}
              </span>
              <span
                className="mono"
                style={{ color: 'var(--ink-2)', fontSize: 13 }}
              >
                {e.m}
              </span>
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                marginBottom: 8,
                lineHeight: 1.2,
              }}
            >
              {e.title}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--ink-3)',
                lineHeight: 1.5,
                marginBottom: 16,
              }}
            >
              {e.sub}
            </div>
            <div
              className="con-stamp"
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                color:
                  e.tag === 'BIG'
                    ? 'var(--amber)'
                    : e.tag === 'EXAM'
                      ? 'var(--red)'
                      : e.tag === 'NET'
                        ? 'var(--green)'
                        : 'var(--cyan)',
              }}
            >
              {e.tag}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Featured projects with schematic accents
const ConProjects = () => {
  const projects = [
    {
      name: 'SecKC DC31 Badge',
      desc: 'ESP32-S3 conference badge with WiFi Marauder firmware. Open hardware.',
      tags: ['hardware', 'C++'],
      stars: 142,
      color: 'var(--orange)',
    },
    {
      name: 'NextLog',
      desc: 'Modern amateur radio logging — LoTW, Cloudlog API, multi-station, awards.',
      tags: ['software', 'TS'],
      stars: 87,
      color: 'var(--cyan)',
    },
    {
      name: 'SIGINT Project',
      desc: 'RTL-SDR based intruder detection. Classify RF intent in real time.',
      tags: ['SDR', 'Python'],
      stars: 54,
      color: 'var(--magenta)',
    },
    {
      name: 'Spectrum Painter',
      desc: 'Convert images to IQ streams. Make your callsign appear in waterfalls.',
      tags: ['SDR', 'art'],
      stars: 218,
      color: 'var(--amber)',
    },
  ];
  return (
    <section
      style={{ padding: '80px 40px', borderTop: '1px solid var(--line)' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 36,
        }}
      >
        <div>
          <div className="label label-amber" style={{ marginBottom: 12 }}>
            SECTION 04 / WORKBENCH
          </div>
          <h2 style={{ fontSize: 56, margin: 0 }}>
            What we
            <br />
            are building<span style={{ color: 'var(--orange)' }}>.</span>
          </h2>
        </div>
        <a href="#" className="con-btn con-btn-out">
          Browse all repos →
        </a>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
        }}
      >
        {projects.map((p, i) => (
          <a
            key={i}
            href="#"
            className="con-card"
            style={{
              padding: 28,
              textDecoration: 'none',
              color: 'inherit',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Schematic accent SVG corner */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                opacity: 0.18,
              }}
            >
              <circle
                cx="60"
                cy="60"
                r="40"
                fill="none"
                stroke={p.color}
                strokeWidth="1"
              />
              <line
                x1="20"
                y1="60"
                x2="100"
                y2="60"
                stroke={p.color}
                strokeWidth="0.5"
              />
              <line
                x1="60"
                y1="20"
                x2="60"
                y2="100"
                stroke={p.color}
                strokeWidth="0.5"
              />
              <rect
                x="50"
                y="50"
                width="20"
                height="20"
                fill="none"
                stroke={p.color}
                strokeWidth="0.7"
              />
              <circle cx="60" cy="60" r="3" fill={p.color} />
            </svg>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14,
              }}
            >
              {p.tags.map((t) => (
                <span key={t} className="con-stamp" style={{ color: p.color }}>
                  {t}
                </span>
              ))}
            </div>
            <h3
              style={{ fontSize: 26, margin: '0 0 10px', position: 'relative' }}
            >
              {p.name}
            </h3>
            <p
              style={{
                fontSize: 14,
                color: 'var(--ink-2)',
                lineHeight: 1.55,
                marginBottom: 22,
                position: 'relative',
              }}
            >
              {p.desc}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px dashed var(--line-2)',
                paddingTop: 14,
              }}
            >
              <span className="mono label">★ {p.stars} STARS · MIT</span>
              <span style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
                git clone →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

// Live activity panel — mini waterfall + recent QSOs
const ConActivity = () => {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = (c.width = 640),
      H = (c.height = 160);
    let frame = 0,
      raf;
    const palette = (v) => {
      // Cyan -> orange -> magenta heat ramp
      const r = Math.min(255, v * 320);
      const g = Math.min(255, v * 180);
      const b = Math.min(255, 80 + v * 40);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    };
    const draw = () => {
      const img = ctx.getImageData(0, 1, W, H - 1);
      ctx.putImageData(img, 0, 0);
      for (let x = 0; x < W; x++) {
        const noise = Math.random() * 0.2;
        const sig1 = Math.exp(
          -Math.pow((x - 160 + Math.sin(frame * 0.04) * 5) / 5, 2)
        );
        const sig2 =
          Math.exp(-Math.pow((x - 380) / 3, 2)) *
          (0.6 + Math.sin(frame * 0.18) * 0.4);
        const sig3 =
          Math.exp(-Math.pow((x - 510 + Math.cos(frame * 0.025) * 25) / 8, 2)) *
          0.6;
        const v = Math.min(1, noise + sig1 + sig2 + sig3);
        ctx.fillStyle = palette(v);
        ctx.fillRect(x, H - 1, 1, 1);
      }
      frame++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const qsos = [
    { call: 'WB0WAO', t: '3m', band: '20m', mode: 'SSB', rst: '59' },
    { call: 'KE0XYZ', t: '6m', band: '40m', mode: 'FT8', rst: '-08' },
    { call: 'JA1XKG', t: '14m', band: '20m', mode: 'FT8', rst: '-14' },
    { call: 'AC0DZ', t: '22m', band: '15m', mode: 'CW', rst: '579' },
    { call: 'KD0LRN', t: '38m', band: '2m', mode: 'FM', rst: 'fb' },
  ];

  return (
    <section
      style={{
        padding: '60px 40px',
        background: 'var(--bg-2)',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 28,
          alignItems: 'start',
        }}
      >
        <div>
          <div className="label label-cyan" style={{ marginBottom: 8 }}>
            ● LIVE / 14.074 MHz · FT8
          </div>
          <h3 style={{ fontSize: 22, margin: '0 0 14px' }}>
            Right now, on the air
          </h3>
          <div
            style={{
              position: 'relative',
              border: '1px solid var(--line-2)',
              background: '#000',
            }}
          >
            <canvas
              ref={canvasRef}
              style={{ display: 'block', width: '100%', height: 160 }}
            />
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                padding: '3px 8px',
                background: 'rgba(0,0,0,0.5)',
                fontFamily: 'var(--mono)',
                fontSize: 10,
                color: 'var(--cyan)',
              }}
            >
              STREAMING
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 10,
              color: 'var(--ink-3)',
              fontFamily: 'var(--mono)',
              marginTop: 6,
            }}
          >
            <span>−1500 Hz</span>
            <span>0 Hz</span>
            <span>+1500 Hz</span>
          </div>
        </div>
        <div>
          <div className="label label-amber" style={{ marginBottom: 8 }}>
            RECENT QSOs
          </div>
          <h3 style={{ fontSize: 22, margin: '0 0 14px' }}>
            Worked from KS3CKC/portable
          </h3>
          <div className="con-card" style={{ padding: 0 }}>
            {qsos.map((q, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 60px 60px 60px 50px',
                  padding: '12px 16px',
                  borderTop: i ? '1px solid var(--line)' : 'none',
                  alignItems: 'center',
                  fontSize: 13,
                }}
              >
                <span
                  className="mono"
                  style={{ color: 'var(--orange)', fontWeight: 700 }}
                >
                  {q.call}
                </span>
                <span style={{ color: 'var(--ink-2)', fontSize: 12 }}>
                  {q.band}
                </span>
                <span
                  className="mono"
                  style={{ color: 'var(--cyan)', fontSize: 12 }}
                >
                  {q.mode}
                </span>
                <span
                  className="mono"
                  style={{ color: 'var(--ink)', fontSize: 12 }}
                >
                  {q.rst}
                </span>
                <span className="mono label" style={{ textAlign: 'right' }}>
                  {q.t} ago
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ConJoin = () => (
  <section style={{ padding: '80px 40px', borderTop: '1px solid var(--line)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div className="con-card" style={{ padding: 36, position: 'relative' }}>
        <div className="con-corner-tl" />
        <div className="con-corner-tr" />
        <div className="con-corner-bl" />
        <div className="con-corner-br" />
        <div className="label label-cyan" style={{ marginBottom: 10 }}>
          STEP 1 — UNLOCK
        </div>
        <h3 style={{ fontSize: 36, margin: '0 0 12px' }}>
          Get licensed.
          <br />
          For free<span style={{ color: 'var(--orange)' }}>.</span>
        </h3>
        <p style={{ color: 'var(--ink-2)', fontSize: 15, marginBottom: 22 }}>
          The FCC Technician class is 35 questions. Most pass on first try. We
          run free study sessions and host VEC test days every second Wednesday.
        </p>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            'hamstudy.org → free practice tests',
            'Show up to a Wednesday net (just listen)',
            'Book a VEC session with us',
            'Pass. Callsign in ~10 days.',
          ].map((s, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 14,
                padding: '10px 0',
                borderBottom: i < 3 ? '1px dashed var(--line)' : 'none',
              }}
            >
              <span
                className="mono"
                style={{ color: 'var(--orange)', fontWeight: 700, width: 20 }}
              >
                0{i + 1}
              </span>
              <span style={{ fontSize: 14 }}>{s}</span>
            </li>
          ))}
        </ol>
        <a href="#" className="con-btn con-btn-out" style={{ marginTop: 24 }}>
          Get started →
        </a>
      </div>
      <div
        className="con-card"
        style={{
          padding: 36,
          position: 'relative',
          background:
            'linear-gradient(180deg, rgba(255,107,46,0.1), var(--panel))',
          borderColor: 'var(--orange)',
        }}
      >
        <div className="con-corner-tl" />
        <div className="con-corner-tr" />
        <div className="con-corner-bl" />
        <div className="con-corner-br" />
        <div className="label label-orange" style={{ marginBottom: 10 }}>
          STEP 2 — JOIN US
        </div>
        <h3 style={{ fontSize: 36, margin: '0 0 4px' }}>
          Membership<span style={{ color: 'var(--orange)' }}>.</span>
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
            marginBottom: 22,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--display)',
              fontSize: 60,
              fontWeight: 700,
              color: 'var(--orange)',
              lineHeight: 1,
            }}
          >
            $25
          </span>
          <span style={{ color: 'var(--ink-2)' }}>/ year · tax deductible</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
          {[
            'Repeater access (446.050, 145.555)',
            'Club callsign privileges',
            'Field day team + special events',
            'Badge kits at cost · solder lab access',
            'Discord, Wednesday nets, our shame',
          ].map((s, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                padding: '8px 0',
                fontSize: 14,
              }}
            >
              <span style={{ color: 'var(--orange)' }}>+</span> {s}
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="#" className="con-btn">
            Join now →
          </a>
          <a href="#" className="con-btn con-btn-out">
            Donate
          </a>
        </div>
      </div>
    </div>
  </section>
);

const ConFooter = () => (
  <footer
    style={{
      padding: '48px 40px 32px',
      borderTop: '1px solid var(--line)',
      background: 'var(--bg-2)',
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: 40,
        marginBottom: 32,
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="3" fill="var(--orange)" />
            <circle
              cx="16"
              cy="16"
              r="10"
              fill="none"
              stroke="var(--orange)"
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>
          <span
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            KS3CKC · SecKC Amateur Radio
          </span>
        </div>
        <p
          style={{
            fontSize: 13,
            color: 'var(--ink-3)',
            maxWidth: 360,
            lineHeight: 1.6,
          }}
        >
          The amateur radio subgroup of SecKC. Kansas City, MO · Grid EM28pw ·
          501(c)(3) EIN 88-XXXXXXX. All donations tax deductible.
        </p>
      </div>
      <div>
        <div className="label" style={{ marginBottom: 10 }}>
          SITE
        </div>
        {['About', 'Events', 'Projects', 'License', 'Members'].map((l) => (
          <div key={l} style={{ marginBottom: 6 }}>
            <a href="#" style={{ color: 'var(--ink-2)', fontSize: 13 }}>
              {l}
            </a>
          </div>
        ))}
      </div>
      <div>
        <div className="label" style={{ marginBottom: 10 }}>
          FRIENDS
        </div>
        {['SecKC.org', 'GitHub', 'Discord', 'QRZ.com', 'BadgePirates'].map(
          (l) => (
            <div key={l} style={{ marginBottom: 6 }}>
              <a href="#" style={{ color: 'var(--ink-2)', fontSize: 13 }}>
                {l} ↗
              </a>
            </div>
          )
        )}
      </div>
      <div>
        <div className="label" style={{ marginBottom: 10 }}>
          QUICK TUNE
        </div>
        <div
          className="mono"
          style={{ fontSize: 14, color: 'var(--orange)', marginBottom: 4 }}
        >
          446.050 <span style={{ color: 'var(--ink-3)' }}>· 69.3 Hz</span>
        </div>
        <div className="mono" style={{ fontSize: 14, color: 'var(--orange)' }}>
          145.555 <span style={{ color: 'var(--ink-3)' }}>· 69.3 Hz</span>
        </div>
      </div>
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--line)',
        paddingTop: 18,
        fontSize: 11,
        color: 'var(--ink-3)',
        fontFamily: 'var(--mono)',
      }}
    >
      <span>© 2019–2026 KS3CKC · MIT-ish · MADE WITH SOLDER + SEGFAULTS</span>
      <span>73 DE KS3CKC ●●●—— ●●● ●●●—— —●—● —●— —●—●</span>
    </div>
  </footer>
);

// ─── Member dashboard for Direction B ───
const ConDashboard = () => {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const utc = time.toUTCString().split(' ').slice(4, 5)[0];
  return (
    <div className="con" style={{ minHeight: 800, fontFamily: 'var(--sans)' }}>
      {/* Top bar */}
      <header
        style={{
          padding: '14px 28px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 700,
              color: 'var(--orange)',
            }}
          >
            KS3CKC
          </span>
          <nav style={{ display: 'flex', gap: 18, fontSize: 13 }}>
            {[
              'Dashboard',
              'Logbook',
              'Roster',
              'Repos',
              'Events',
              'Account',
            ].map((l, i) => (
              <a
                key={l}
                href="#"
                style={{
                  color: i === 0 ? 'var(--ink)' : 'var(--ink-2)',
                  borderBottom: i === 0 ? '2px solid var(--orange)' : 'none',
                  paddingBottom: 4,
                }}
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 12,
            fontFamily: 'var(--mono)',
            color: 'var(--ink-2)',
          }}
        >
          <span>{utc} UTC</span>
          <span style={{ width: 1, height: 14, background: 'var(--line-2)' }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--green)',
              }}
            />{' '}
            N0BURNS · ext
          </span>
        </div>
      </header>
      {/* Welcome */}
      <div
        style={{
          padding: '32px 28px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <div className="label label-orange" style={{ marginBottom: 6 }}>
            MEMBER · GOOD STANDING
          </div>
          <h1 style={{ fontSize: 36, margin: 0 }}>Welcome back, Patrick.</h1>
          <p style={{ color: 'var(--ink-2)', marginTop: 8, fontSize: 14 }}>
            147 members · 12 new this year · Bands fair, K=3, SFI=148
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="#" className="con-btn con-btn-out">
            Log a QSO
          </a>
          <a href="#" className="con-btn">
            Spin up net control →
          </a>
        </div>
      </div>
      {/* Grid */}
      <div
        style={{
          padding: '0 28px 32px',
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: 16,
        }}
      >
        {/* Left: Quick freqs (member) */}
        <div className="con-card" style={{ padding: 24 }}>
          <div className="con-corner-tl" />
          <div className="con-corner-tr" />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div className="label label-orange">
              CLUB FREQUENCIES · QUICK REFERENCE
            </div>
            <a href="#" className="label" style={{ color: 'var(--ink-2)' }}>
              edit ✎
            </a>
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
          >
            {[
              {
                label: '70 cm REPEATER',
                f: '446.050',
                t: '69.3 Hz',
                m: 'FM',
                c: 'var(--orange)',
              },
              {
                label: '2 m REPEATER',
                f: '145.555',
                t: '69.3 Hz',
                m: 'FM',
                c: 'var(--amber)',
              },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  padding: 18,
                  border: `1px solid ${r.c}`,
                  background: 'rgba(255,107,46,0.05)',
                }}
              >
                <div className="label" style={{ color: r.c, marginBottom: 6 }}>
                  {r.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--display)',
                    fontSize: 38,
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {r.f}
                  <span
                    style={{
                      fontSize: 14,
                      color: 'var(--ink-3)',
                      fontWeight: 400,
                    }}
                  >
                    {' '}
                    MHz
                  </span>
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 13, color: 'var(--ink-2)' }}
                >
                  tone {r.t} · mode {r.m}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--ink-3)' }}>
            ⌘K · type{' '}
            <span className="mono" style={{ color: 'var(--orange)' }}>
              freq
            </span>{' '}
            anywhere on the site to copy these.
          </div>
        </div>
        {/* Right: Net countdown */}
        <div
          className="con-card"
          style={{
            padding: 24,
            background:
              'linear-gradient(180deg, rgba(74,216,255,0.08), transparent)',
          }}
        >
          <div
            className="con-corner-tl"
            style={{ borderColor: 'var(--cyan)' }}
          />
          <div
            className="con-corner-br"
            style={{ borderColor: 'var(--cyan)' }}
          />
          <div className="label label-cyan" style={{ marginBottom: 10 }}>
            NEXT NET
          </div>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 30,
              fontWeight: 700,
              color: 'var(--cyan)',
              marginBottom: 10,
            }}
          >
            00d 06h 14m
          </div>
          <div
            style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 16 }}
          >
            Wed 21:00 CT · 446.050 · taking check-ins
          </div>
          <a
            href="#"
            className="con-btn con-btn-out"
            style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)' }}
          >
            Set reminder
          </a>
        </div>
        {/* Recent QSOs */}
        <div className="con-card" style={{ padding: 24, gridColumn: '1 / 2' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <div className="label label-amber">YOUR RECENT QSOs</div>
            <a href="#" className="label" style={{ color: 'var(--ink-2)' }}>
              full log →
            </a>
          </div>
          {[
            ['JA1XKG', '20m', 'FT8', '-14', '04 May · 21:42 UTC'],
            ['WB0WAO', '20m', 'SSB', '59', '04 May · 21:38 UTC'],
            ['AC0DZ', '15m', 'CW', '579', '04 May · 21:28 UTC'],
            ['KE0XYZ', '40m', 'FT8', '-08', '04 May · 03:14 UTC'],
          ].map((q, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 60px 60px 60px 1.2fr 100px',
                padding: '12px 0',
                borderTop: i ? '1px dashed var(--line)' : 'none',
                fontSize: 13,
                alignItems: 'center',
              }}
            >
              <span
                className="mono"
                style={{ color: 'var(--orange)', fontWeight: 700 }}
              >
                {q[0]}
              </span>
              <span style={{ color: 'var(--ink-2)' }}>{q[1]}</span>
              <span className="mono" style={{ color: 'var(--cyan)' }}>
                {q[2]}
              </span>
              <span className="mono">{q[3]}</span>
              <span className="mono" style={{ color: 'var(--ink-3)' }}>
                {q[4]}
              </span>
              <a href="#" style={{ textAlign: 'right', fontSize: 12 }}>
                QSL ↗
              </a>
            </div>
          ))}
        </div>
        {/* Member roster snapshot */}
        <div className="con-card" style={{ padding: 24 }}>
          <div className="label label-cyan" style={{ marginBottom: 14 }}>
            NEW MEMBERS · LAST 30D
          </div>
          {[
            ['Sarah K.', 'KE0SKC', 'Tech', 'EM28'],
            ['Mike R.', 'N0MIKE', 'General', 'EM28'],
            ['Jenny L.', 'KD0JLR', 'Tech', 'EM38'],
            ['Tom B.', 'AC0TBX', 'Extra', 'EM27'],
          ].map((m, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr auto auto',
                padding: '10px 0',
                borderTop: i ? '1px dashed var(--line)' : 'none',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: [
                    'var(--orange)',
                    'var(--cyan)',
                    'var(--magenta)',
                    'var(--amber)',
                  ][i],
                  opacity: 0.7,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--bg)',
                }}
              >
                {m[0][0]}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{m[0]}</div>
                <div className="mono label" style={{ fontSize: 10 }}>
                  {m[1]} · {m[3]}
                </div>
              </div>
              <span className="con-stamp" style={{ color: 'var(--ink-3)' }}>
                {m[2]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ConsolePage = () => (
  <div className="con">
    <ConNav />
    <ConHero />
    <ConFreqs />
    <ConActivity />
    <ConEvents />
    <ConProjects />
    <ConJoin />
    <ConFooter />
  </div>
);

window.ConsolePage = ConsolePage;
window.ConDashboard = ConDashboard;
