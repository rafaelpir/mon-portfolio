export default function SkipLink({ isDarkMode = true }) {
  return (
    <a
      href="#main-content"
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:rounded-md transition-all ${
        isDarkMode
          ? 'focus:bg-beige focus:text-black'
          : 'focus:bg-black focus:text-beige'
      }`}
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: '0',
      }}
      onFocus={(e) => {
        e.target.style.position = 'fixed';
        e.target.style.width = 'auto';
        e.target.style.height = 'auto';
        e.target.style.padding = '0.75rem 1.5rem';
        e.target.style.margin = '0';
        e.target.style.overflow = 'visible';
        e.target.style.clip = 'auto';
        e.target.style.whiteSpace = 'normal';
      }}
      onBlur={(e) => {
        e.target.style.position = 'absolute';
        e.target.style.width = '1px';
        e.target.style.height = '1px';
        e.target.style.padding = '0';
        e.target.style.margin = '-1px';
        e.target.style.overflow = 'hidden';
        e.target.style.clip = 'rect(0, 0, 0, 0)';
        e.target.style.whiteSpace = 'nowrap';
      }}
    >
      Aller au contenu principal
    </a>
  );
}
