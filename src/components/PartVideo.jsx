import { useRef, useState } from 'react';

// Vidéo d'une partie de projet (champ `video` : src, poster, aspect,
// caption, label, controls). Avec `controls: false`, pas de lecteur : la
// vidéo tourne en boucle et un seul bouton active le son (les navigateurs
// refusent de lancer une vidéo avec le son sans geste du visiteur).
export default function PartVideo({ video, title, lang = 'fr' }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);
  const plain = video.controls === false;
  const en = lang === 'en';

  const toggleSound = () => {
    const element = ref.current;
    if (!element) return;
    element.muted = !element.muted;
    if (!element.muted) {
      element.currentTime = 0; // avec le son, on reprend du début
      element.play().catch(() => {});
    }
    setMuted(element.muted);
  };

  return (
    <figure className="mx-auto w-full" style={{ maxWidth: video.maxWidth || '880px' }}>
      <div className="part-video">
        <video
          ref={ref}
          src={video.src}
          poster={video.poster}
          aria-label={video.label || title}
          data-mobile-ok
          playsInline
          controls={!plain}
          disablePictureInPicture={plain}
          autoPlay
          loop
          muted
          preload="metadata"
          className="block w-full bg-black"
          style={{ aspectRatio: video.aspect }}
        />
        {plain && (
          <button type="button" className="part-video-sound" onClick={toggleSound} aria-pressed={!muted}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9h4l5-4v14l-5-4H4z" />
              {muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
            </svg>
            {muted ? (en ? 'Sound on' : 'Activer le son') : (en ? 'Sound off' : 'Couper le son')}
          </button>
        )}
      </div>
      {video.caption && <figcaption className="mt-3 text-xs tracking-widest uppercase opacity-50">{video.caption}</figcaption>}
    </figure>
  );
}
