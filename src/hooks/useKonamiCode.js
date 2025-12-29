import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
];

export default function useKonamiCode(callback) {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys((prevKeys) => {
        const newKeys = [...prevKeys, e.key].slice(-10);

        // Vérifier si la séquence correspond au code Konami
        if (JSON.stringify(newKeys) === JSON.stringify(KONAMI_CODE)) {
          callback();
          return []; // Reset après activation
        }

        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback]);

  return keys;
}
