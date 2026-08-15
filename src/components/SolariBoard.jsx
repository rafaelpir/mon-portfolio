import React, { useState, useEffect, useRef } from 'react';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 /.';

const BOARD_DATA = [
  { rubrique: 'NOM',          detail: 'RAFAEL PIRAL',       statut: 'ACTIF',      precision: 'DESIGNER'      },
  { rubrique: 'FORMATION',    detail: 'BUT2 MMI',           statut: 'EN COURS',   precision: 'IUT BOBIGNY'   },
  { rubrique: 'PARCOURS',     detail: 'CREATIONS NUM.',     statut: 'EN COURS',   precision: '2024 - 2026'   },
  { rubrique: 'RECHERCHE',    detail: 'ALTERNANCE',         statut: 'DISPONIBLE', precision: 'SEP 2026'      },
  { rubrique: 'LOCALISATION', detail: 'PRE SAINT GERVAIS', statut: 'FRANCE',     precision: 'ILE-DE-FRANCE' },
  { rubrique: 'CONTACT',      detail: 'rafa2002@hotmail.fr',statut: 'OUVERT',     precision: 'LINKEDIN'      },
];

const POSITIVE = new Set(['ACTIF', 'DISPONIBLE', 'OUVERT', 'EN COURS']);

const COLS = [
  { key: 'rubrique',  label: 'RUBRIQUE',  maxLen: 14 },
  { key: 'detail',    label: 'DETAIL',    maxLen: 20 },
  { key: 'statut',    label: 'STATUT',    maxLen: 10 },
  { key: 'precision', label: 'PRECISION', maxLen: 14 },
];

function pad(str, len) {
  return String(str || '').toUpperCase().padEnd(len, ' ').slice(0, len);
}

function CharTile({ char, dimmed, fontSize, tileH }) {
  const c = char === ' ' ? ' ' : char;
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '0.62em',
        height: tileH,
        margin: '0 0.5px',
        background: '#1c1c1c',
        borderRadius: '3px',
        flexShrink: 0,
        color: dimmed ? 'rgba(251,191,36,0.35)' : 'rgb(251,191,36)',
        transition: 'color 0.04s',
        fontSize,
      }}
    >
      {c}
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          height: '1px',
          background: 'rgba(0,0,0,0.65)',
          pointerEvents: 'none',
        }}
      />
    </span>
  );
}

function FlipField({ text, maxLen, animKey, colDelay, fontSize, tileH }) {
  const target = pad(text, maxLen);
  const [chars, setChars] = useState(() => target.split(''));
  const [dimmed, setDimmed] = useState(() => Array(maxLen).fill(false));
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  useEffect(() => {
    if (animKey === 0) {
      setChars(target.split(''));
      setDimmed(Array(maxLen).fill(false));
      return;
    }

    const targetChars = target.split('');
    const timers = [];

    targetChars.forEach((finalChar, i) => {
      const steps = 5 + Math.floor(Math.random() * 6);
      const baseDelay = colDelay + i * 38 + Math.random() * 15;

      for (let s = 0; s <= steps; s++) {
        const t = setTimeout(() => {
          if (!alive.current) return;
          if (s < steps) {
            const rnd = CHARSET[Math.floor(Math.random() * CHARSET.length)];
            setChars(prev => { const n = [...prev]; n[i] = rnd; return n; });
            setDimmed(prev => { const n = [...prev]; n[i] = true; return n; });
          } else {
            setChars(prev => { const n = [...prev]; n[i] = finalChar; return n; });
            setDimmed(prev => { const n = [...prev]; n[i] = false; return n; });
          }
        }, baseDelay + s * 52);
        timers.push(t);
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [animKey]);

  return (
    <span style={{ display: 'inline-flex', flexWrap: 'nowrap', fontFamily: 'monospace' }}>
      {chars.map((c, i) => (
        <CharTile key={i} char={c} dimmed={dimmed[i]} fontSize={fontSize} tileH={tileH} />
      ))}
    </span>
  );
}

export default function SolariBoard({ large = false }) {
  const [rowTriggers, setRowTriggers] = useState(() => BOARD_DATA.map(() => 0));
  const [activeRow, setActiveRow] = useState(null);
  const [time, setTime] = useState('');
  const cursor = useRef(0);

  // Tailles selon le mode
  const fontSize     = large ? 'clamp(0.75rem, 1.4vw, 1.15rem)' : '0.8rem';
  const tileH        = large ? '2em' : '1.6em';
  const rowPadV      = large ? '14px' : '11px';
  const rowPadH      = large ? '32px' : '24px';
  const headerFontSz = large ? 12 : 11;
  const colFontSz    = large ? 11 : 10;

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const iv = setInterval(update, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const fire = () => {
      const row = cursor.current;
      setActiveRow(row);
      setRowTriggers(prev => {
        const next = [...prev];
        next[row] = next[row] + 1;
        return next;
      });
      cursor.current = (cursor.current + 1) % BOARD_DATA.length;
    };

    fire();
    const iv = setInterval(fire, 2800);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      style={{
        background: '#0f0f0f',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #2a2a2a',
        boxShadow: '0 24px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.02)',
        userSelect: 'none',
        width: '100%',
      }}
    >
      {/* En-tête */}
      <div style={{
        background: '#0a0a0a',
        borderBottom: '1px solid #1e1e1e',
        padding: `${large ? 14 : 12}px ${rowPadH}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => (
              <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7, display: 'inline-block' }} />
            ))}
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: headerFontSz, letterSpacing: '0.15em', color: 'rgba(251,191,36,0.65)' }}>
            RAFAEL PIRAL · BUT2 MMI · LE PRÉ SAINT GERVAIS, FRANCE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'monospace', fontSize: headerFontSz, color: 'rgba(251,191,36,0.35)' }}>{time}</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
        </div>
      </div>

      {/* En-têtes colonnes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 3fr 1.5fr 2fr',
        padding: `8px ${rowPadH}`,
        borderBottom: '1px solid #1a1a1a',
        background: '#0c0c0c',
      }}>
        {COLS.map(col => (
          <span key={col.key} style={{
            fontFamily: 'monospace',
            fontSize: colFontSz,
            letterSpacing: '0.25em',
            color: 'rgba(251,191,36,0.2)',
            textTransform: 'uppercase',
          }}>
            {col.label}
          </span>
        ))}
      </div>

      {/* Lignes */}
      {BOARD_DATA.map((row, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 3fr 1.5fr 2fr',
            padding: `${rowPadV} ${rowPadH}`,
            borderBottom: '1px solid #161616',
            background: activeRow === i ? '#140f00' : '#0f0f0f',
            transition: 'background 0.35s ease',
          }}
        >
          {COLS.map((col, j) => (
            <span key={col.key} style={{ display: 'flex', alignItems: 'center', gap: col.key === 'statut' ? 6 : 0 }}>
              {col.key === 'statut' && POSITIVE.has(row.statut) && (
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
              )}
              <FlipField
                text={row[col.key]}
                maxLen={col.maxLen}
                animKey={rowTriggers[i]}
                colDelay={j * 90}
                fontSize={fontSize}
                tileH={tileH}
              />
            </span>
          ))}
        </div>
      ))}

      {/* Pied de page */}
      <div style={{
        background: '#0a0a0a',
        borderTop: '1px solid #1e1e1e',
        padding: `10px ${rowPadH}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'monospace', fontSize: colFontSz, letterSpacing: '0.2em', color: 'rgba(251,191,36,0.2)' }}>
          ALTERNANCE DISPONIBLE · SEP 2026
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: colFontSz, letterSpacing: '0.2em', color: 'rgba(251,191,36,0.2)' }}>
          rafaelpiral.fr
        </span>
      </div>
    </div>
  );
}
