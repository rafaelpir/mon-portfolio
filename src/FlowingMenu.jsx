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

function MenuItem({ link, text, image, onClick, isDarkMode = true, type, isNew }) {
  const itemRef = React.useRef(null);
  const marqueeRef = React.useRef(null);
  const marqueeInnerRef = React.useRef(null);
  const marqueeTrackRef = React.useRef(null);
  const slideTimelineRef = React.useRef(null);
  const scrollTweenRef = React.useRef(null);

  const animationDefaults = { duration: 0.4, ease: 'power2.out' };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2;
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const startScroll = () => {
    if (!marqueeTrackRef.current) return;
    gsap.set(marqueeTrackRef.current, { x: 0 });
    scrollTweenRef.current = gsap.to(marqueeTrackRef.current, {
      x: '-50%',
      duration: 12,
      ease: 'none',
      repeat: -1,
    });
  };

  const stopScroll = () => {
    if (scrollTweenRef.current) {
      scrollTweenRef.current.kill();
      scrollTweenRef.current = null;
    }
    if (marqueeTrackRef.current) {
      gsap.set(marqueeTrackRef.current, { x: 0 });
    }
  };

  const handleMouseEnter = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;

    if (slideTimelineRef.current) slideTimelineRef.current.kill();
    stopScroll();

    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    slideTimelineRef.current = gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' })
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%', onComplete: startScroll });
  };

  const handleMouseLeave = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;

    if (slideTimelineRef.current) slideTimelineRef.current.kill();
    stopScroll();

    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    slideTimelineRef.current = gsap
      .timeline({ defaults: animationDefaults })
      .to([marqueeRef.current, marqueeInnerRef.current], {
        y: (index) => index === 0
          ? (edge === 'top' ? '-101%' : '101%')
          : (edge === 'top' ? '101%' : '-101%'),
      });
  };

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const repeatedMarqueeContent = Array.from({ length: 6 }).map((_, idx) => (
    <React.Fragment key={idx}>
      <span
        className="uppercase font-normal text-[1.4vh] md:text-[2vh] leading-tight px-[1vw] flex items-center gap-2 flex-shrink-0"
        style={{ color: isDarkMode ? '#060010' : '#E8DCC4' }}
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
        <div className="h-[55%] aspect-[8/3] my-1 mx-3 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
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
        className={`flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-[1.4vh] md:text-[2vh] px-3 md:px-6 transition-colors text-center leading-tight ${
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
        {isNew && (
          <span className="ml-2 px-1.5 py-0.5 text-[0.8vh] md:text-[1vh] font-bold tracking-wider rounded bg-yellow-400 text-black">
            NOUVEAU
          </span>
        )}
      </a>
      <div
        className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none translate-y-[101%] ${
          isDarkMode ? 'bg-beige' : 'bg-black'
        }`}
        ref={marqueeRef}
      >
        <div className="h-full flex" ref={marqueeInnerRef}>
          <div
            className="flex items-center h-full"
            ref={marqueeTrackRef}
            style={{ width: 'max-content' }}
          >
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;
