import React from 'react';
import { gsap } from 'gsap';

function FlowingMenu({ items = [], isDarkMode = true }) {
  return (
    <div className="w-full h-full overflow-hidden">
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} isDarkMode={isDarkMode} />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({ link, text, image, onClick, isDarkMode = true, type }) {
  const itemRef = React.useRef(null);
  const marqueeRef = React.useRef(null);
  const marqueeInnerRef = React.useRef(null);
  const timelineRef = React.useRef(null);

  const animationDefaults = { duration: 0.4, ease: 'power2.out' };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2;
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const handleMouseEnter = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;

    // Tuer l'animation précédente si elle existe
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    timelineRef.current = gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' })
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' });
  };

  const handleMouseLeave = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;

    // Tuer l'animation précédente si elle existe
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    // Animer les deux éléments en parallèle
    timelineRef.current = gsap
      .timeline({ defaults: animationDefaults })
      .to([marqueeRef.current, marqueeInnerRef.current], {
        y: (index) => index === 0
          ? (edge === 'top' ? '-101%' : '101%')
          : (edge === 'top' ? '101%' : '-101%')
      });
  };

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const repeatedMarqueeContent = Array.from({ length: 4 }).map((_, idx) => (
    <React.Fragment key={idx}>
      <span
        className="uppercase font-normal text-[1.4vh] md:text-[2vh] leading-tight p-[0.5vh_1vw_0] md:p-[1vh_1vw_0] flex items-center gap-2"
        style={{
          color: isDarkMode ? '#060010' : '#E8DCC4'
        }}
      >
        {text}
        {type && (
          <span className={`px-1.5 py-0.5 text-[0.8vh] md:text-[1vh] font-medium tracking-wider rounded ${
            type === 'Universitaire'
              ? 'bg-blue-500/30 text-blue-800'
              : 'bg-orange-500/30 text-orange-800'
          }`}>
            {type === 'Universitaire' ? 'UNIV.' : 'PERSO.'}
          </span>
        )}
      </span>
      {image && (
        <div
          className="w-[80px] h-[30px] md:w-[120px] md:h-[45px] my-2 mx-3 rounded-md overflow-hidden flex-shrink-0"
        >
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </React.Fragment>
  ));

  return (
    <div
      className="flex-1 relative overflow-hidden text-center"
      style={{
        boxShadow: isDarkMode ? '0 -1px 0 0 #E8DCC4' : '0 -1px 0 0 #000000'
      }}
      ref={itemRef}
    >
      <a
        className={`flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-[1.4vh] md:text-[2vh] py-4 px-3 md:py-8 md:px-6 transition-colors text-center leading-tight ${
          isDarkMode
            ? 'text-beige hover:text-[#060010] focus:text-beige focus-visible:text-[#060010]'
            : 'text-black hover:text-beige focus:text-black focus-visible:text-beige'
        }`}
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <span className="block">{text}</span>
        {type && (
          <span className={`ml-2 px-1.5 py-0.5 text-[0.8vh] md:text-[1vh] font-medium tracking-wider rounded ${
            type === 'Universitaire'
              ? isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500/20 text-blue-700'
              : isDarkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-500/20 text-orange-700'
          }`}>
            {type === 'Universitaire' ? 'UNIV.' : 'PERSO.'}
          </span>
        )}
      </a>
      <div
        className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none translate-y-[101%] will-change-transform ${
          isDarkMode ? 'bg-beige' : 'bg-black'
        }`}
        ref={marqueeRef}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="h-full w-[200%] flex will-change-transform" ref={marqueeInnerRef} style={{ backfaceVisibility: 'hidden' }}>
          <div className="flex items-center relative h-full w-[200%] will-change-transform animate-marquee">
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;
