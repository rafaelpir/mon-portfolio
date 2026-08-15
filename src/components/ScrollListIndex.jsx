import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Liste texte pour la home mobile — plus de miniature flottante qui suit le
// scroll (retirée à la demande : pas d'images de projet sur cette version
// mobile). Ne reste que l'effet de parallaxe/contraste du texte selon sa
// proximité du centre de l'écran.
export default function ScrollListIndex({ items, isDarkMode, onHoverItem }) {
  const containerRef = useRef(null);
  const rafRef       = useRef(null);

  useEffect(() => {
    const tick = () => {
      const container = containerRef.current;
      if (!container) { rafRef.current = requestAnimationFrame(tick); return; }

      const listItems = Array.from(container.querySelectorAll('.sli-item'));
      const vCenter   = window.innerHeight / 2;
      const maxDist   = window.innerHeight * 0.42;
      // Décalage max proportionnel à la largeur de l'écran (au lieu d'une
      // valeur fixe de 44px) : sur un petit mobile, 44px poussait le texte
      // centré jusqu'à ~11px hors de l'écran à droite.
      const maxShift  = Math.min(44, window.innerWidth * 0.08);

      listItems.forEach(item => {
        const r    = item.getBoundingClientRect();
        const ic   = r.top + r.height / 2;
        const dist = Math.abs(ic - vCenter);
        const t    = Math.max(0, 1 - dist / maxDist); // 1 au centre, 0 loin

        const text = item.querySelector('.sli-text');
        if (text) {
          const alpha = 0.22 + 0.78 * t;
          text.style.transform = `translateX(${maxShift * t}px)`;
          text.style.color     = isDarkMode
            ? `rgba(255,255,255,${alpha})`
            : `rgba(0,0,0,${alpha})`;
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [items, isDarkMode]);

  return (
    <div ref={containerRef} className="overflow-x-hidden">
      <ul className="pt-4 pb-[5vh]">
        {items.map((item, i) => (
          <li
            key={item.id}
            className="sli-item border-t border-white/10 last:border-b"
            onMouseEnter={() => onHoverItem?.(item.id)}
            onMouseLeave={() => onHoverItem?.(null)}
          >
            <Link
              to={item.slug ? `/work/${item.slug}` : `/project/${item.id}`}
              className="py-2 md:py-3 px-4 md:px-6 flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              onFocus={() => onHoverItem?.(item.id)}
              onBlur={() => onHoverItem?.(null)}
            >
              <span className="text-[10px] tracking-widest opacity-25 w-8 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="sli-text text-lg sm:text-xl md:text-2xl font-heading uppercase flex-1 text-center"
                style={{ willChange: 'transform, color', color: isDarkMode ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.22)' }}
              >
                {item.title}
              </span>
              <span className="text-[10px] tracking-widest opacity-25 w-20 text-right shrink-0 hidden sm:block">
                {item.year}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
