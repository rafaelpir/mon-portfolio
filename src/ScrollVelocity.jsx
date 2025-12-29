import { useRef, useLayoutEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useAnimationFrame
} from 'framer-motion';

function useElementWidth(ref) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [ref]);

  return width;
}

export const ScrollVelocityRow = ({
  children,
  baseVelocity = 5,
  direction = 1,
  className = '',
  numCopies = 4
}) => {
  const baseX = useMotionValue(0);
  const copyRef = useRef(null);
  const copyWidth = useElementWidth(copyRef);
  const x = useMotionValue(0);

  function wrap(min, max, v) {
    const range = max - min;
    const mod = (((v - min) % range) + range) % range;
    return mod + min;
  }

  useAnimationFrame((_t, delta) => {
    if (!delta) return;

    const moveBy = direction * baseVelocity * (delta / 1000) * 100;
    const newBaseX = baseX.get() + moveBy;
    baseX.set(newBaseX);

    if (copyWidth > 0) {
      const wrappedX = wrap(-copyWidth, 0, newBaseX);
      x.set(wrappedX);
    } else {
      x.set(newBaseX);
    }
  });

  const copies = [];
  for (let i = 0; i < numCopies; i++) {
    copies.push(
      <div key={i} ref={i === 0 ? copyRef : null} className="flex flex-shrink-0">
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        style={{ x, willChange: 'transform' }}
      >
        {copies}
      </motion.div>
    </div>
  );
};

export const ScrollVelocityContainer = ({
  children,
  className = ''
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default ScrollVelocityRow;
