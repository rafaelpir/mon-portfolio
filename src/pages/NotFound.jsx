import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ShuffleText from '../ShuffleText';

export default function NotFound() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className={`font-stamp min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-beige' : 'bg-white text-black'
    }`}>
      <Helmet>
        <title>404 - Page non trouvée | Rafael Piral</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="text-center max-w-2xl">
        {/* 404 animé */}
        <h1 className="text-[20vw] md:text-[15vw] font-light leading-none mb-8">
          <ShuffleText enabled={true}>404</ShuffleText>
        </h1>

        {/* Message d'erreur */}
        <h2 className="text-2xl md:text-4xl font-light mb-6">
          <ShuffleText enabled={true}>PAGE NON TROUVÉE</ShuffleText>
        </h2>

        <p className={`text-lg md:text-xl font-light mb-12 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <ShuffleText enabled={true}>
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </ShuffleText>
        </p>

        {/* Countdown et boutons */}
        <div className="space-y-8">
          <p className={`text-sm tracking-widest ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Redirection automatique dans <span className="font-bold text-xl">{countdown}</span> secondes
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className={`px-8 py-4 text-sm tracking-widest transition-all duration-300 border ${
                isDarkMode
                  ? 'border-beige bg-beige text-black hover:bg-transparent hover:text-beige'
                  : 'border-black bg-black text-white hover:bg-transparent hover:text-black'
              }`}
            >
              <ShuffleText enabled={true}>RETOUR À L'ACCUEIL</ShuffleText>
            </Link>

            <button
              onClick={() => navigate(-1)}
              className={`px-8 py-4 text-sm tracking-widest transition-all duration-300 border ${
                isDarkMode
                  ? 'border-beige/30 hover:border-beige hover:bg-beige/10'
                  : 'border-black/30 hover:border-black hover:bg-black/10'
              }`}
            >
              <ShuffleText enabled={true}>PAGE PRÉCÉDENTE</ShuffleText>
            </button>
          </div>
        </div>

        {/* Logo qui tourne */}
        <div className="mt-16 flex justify-center opacity-20">
          <img
            src="/bullet.png"
            alt="Logo"
            className="w-24 h-24 animate-spin"
            style={{ animationDuration: '3s' }}
          />
        </div>
      </div>
    </div>
  );
}
