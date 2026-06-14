import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Samuel';
const SESSION_KEY = 'admin_authenticated';

export default function AdminGuard({ children }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  );

  if (authenticated) return children;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthenticated(true);
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      fontFamily: 'monospace',
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '280px' }}>
        <p style={{ color: '#fff', fontSize: '14px', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Admin · mot de passe
        </p>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          style={{
            background: 'transparent',
            border: `1px solid ${error ? '#ff4444' : '#444'}`,
            color: '#fff',
            padding: '10px 12px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        {error && (
          <p style={{ color: '#ff4444', fontSize: '12px', margin: 0 }}>Mot de passe incorrect.</p>
        )}
        <button type="submit" style={{
          background: '#fff',
          color: '#000',
          border: 'none',
          padding: '10px',
          fontSize: '13px',
          cursor: 'pointer',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Entrer
        </button>
      </form>
    </div>
  );
}
