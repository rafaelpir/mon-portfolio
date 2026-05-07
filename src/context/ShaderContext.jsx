import { createContext, useState, useContext } from 'react';

const DEFAULTS = { opacity: 0.08, color1: '#000000', color2: '#bababa' };

function load() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('shaderSettings') || '{}') }; }
  catch { return DEFAULTS; }
}

export const ShaderContext = createContext({ ...DEFAULTS, update: () => {} });

export function ShaderProvider({ children }) {
  const [settings, setSettings] = useState(load);

  const update = (key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('shaderSettings', JSON.stringify(next));
      return next;
    });
  };

  return (
    <ShaderContext.Provider value={{ ...settings, update }}>
      {children}
    </ShaderContext.Provider>
  );
}

export const useShader = () => useContext(ShaderContext);
