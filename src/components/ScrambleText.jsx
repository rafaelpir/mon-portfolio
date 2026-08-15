import React, { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function ScrambleChar({ char, delay }) {
  const [display, setDisplay] = useState(' ');
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  useEffect(() => {
    const steps = 9 + Math.floor(Math.random() * 5);
    let step = 0;

    const tid = setTimeout(() => {
      const iv = setInterval(() => {
        if (!alive.current) { clearInterval(iv); return; }
        step++;
        if (step < steps) {
          setDisplay(CHARS[Math.floor(Math.random() * CHARS.length)]);
        } else {
          setDisplay(char === ' ' ? ' ' : char);
          clearInterval(iv);
        }
      }, 38);
    }, delay);

    return () => clearTimeout(tid);
  }, [char, delay]);

  return <span style={{ display: 'inline-block' }}>{display}</span>;
}

export default function ScrambleText({ text, delay = 0, className = '', style }) {
  return (
    <span className={className} style={style}>
      {text.split('').map((char, i) => (
        <ScrambleChar
          key={i}
          char={char}
          delay={delay + i * 55}
        />
      ))}
    </span>
  );
}
