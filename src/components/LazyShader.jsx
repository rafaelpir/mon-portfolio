import { useState, useEffect, useRef } from 'react';

/**
 * Wrapper qui ne rend son contenu (shader WebGL) que lorsqu'il est visible à l'écran.
 * Détruit le shader quand il sort du viewport pour libérer le GPU.
 */
export default function LazyShader({ children, className = '', style = {}, margin = '200px' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: margin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return (
    <div ref={ref} className={className} style={style}>
      {isVisible ? children : null}
    </div>
  );
}
