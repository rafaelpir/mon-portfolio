import React, { useState, useEffect } from 'react';

const Preloader = ({ onComplete, minDuration = 3000 }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [currentLog, setCurrentLog] = useState(0);

  const logLines = [
    'INIT_SYSTEM...',
    'LOAD_ASSETS...',
    'COMPILE_STYLES...',
    'RENDER_UI...',
    'READY',
  ];

  // Bloquer le scroll pendant le chargement
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    let animationFrame;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(newProgress);
      setCurrentLog(Math.min(Math.floor(newProgress / 20), 4));

      if (newProgress < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        // Start fade out animation
        setTimeout(() => {
          setIsFading(true);
          // Wait for fade animation to complete before hiding
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 1000);
        }, 300);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [minDuration, onComplete]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        .preloader {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: #000 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 999999 !important;
          font-family: 'Satoshi', Arial, sans-serif !important;
        }
        .preloader__grid {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          background-image: linear-gradient(rgba(232,220,196,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(232,220,196,0.03) 1px, transparent 1px) !important;
          background-size: 40px 40px !important;
          pointer-events: none !important;
        }
        .preloader__content {
          position: relative !important;
          z-index: 1 !important;
          width: 90% !important;
          max-width: 400px !important;
        }
        .preloader__header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 30px !important;
        }
        .preloader__logo {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }
        .preloader__logo-icon {
          display: block !important;
        }
        .preloader__logo-text {
          color: #E8DCC4 !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          letter-spacing: 2px !important;
        }
        .preloader__logo-sub {
          color: #E8DCC4 !important;
          font-size: 9px !important;
          opacity: 0.5 !important;
          letter-spacing: 1px !important;
        }
        .preloader__circuit {
          display: block !important;
        }
        .preloader__info {
          display: flex !important;
          gap: 20px !important;
          margin-bottom: 20px !important;
          color: #E8DCC4 !important;
          font-size: 10px !important;
          opacity: 0.6 !important;
        }
        .preloader__badges {
          display: flex !important;
          gap: 8px !important;
          margin-bottom: 25px !important;
          flex-wrap: wrap !important;
        }
        .preloader__badge {
          padding: 4px 10px !important;
          border: 1px solid rgba(232,220,196,0.4) !important;
          color: #E8DCC4 !important;
          font-size: 9px !important;
          letter-spacing: 1px !important;
        }
        .preloader__bar-container {
          margin-bottom: 12px !important;
        }
        .preloader__bar {
          height: 2px !important;
          background: rgba(232,220,196,0.15) !important;
        }
        .preloader__bar-fill {
          height: 100% !important;
          background: #E8DCC4 !important;
          box-shadow: 0 0 10px rgba(232,220,196,0.5) !important;
        }
        .preloader__status {
          display: flex !important;
          justify-content: space-between !important;
          color: #E8DCC4 !important;
          font-size: 10px !important;
          font-family: monospace !important;
        }
        .preloader__log {
          opacity: 0.5 !important;
        }
        .preloader__quote {
          text-align: center !important;
          color: #E8DCC4 !important;
          font-size: 11px !important;
          opacity: 0.4 !important;
          margin-top: 30px !important;
          font-style: italic !important;
          letter-spacing: 1px !important;
        }
        .preloader__corner {
          position: absolute !important;
          width: 30px !important;
          height: 30px !important;
          border-color: rgba(232,220,196,0.2) !important;
          border-style: solid !important;
          border-width: 0 !important;
        }
        .preloader__corner--tl {
          top: 20px !important;
          left: 20px !important;
          border-top-width: 1px !important;
          border-left-width: 1px !important;
        }
        .preloader__corner--tr {
          top: 20px !important;
          right: 20px !important;
          border-top-width: 1px !important;
          border-right-width: 1px !important;
        }
        .preloader__corner--bl {
          bottom: 20px !important;
          left: 20px !important;
          border-bottom-width: 1px !important;
          border-left-width: 1px !important;
        }
        .preloader__corner--br {
          bottom: 20px !important;
          right: 20px !important;
          border-bottom-width: 1px !important;
          border-right-width: 1px !important;
        }
        .preloader__footer {
          position: absolute !important;
          bottom: 30px !important;
          display: flex !important;
          gap: 20px !important;
          color: #E8DCC4 !important;
          font-size: 8px !important;
          opacity: 0.3 !important;
          letter-spacing: 2px !important;
        }
        .preloader--fading {
          animation: preloader-fadeout 1s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
        }
        @keyframes preloader-fadeout {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.05);
          }
        }
      `}</style>

      <div className={`preloader ${isFading ? 'preloader--fading' : ''}`}>
        <div className="preloader__grid" />

        <div className="preloader__content">
          {/* Header */}
          <div className="preloader__header">
            <div className="preloader__logo">
              {/* Globe icon */}
              <svg className="preloader__logo-icon" width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" stroke="#E8DCC4" strokeWidth="1" fill="none" />
                <ellipse cx="18" cy="18" rx="6" ry="15" stroke="#E8DCC4" strokeWidth="0.8" fill="none" />
                <line x1="3" y1="18" x2="33" y2="18" stroke="#E8DCC4" strokeWidth="0.8" />
                <line x1="18" y1="3" x2="18" y2="33" stroke="#E8DCC4" strokeWidth="0.8" />
              </svg>
              <div>
                <div className="preloader__logo-text">©RAFAEL.PIRAL</div>
                <div className="preloader__logo-sub">CREATIVE DEVELOPER</div>
              </div>
            </div>

            {/* Circuit decoration */}
            <svg className="preloader__circuit" width="40" height="24" viewBox="0 0 40 24">
              <line x1="0" y1="12" x2="12" y2="12" stroke="#E8DCC4" strokeWidth="1" />
              <line x1="28" y1="12" x2="40" y2="12" stroke="#E8DCC4" strokeWidth="1" />
              <rect x="12" y="6" width="16" height="12" stroke="#E8DCC4" strokeWidth="1" fill="none" />
              <circle cx="6" cy="12" r="2" fill="#E8DCC4" />
              <circle cx="34" cy="12" r="2" fill="#E8DCC4" />
            </svg>
          </div>

          {/* Version info */}
          <div className="preloader__info">
            <span>©2026</span>
            <span>V1.0</span>
            <span>BUILD.{Math.floor(progress)}</span>
          </div>

          {/* Badges */}
          <div className="preloader__badges">
            <span className="preloader__badge">GRAPHIC DESIGNER</span>
            <span className="preloader__badge">UX/UI</span>
            <span className="preloader__badge">AUDIOVISUEL</span>
          </div>

          {/* Progress bar */}
          <div className="preloader__bar-container">
            <div className="preloader__bar">
              <div className="preloader__bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Status */}
          <div className="preloader__status">
            <span className="preloader__log">{logLines[currentLog]}</span>
            <span>{Math.floor(progress)}%</span>
          </div>

          {/* Quote */}
          <div className="preloader__quote">
            Design is intelligence made visible.
          </div>
        </div>

        {/* Corner decorations */}
        <div className="preloader__corner preloader__corner--tl" />
        <div className="preloader__corner preloader__corner--tr" />
        <div className="preloader__corner preloader__corner--bl" />
        <div className="preloader__corner preloader__corner--br" />

        {/* Footer */}
        <div className="preloader__footer">
          <span>FRANCE</span>
          <span>•</span>
          <span>MMI BOBIGNY</span>
        </div>
      </div>
    </>
  );
};

export default Preloader;
