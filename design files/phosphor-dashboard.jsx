/* global React */
// Direction A — Phosphor terminal MEMBER DASHBOARD

const PhosDashboard = () => {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const utcStr = time.toISOString().slice(11, 19) + 'Z';

  return (
    <div
      className="phos phos-crt phos-flicker"
      style={{ minHeight: 800, padding: 0 }}
    >
      <div className="phos-scanbar" />
      {/* Top bar */}
      <header
        style={{
          padding: '10px 24px',
          borderBottom: '1px solid var(--line-2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <span style={{ color: 'var(--green)' }}>
            KS3CKC
            <span style={{ color: 'var(--green-dim)' }}>.member-portal</span>
          </span>
          <span style={{ color: 'var(--green-dim)' }}>|</span>
          {['~/dashboard', './logbook', './roster', './repos', './events'].map(
            (l, i) => (
              <a
                key={l}
                href="#"
                style={{
                  color: i === 0 ? 'var(--green)' : 'var(--green-dim)',
                  textDecoration: i === 0 ? 'underline' : 'none',
                }}
              >
                {l}
              </a>
            )
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: 'var(--mono)',
          }}
        >
          <span style={{ color: 'var(--amber)' }}>{utcStr}</span>
          <span style={{ color: 'var(--green-dim)' }}>|</span>
          <span style={{ color: 'var(--green)' }}>● n0burns@ks3ckc</span>
        </div>
      </header>

      <div style={{ padding: '24px 24px 8px' }}>
        <div
          style={{ fontSize: 11, color: 'var(--green-dim)', marginBottom: 6 }}
        >
          $ login --user n0burns &amp;&amp; cat /etc/motd
        </div>
        <h1 style={{ fontSize: 32, margin: 0, color: 'var(--paper)' }}>
          welcome back, <span style={{ color: 'var(--green)' }}>n0burns</span>
          <span className="phos-cursor"></span>
        </h1>
        <div style={{ fontSize: 12, color: 'var(--green-dim)', marginTop: 6 }}>
          // 147 members · 12 new ytd · band conditions: fair · K=3 · SFI=148
        </div>
      </div>

      <div
        style={{
          padding: 24,
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: 16,
        }}
      >
        {/* Quick freqs */}
        <div className="phos-panel" style={{ gridColumn: '1 / 2' }}>
          <div className="phos-panel-h">
            <span>./club-freqs.sh — pinned</span>
            <span style={{ color: 'var(--amber)' }}>★ favorited</span>
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}
          >
            {[
              { l: '70cm REPEATER', f: '446.050', t: '69.3', p: '★ primary' },
              { l: '2m  REPEATER', f: '145.555', t: '69.3', p: '★ primary' },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  padding: '20px 22px',
                  borderRight: i === 0 ? '1px dashed var(--line-2)' : 'none',
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
                  {r.l}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 36,
                    color: 'var(--green)',
                    textShadow: '0 0 10px rgba(57,255,20,0.4)',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {r.f}{' '}
                  <span style={{ fontSize: 12, color: 'var(--green-dim)' }}>
                    MHz
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                    color: 'var(--paper)',
                  }}
                >
                  tone {r.t} Hz · FM ·{' '}
                  <span style={{ color: 'var(--amber)' }}>{r.p}</span>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: '8px 14px',
              borderTop: '1px dashed var(--line-2)',
              fontSize: 11,
              color: 'var(--green-dim)',
            }}
          >
            tip: hit{' '}
            <span
              style={{
                background: 'var(--green-deep)',
                padding: '1px 5px',
                color: 'var(--green)',
              }}
            >
              /freq
            </span>{' '}
            anywhere to jump back here
          </div>
        </div>

        {/* Net countdown */}
        <div className="phos-panel">
          <div className="phos-panel-h">
            <span>./next-net</span>
            <span>cron</span>
          </div>
          <div style={{ padding: 18 }}>
            <div
              style={{
                fontSize: 10,
                color: 'var(--green-dim)',
                marginBottom: 8,
              }}
            >
              NEXT NET IN
            </div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 28,
                color: 'var(--green)',
                textShadow: '0 0 10px rgba(57,255,20,0.4)',
              }}
            >
              00:06:14:32
            </div>
            <div style={{ fontSize: 11, color: 'var(--paper)', marginTop: 8 }}>
              wed 21:00 CT · 446.050
            </div>
            <a
              href="#"
              className="phos-btn"
              style={{ marginTop: 12, fontSize: 11, padding: '4px 10px' }}
            >
              ./set-reminder
            </a>
          </div>
        </div>

        {/* Propagation */}
        <div className="phos-panel">
          <div className="phos-panel-h">
            <span>./solar-tail</span>
            <span>n0nbh</span>
          </div>
          <div
            style={{
              padding: '14px 18px',
              fontFamily: 'var(--mono)',
              fontSize: 12,
              lineHeight: 1.7,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--green-dim)' }}>SFI</span>
              <span style={{ color: 'var(--green)' }}>148</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--green-dim)' }}>A-idx</span>
              <span style={{ color: 'var(--paper)' }}>8</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--green-dim)' }}>K-idx</span>
              <span style={{ color: 'var(--amber)' }}>3</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--green-dim)' }}>X-ray</span>
              <span style={{ color: 'var(--paper)' }}>B2.4</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--green-dim)' }}>storm</span>
              <span style={{ color: 'var(--green)' }}>none</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--green-dim)' }}>20m</span>
              <span style={{ color: 'var(--green)' }}>good</span>
            </div>
          </div>
        </div>

        {/* Recent QSOs */}
        <div className="phos-panel" style={{ gridColumn: '1 / 3' }}>
          <div className="phos-panel-h">
            <span>tail -f ~/.logbook</span>
            <span>4112 entries</span>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
            {[
              ['21:42:18Z', 'JA1XKG', '20m', 'FT8', '-14', 'PM95', 'tokyo, jp'],
              ['21:38:02Z', 'WB0WAO', '20m', 'SSB', '59', 'EM28', 'kcmo'],
              ['21:28:11Z', 'AC0DZ', '15m', 'CW', '579', 'DM79', 'denver'],
              ['03:14:33Z', 'KE0XYZ', '40m', 'FT8', '-08', 'EN35', 'mn'],
              ['02:51:09Z', 'KD0LRN', '2m', 'FM', 'fb', 'EM28', 'kcmo'],
            ].map((q, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 80px 50px 60px 50px 50px 1fr 60px',
                  padding: '8px 14px',
                  borderBottom: '1px dashed var(--line)',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ color: 'var(--green-dim)' }}>{q[0]}</span>
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>
                  {q[1]}
                </span>
                <span style={{ color: 'var(--paper)' }}>{q[2]}</span>
                <span style={{ color: 'var(--amber)' }}>{q[3]}</span>
                <span style={{ color: 'var(--paper)' }}>{q[4]}</span>
                <span style={{ color: 'var(--green-dim)' }}>{q[5]}</span>
                <span style={{ color: 'var(--green-dim)' }}>// {q[6]}</span>
                <a href="#" style={{ textAlign: 'right', fontSize: 10 }}>
                  ./qsl
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* New members */}
        <div className="phos-panel">
          <div className="phos-panel-h">
            <span>./roster --new 30d</span>
            <span>+12 ytd</span>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
            {[
              ['sarah_k', 'KE0SKC', 'tech'],
              ['mike_r', 'N0MIKE', 'general'],
              ['jenny_l', 'KD0JLR', 'tech'],
              ['tom_b', 'AC0TBX', 'extra'],
            ].map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  padding: '8px 14px',
                  borderBottom: '1px dashed var(--line)',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ color: 'var(--paper)' }}>{m[0]}</span>
                <span style={{ color: 'var(--green)' }}>{m[1]}</span>
                <span
                  style={{
                    color: 'var(--green-dim)',
                    fontSize: 10,
                    border: '1px solid var(--line-2)',
                    padding: '1px 6px',
                  }}
                >
                  {m[2]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

window.PhosDashboard = PhosDashboard;
