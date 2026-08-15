// Séparateur de section numéroté — reprend le motif "0X" en exposant déjà
// utilisé dans la nav de la home (01/02/03/04), pour donner aux pages
// projet le même rythme éditorial que le reste du site.
export default function ProjectSectionDivider({ index, label, isDarkMode, accentTextClass, accentLineClass }) {
  return (
    <div className={`flex items-center gap-4 mb-10 md:mb-14 ${accentTextClass || (isDarkMode ? 'text-beige/40' : 'text-black/40')}`}>
      <span className="text-xs tracking-[0.3em] uppercase whitespace-nowrap">
        <span className="text-[8px] align-super opacity-60 mr-1">{String(index).padStart(2, '0')}</span>
        {label}
      </span>
      <div className={`flex-1 h-px ${accentLineClass || (isDarkMode ? 'bg-beige/10' : 'bg-black/10')}`} />
    </div>
  );
}
