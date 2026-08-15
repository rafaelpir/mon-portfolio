import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FIRST = 'Rafael';
const LAST = 'Piral';
const STEP_MS = 38;
const TOTAL_STEPS = (FIRST.length - 1) + (LAST.length - 1); // lettres à révéler après "R" et "P"

export default function Logo({ isDarkMode, className = '' }) {
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    const target = hovered ? TOTAL_STEPS : 0;
    if (step === target) return;
    const dir = step < target ? 1 : -1;
    timeoutRef.current = setTimeout(() => setStep((s) => s + dir), STEP_MS);
    return () => clearTimeout(timeoutRef.current);
  }, [step, hovered]);

  const firstLen = 1 + Math.min(step, FIRST.length - 1);
  const lastLen = 1 + Math.max(0, step - (FIRST.length - 1));
  const display = step === 0
    ? `${FIRST[0]}${LAST[0]}`
    : `${FIRST.slice(0, firstLen)} ${LAST.slice(0, lastLen)}`;

  return (
    <div className={`relative w-12 md:w-20 h-8 flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => {
          if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            navigate('/');
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label="Rafael Piral, retour en haut de page"
        className={`absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap uppercase font-heading tracking-wide text-lg md:text-2xl leading-none transition-colors duration-300 ${
          isDarkMode ? 'text-beige' : 'text-black'
        }`}
      >
        {display}
      </button>
    </div>
  );
}
