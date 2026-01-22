import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Statistics({ stats, isDarkMode }) {
  const statsRef = useRef(null);
  const countersRef = useRef([]);

  useEffect(() => {
    if (!statsRef.current) return;

    // Animate counters on scroll
    countersRef.current.forEach((counter, index) => {
      if (!counter) return;

      gsap.from(counter, {
        textContent: 0,
        duration: 2,
        ease: 'power1.inOut',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          once: true
        },
        onUpdate: function() {
          counter.textContent = Math.ceil(this.targets()[0].textContent);
        }
      });
    });

    // Animate stat cards
    gsap.from('.stat-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: statsRef.current,
        start: 'top 80%',
        once: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [stats]);

  return (
    <motion.section
      ref={statsRef}
      className="py-16 md:py-32 px-4 md:px-16"
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-xs md:text-sm tracking-widest mb-12 md:mb-16 text-center ${
          isDarkMode ? 'text-gray-500' : 'text-gray-600'
        }`}>
          EN CHIFFRES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`stat-card text-center p-8 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-beige/5 hover:bg-beige/10'
                  : 'bg-black/5 hover:bg-black/10'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span
                  ref={el => countersRef.current[index] = el}
                  className={`text-5xl md:text-7xl font-light ${
                    isDarkMode ? 'text-beige' : 'text-black'
                  }`}
                >
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className={`text-4xl md:text-6xl font-light ${
                    isDarkMode ? 'text-beige/60' : 'text-black/60'
                  }`}>
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className={`mt-4 text-sm md:text-base tracking-widest ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
