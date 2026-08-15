import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Zoom en vraie lightbox plutôt qu'un agrandissement en place : l'ancienne
// version gonflait l'image dans le flux de la page (width/maxWidth animés),
// ce qui décalait tout le contenu et le scroll au clic. Ici l'image s'ouvre
// par-dessus tout, sur fond sombre, sans toucher à la mise en page en
// dessous — fermeture au clic en dehors, sur la croix, ou via Échap.
export default function ImageLightbox({ src, alt, onClose, onPrev, onNext, counter }) {
  const [portalNode, setPortalNode] = useState(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    const node = document.createElement('div');
    document.documentElement.appendChild(node);
    setPortalNode(node);
    return () => document.documentElement.removeChild(node);
  }, []);

  // Focus management d'une vraie modale : on mémorise l'élément qui avait le
  // focus avant l'ouverture (la vignette cliquée) pour l'y renvoyer à la
  // fermeture — effet séparé du déplacement de focus ci-dessous, sinon son
  // nettoyage (qui restaure le focus) se déclencherait dès que `portalNode`
  // change plutôt qu'au vrai démontage.
  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement;
    return () => {
      if (previouslyFocusedRef.current instanceof HTMLElement) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, []);

  // Le portail (et donc le bouton fermer) n'existe dans le DOM qu'une fois
  // `portalNode` prêt — le mettre au focus doit attendre ce second rendu,
  // sinon `closeButtonRef.current` est encore `null` sur le tout premier
  // passage (celui qui rend `null` en attendant le portail).
  useEffect(() => {
    if (portalNode) closeButtonRef.current?.focus();
  }, [portalNode]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowLeft' && onPrev) { onPrev(); return; }
      if (e.key === 'ArrowRight' && onNext) { onNext(); return; }
      // Trap clavier basique : Tab/Shift+Tab restent parmi les éléments
      // focusables de la modale plutôt que de s'échapper vers la page
      // en dessous.
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll('button');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  if (!portalNode) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-6 md:p-16"
        style={{ cursor: 'zoom-out' }}
        onClick={onClose}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={src}
            src={src}
            alt={alt}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-full max-h-full object-contain select-none"
            style={{ cursor: 'default' }}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </AnimatePresence>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="fixed top-5 right-5 md:top-8 md:right-8 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 bg-black/40 text-white hover:bg-white/15 hover:border-white/40 transition-colors"
          aria-label="Fermer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {onPrev && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="fixed left-3 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-white/20 bg-black/40 text-white hover:bg-white/15 hover:border-white/40 transition-colors"
            aria-label="Image précédente"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="fixed right-3 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-white/20 bg-black/40 text-white hover:bg-white/15 hover:border-white/40 transition-colors"
            aria-label="Image suivante"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {counter && (
          <div className="fixed bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/50 uppercase">
            {counter}
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    portalNode
  );
}
