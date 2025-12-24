import React, { useRef, useEffect } from 'react';

const VideoIntro = ({ onComplete }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // Jouer la vidéo
      video.play().catch(err => {
        console.log("Autoplay prevented:", err);
        // Si autoplay est bloqué, passer directement au contenu
        setTimeout(onComplete, 500);
      });

      // Détecter quand la vidéo est presque terminée (2 secondes avant la fin)
      const handleTimeUpdate = () => {
        if (video.duration - video.currentTime <= 2) {
          if (onComplete) {
            onComplete();
          }
        }
      };

      // Ou détecter quand la vidéo est complètement terminée
      const handleEnded = () => {
        if (onComplete) {
          onComplete();
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [onComplete]);

  return (
    <div style={styles.container}>
      <video
        ref={videoRef}
        muted
        playsInline
        style={styles.video}
      >
        <source src="/videos/output.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#000000',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
};

export default VideoIntro;
