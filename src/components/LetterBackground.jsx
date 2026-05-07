import { useState } from 'react';
import { useShader } from '../context/ShaderContext';

const DEFAULTS = { opacity: 0.08, color1: '#000000', color2: '#bababa' };

export default function LetterBackground({ children }) {
  const { opacity, color1, color2, update } = useShader();
  const [open, setOpen] = useState(false);

  const reset = () => {
    Object.entries(DEFAULTS).forEach(([k, v]) => update(k, v));
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gray-100 print:bg-white">
      <div className="py-10 print:p-0 print:m-0">
        {children}
      </div>

      {/* Panneau de réglages */}
      <div className="fixed bottom-6 left-6 z-50 no-print">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all"
          title="Réglages du fond"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>

        {open && (
          <div className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-64 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Fond — Réglages</h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-gray-700">Opacité</label>
                <span className="text-xs font-bold text-gray-900">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range" min="0" max="100"
                value={Math.round(opacity * 100)}
                onChange={e => update('opacity', Number(e.target.value) / 100)}
                className="w-full accent-black"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Couleur 1</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{color1}</span>
                <input type="color" value={color1} onChange={e => update('color1', e.target.value)}
                  className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Couleur 2</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{color2}</span>
                <input type="color" value={color2} onChange={e => update('color2', e.target.value)}
                  className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer" />
              </div>
            </div>

            <button onClick={reset}
              className="w-full text-xs py-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
