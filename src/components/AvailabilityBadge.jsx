import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function AvailabilityBadge({ availableDate, alternance, status, isDarkMode, performanceTier = 'full' }) {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [positioned, setPositioned] = useState(false);
  const dialogRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isModalOpen) setPositioned(false);
  }, [isModalOpen]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      if (!dialogRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      dialogRef.current.style.left = (clientX - dragOffset.current.x) + 'px';
      dialogRef.current.style.top  = (clientY - dragOffset.current.y) + 'px';
    };
    const onUp = () => {
      if (dialogRef.current) {
        const r = dialogRef.current.getBoundingClientRect();
        positionRef.current = { x: r.left, y: r.top };
      }
      setDragging(false);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
  }, [dragging]);

  const handleTitleBarDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = dialogRef.current.getBoundingClientRect();
    positionRef.current = { x: rect.left, y: rect.top };
    dragOffset.current = { x: clientX - rect.left, y: clientY - rect.top };
    // setPositioned + setDragging sont batché en un seul re-render (React 18)
    setPositioned(true);
    setDragging(true);
    e.preventDefault();
  };

  const dialogStyle = positioned
    ? { position: 'fixed', left: positionRef.current.x, top: positionRef.current.y, transform: 'none' }
    : { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

  return (
    <>
    <button
      onClick={() => setIsModalOpen(true)}
      aria-label={t('availability.ariaLabel')}
      className="cursor-pointer group"
    >
      <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl backdrop-blur-xl transition-all duration-300 group-hover:scale-[1.01] ${
          isDarkMode
            ? 'bg-[#2C2C2E]/85 border border-white/8'
            : 'bg-white/85 border border-black/8'
        }`}
        style={{
          boxShadow: isDarkMode
            ? '0 8px 32px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.06)'
            : '0 8px 32px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)',
        }}
      >
        {/* Pulsing dot */}
        <div className="relative flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/15">
          {performanceTier !== 'none' && (
            <span
              className={`absolute w-3 h-3 rounded-full bg-orange-500 ${
                performanceTier === 'full' ? 'animate-ping' : 'animate-pulse'
              }`}
              style={{ opacity: 0.4 }}
            />
          )}
          <span className="relative w-2.5 h-2.5 rounded-full bg-orange-500" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 text-left">
          <p className={`text-xs tracking-widest uppercase leading-none mb-1 ${
            isDarkMode ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
          }`}>
            {status}
          </p>
          <p className={`font-heading text-base md:text-lg leading-none truncate ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            {alternance}{availableDate ? (alternance ? ` · ${availableDate}` : availableDate) : ''}
          </p>
        </div>

        {/* Chevron */}
        <svg
          className={`flex-shrink-0 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 ${
            isDarkMode ? 'text-[#636366]' : 'text-[#C7C7CC]'
          }`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>

    {/* macOS-style Modal */}
    {isModalOpen && (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 z-[9999] bg-black/50"
          onClick={() => setIsModalOpen(false)}
        />

        {/* Dialog */}
        <div
          ref={dialogRef}
          className={`z-[10000] w-[calc(100vw-2rem)] max-w-sm rounded-2xl overflow-hidden select-none ${
            isDarkMode ? 'bg-[#1C1C1E]' : 'bg-[#F2F2F2]'
          }`}
          style={{
            ...dialogStyle,
            boxShadow: isDarkMode
              ? '0 30px 80px rgba(0,0,0,0.9), 0 0 0 0.5px rgba(255,255,255,0.08)'
              : '0 30px 80px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.08)',
            cursor: dragging ? 'grabbing' : 'default',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title bar — drag handle */}
          <div
            onMouseDown={handleTitleBarDown}
            onTouchStart={handleTitleBarDown}
            className={`relative flex items-center px-4 h-11 border-b ${
              isDarkMode ? 'bg-[#2C2C2E] border-[#3A3A3C]' : 'bg-[#E8E8E8] border-[#C8C8C8]'
            }`}
            style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          >
            <div className="flex items-center gap-2 z-10">
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setIsModalOpen(false)}
                className="group/close relative w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#E0443E] transition-colors cursor-pointer"
                aria-label={t('buttons.close')}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[7px] text-[#5C0000] opacity-0 group-hover/close:opacity-100 leading-none">✕</span>
              </button>
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <span className={`absolute inset-0 flex items-center justify-center text-xs font-medium pointer-events-none ${
              isDarkMode ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
            }`}>
              rafaelpiral.fr
            </span>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <h2 className={`font-heading text-2xl leading-none tracking-wide ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                {t('availability.title')}
              </h2>
              <p className={`text-xs tracking-widest uppercase mt-1.5 ${
                isDarkMode ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
              }`}>
                {t('availability.subtitle')}
              </p>
            </div>

            {/* Info card */}
            <div className={`rounded-xl p-4 flex items-center gap-3 ${
              isDarkMode ? 'bg-[#2C2C2E]' : 'bg-white'
            }`}>
              <div className="relative flex-shrink-0 flex items-center justify-center">
                {performanceTier !== 'none' && (
                  <span
                    className={`absolute w-4 h-4 rounded-full ${
                      performanceTier === 'full' ? 'animate-ping' : 'animate-pulse'
                    } bg-orange-500`}
                    style={{ opacity: 0.35 }}
                  />
                )}
                <span className="relative w-2.5 h-2.5 rounded-full bg-orange-500" />
              </div>
              <div>
                <p className={`font-heading text-xl leading-none ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  {t('availability.apprenticeship.title')}
                </p>
                <p className={`text-xs tracking-widest mt-0.5 ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-600'
                }`}>
                  {t('availability.apprenticeship.date')}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className={`text-sm leading-relaxed ${
              isDarkMode ? 'text-[#EBEBEB]' : 'text-[#3A3A3C]'
            }`}>
              {t('availability.apprenticeship.description')}
            </p>

            {/* Divider */}
            <div className={`border-t ${isDarkMode ? 'border-[#3A3A3C]' : 'border-[#D1D1D1]'}`} />

            {/* Buttons */}
            <div className="flex items-center justify-between gap-3">
              <p className={`text-xs tracking-widest uppercase ${
                isDarkMode ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
              }`}>
                {t('contact.interested')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-lg text-xs tracking-widest uppercase font-medium transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#3A3A3C] text-[#EBEBEB] hover:bg-[#48484A]'
                      : 'bg-[#E5E5EA] text-[#3A3A3C] hover:bg-[#D1D1D6]'
                  }`}
                >
                  {t('buttons.close')}
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setTimeout(() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs tracking-widest uppercase font-medium transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'bg-white text-black hover:bg-[#E5E5E5]'
                      : 'bg-black text-white hover:bg-[#3A3A3C]'
                  }`}
                >
                  {t('buttons.contactMe')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </>
  );
}
