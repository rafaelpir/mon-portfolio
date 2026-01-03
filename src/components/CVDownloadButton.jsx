import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function CVDownloadButton({ variant = 'primary', isDarkMode, className = '' }) {
  const buttonRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (!buttonRef.current || !iconRef.current) return;

    const button = buttonRef.current;
    const icon = iconRef.current;

    const handleMouseEnter = () => {
      gsap.to(icon, {
        y: 3,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(icon, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleClick = () => {
    window.open('/CV_Rafael_Piral.pdf', '_blank');
  };

  const baseClasses = "inline-flex items-center gap-2 md:gap-3 transition-all duration-300 cursor-pointer";

  const variantClasses = {
    primary: `px-6 md:px-8 py-3 md:py-4 border-2 text-sm md:text-base tracking-widest ${
      isDarkMode
        ? 'border-beige hover:bg-beige hover:text-black'
        : 'border-black hover:bg-black hover:text-white'
    }`,
    secondary: `px-4 md:px-6 py-2 md:py-3 border text-xs md:text-sm tracking-wider ${
      isDarkMode
        ? 'border-beige/50 hover:border-beige'
        : 'border-black/50 hover:border-black'
    }`,
    iconOnly: `p-2 md:p-3 rounded-full ${
      isDarkMode
        ? 'bg-beige/10 hover:bg-beige/20'
        : 'bg-black/10 hover:bg-black/20'
    }`
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label="Télécharger CV"
    >
      {variant !== 'iconOnly' && (
        <span>TÉLÉCHARGER CV</span>
      )}
      <svg
        ref={iconRef}
        className="w-4 h-4 md:w-5 md:h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    </button>
  );
}
