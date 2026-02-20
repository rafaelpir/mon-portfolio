import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import './i18n';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HelmetProvider>
        <App />
        <Analytics />
      </HelmetProvider>
    </Suspense>
  </React.StrictMode>
);
