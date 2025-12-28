import { useState, useEffect, useCallback } from 'react';

export default function usePresentationMode() {
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(true);

  // Vérifier le support du fullscreen
  useEffect(() => {
    const supported = !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
    setIsFullscreenSupported(supported);
  }, []);

  // Fonction pour entrer en fullscreen
  const enterFullscreen = useCallback(() => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }, []);

  // Fonction pour sortir du fullscreen
  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }, []);

  // Toggle presentation mode
  const togglePresentationMode = useCallback(() => {
    if (!isPresentationMode) {
      if (isFullscreenSupported) {
        enterFullscreen();
      }
      setIsPresentationMode(true);
    } else {
      if (isFullscreenSupported) {
        exitFullscreen();
      }
      setIsPresentationMode(false);
    }
  }, [isPresentationMode, isFullscreenSupported, enterFullscreen, exitFullscreen]);

  // Écouter les changements de fullscreen (ESC, etc.)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      // Si on n'est plus en fullscreen mais qu'on était en presentation mode
      if (!isCurrentlyFullscreen && isPresentationMode) {
        setIsPresentationMode(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isPresentationMode]);

  // Raccourci clavier Ctrl+P
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+P ou Cmd+P (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault(); // Empêcher l'impression
        togglePresentationMode();
      }

      // ESC pour sortir (redondant mais explicite)
      if (e.key === 'Escape' && isPresentationMode) {
        setIsPresentationMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, togglePresentationMode]);

  return {
    isPresentationMode,
    isFullscreenSupported,
    togglePresentationMode,
    enterPresentationMode: () => {
      if (!isPresentationMode) togglePresentationMode();
    },
    exitPresentationMode: () => {
      if (isPresentationMode) togglePresentationMode();
    }
  };
}
