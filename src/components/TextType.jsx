import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function TextType({
  texts = [],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = '|',
  cursorBlinkDuration = 0.5,
  className = '',
  variableSpeedEnabled = false,
  variableSpeedMin = 60,
  variableSpeedMax = 120,
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const cursorRef = useRef(null);
  const timeoutRef = useRef(null);

  // Animation du curseur clignotant
  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  // Effet de frappe
  useEffect(() => {
    if (texts.length === 0) return;

    const currentFullText = texts[currentTextIndex];

    const getSpeed = () => {
      if (variableSpeedEnabled) {
        return Math.random() * (variableSpeedMax - variableSpeedMin) + variableSpeedMin;
      }
      return isDeleting ? deletingSpeed : typingSpeed;
    };

    const type = () => {
      if (isDeleting) {
        // Supprimer des caractères
        if (displayedText.length > 0) {
          setDisplayedText(currentFullText.substring(0, displayedText.length - 1));
          timeoutRef.current = setTimeout(type, getSpeed());
        } else {
          // Passer au texte suivant
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        // Ajouter des caractères
        if (displayedText.length < currentFullText.length) {
          setDisplayedText(currentFullText.substring(0, displayedText.length + 1));
          timeoutRef.current = setTimeout(type, getSpeed());
        } else {
          // Texte complet, attendre puis supprimer
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true);
            type();
          }, pauseDuration);
        }
      }
    };

    timeoutRef.current = setTimeout(type, getSpeed());

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayedText, currentTextIndex, isDeleting, texts, typingSpeed, deletingSpeed, pauseDuration, variableSpeedEnabled, variableSpeedMin, variableSpeedMax]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span ref={cursorRef} className="inline-block ml-0.5">
          {cursorCharacter}
        </span>
      )}
    </span>
  );
}
