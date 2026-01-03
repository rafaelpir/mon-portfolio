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

function MenuItem({ link, text, image, onClick, isDarkMode = true }) {
  const itemRef = React.useRef(null);
  const marqueeRef = React.useRef(null);
  const marqueeInnerRef = React.useRef(null);

  const animationDefaults = { duration: 0.4, ease: 'power2.out' };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2;
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const handleMouseEnter = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' })
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' });
  };

  const handleMouseLeave = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' })
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' });
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
        className="uppercase font-normal text-[3vh] leading-[1.2] p-[1vh_1vw_0]"
        style={{
          color: isDarkMode ? '#060010' : '#E8DCC4'
        }}
      >
        {text}
      </span>
      {image && (
        <div
          className="w-[200px] h-[7vh] my-[2em] mx-[2vw] p-[1em_0] rounded-[50px] bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
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
        className={`flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-[3vh] py-12 px-8 transition-colors ${
          isDarkMode
            ? 'text-beige hover:text-[#060010] focus:text-beige focus-visible:text-[#060010]'
            : 'text-black hover:text-beige focus:text-black focus-visible:text-beige'
        }`}
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {text}
      </a>
      <div
        className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none translate-y-[101%] will-change-transform ${
          isDarkMode ? 'bg-beige-light' : 'bg-black'
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
