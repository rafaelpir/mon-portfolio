import { useState, useEffect, useRef } from 'react';
import { projects as initialProjects } from '../data/projects';
import { Link } from 'react-router-dom';

// ─── Modale de sélection d'image ────────────────────────────────────────────
// multiSelect=true → clic toggle, bouton "Ajouter (N)" pour confirmer
function ImagePickerModal({ onSelect, onSelectMultiple, onClose, multiSelect = false }) {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    fetch('/api/list-images')
      .then(r => r.json())
      .then(d => { setImages(d.images || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = images.filter(p =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, data: ev.target.result }),
        });
        const data = await res.json();
        if (data.success) {
          setImages(prev => [data.path, ...prev]);
          if (!multiSelect) { onSelect(data.path); onClose(); }
          else setSelected(prev => [...prev, data.path]);
        }
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleSelect = (path) => {
    setSelected(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const confirmMulti = () => {
    if (selected.length > 0) onSelectMultiple(selected);
    onClose();
  };

  // Fermer avec Échap
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-[780px] max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header modale */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold">
            {multiSelect ? 'Sélectionner plusieurs images' : 'Choisir une image'}
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600 w-48"
              autoFocus
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Upload...' : '+ Importer'}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leading-none">×</button>
          </div>
        </div>

        {/* Grille */}
        <div className="overflow-y-auto p-4">
          {loading ? (
            <div className="text-zinc-600 text-sm text-center py-12">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="text-zinc-600 text-sm text-center py-12">Aucune image trouvée</div>
          ) : (
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
              {filtered.map(path => {
                const isSelected = selected.includes(path);
                return (
                  <button
                    key={path}
                    onClick={() => {
                      if (multiSelect) toggleSelect(path);
                      else { onSelect(path); onClose(); }
                    }}
                    className={`group relative bg-zinc-800 rounded-lg overflow-hidden border transition-colors aspect-square flex items-center justify-center ${
                      isSelected ? 'border-white ring-2 ring-white' : 'border-zinc-700 hover:border-zinc-400'
                    }`}
                    title={path}
                  >
                    <img
                      src={path}
                      alt=""
                      className={`w-full h-full object-cover transition-opacity ${isSelected ? 'opacity-70' : 'group-hover:opacity-80'}`}
                      loading="lazy"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <span className="text-black text-xs font-bold leading-none">✓</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs truncate">{path.split('/').pop()}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-600">
            {filtered.length} image{filtered.length !== 1 ? 's' : ''}
            {multiSelect ? ' · clic pour sélectionner · Échap pour fermer' : ' · clic pour sélectionner · Échap pour fermer'}
          </span>
          {multiSelect && (
            <button
              onClick={confirmMulti}
              disabled={selected.length === 0}
              className="bg-white text-black text-xs font-semibold px-4 py-1.5 rounded hover:bg-zinc-200 transition-colors disabled:opacity-30"
            >
              Ajouter {selected.length > 0 ? `(${selected.length})` : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Input image avec bouton "Parcourir"
function ImageInput({ value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-2 items-stretch">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || '/images/projects/...'}
        className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600"
      />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-3 py-2 border border-zinc-700 rounded text-xs text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors whitespace-nowrap"
      >
        Parcourir
      </button>
      {open && (
        <ImagePickerModal
          onSelect={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

const CATEGORIES = ['Affiches', 'UI/UX Design', 'Branding', 'Développement web', 'Audiovisuel', 'Photographie'];
const TYPES = ['Personnel', 'Universitaire'];

const ALL_TAGS = [
  'Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Branding', 'UI Design', 'UX Design',
  'Motion Design', 'Web', 'SEO', 'CRM', 'Charte graphique', 'Photographie', 'GIF',
  'Court-métrage', 'Réalisation', 'Montage', 'Écriture', 'Acteur', 'Perchman', 'Sous-titrage',
  'Rédaction', 'Jimdo', 'Blender',
];

const ALL_COMPETENCES = [
  'Direction artistique', 'Conception d\'affiche', 'Design d\'affiche', 'Composition visuelle',
  'Typographie', 'Illustration vectorielle', 'Flat design', 'Traitement rétro', 'Retouche photo',
  'Expérimentation visuelle', 'Traitement numérique', 'Art ASCII',
  'Création d\'identité visuelle', 'Identité visuelle', 'Branding', 'Charte graphique', 'Création de logo', 'Design graphique',
  'UI Design', 'UX Design', 'UI/UX Design', 'Conception d\'interfaces mobiles', 'Conception d\'interfaces web',
  'Conception web', 'Design System', 'Responsive Design', 'Architecture de l\'information',
  'SEO', 'Conception CRM',
  'Mise en page (InDesign)', 'Reproduction graphique', 'Rédaction de contenu',
  'Motion design', 'Design de coffret',
  'Montage vidéo', 'Réalisation', 'Jeu d\'acteur', 'Prise de son (Perche)', 'Sous-titrage anglais',
  'Écriture de scénario', 'Storyboard', 'Storytelling', 'Narration visuelle',
  'Création de site web', 'Création de GIF animé', 'Analyse transmédiatique', 'Veille culturelle',
  'Analyse de cahier des charges', 'Travail en équipe', 'Esprit d\'équipe', 'Communication',
];

const ALL_OUTILS = [
  'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Adobe Premiere Pro',
  'Figma', 'DaVinci Resolve', 'Blender', 'Premiere Pro', 'After Effects',
  'Jimdo', 'WordPress',
];

function nextId(projects) {
  const nums = projects.map(p => (typeof p.id === 'number' ? p.id : 0));
  return Math.max(0, ...nums) + 1;
}

function projectToForm(p) {
  return {
    id: p.id?.toString() ?? '',
    title: p.title ?? '',
    category: p.category ?? 'Affiches',
    type: p.type ?? 'Personnel',
    year: p.year ?? new Date().getFullYear().toString(),
    context: p.context ?? '',
    period: p.period ?? '',
    duration: p.duration ?? '',
    description: p.description ?? '',
    thumbnail: p.thumbnail ?? '',
    role: Array.isArray(p.role) ? [...p.role] : (p.role ? [p.role] : []),
    youtubeId: p.youtubeId ?? '',
    externalUrl: p.externalUrl ?? '',
    pdfFile: p.pdfFile ?? '',
    figmaEmbed: p.figmaEmbed ?? '',
    thumbnailMaxHeight: p.thumbnailMaxHeight ?? '',
    thumbnailMaxWidth: p.thumbnailMaxWidth ?? '',
    hidden: p.hidden ?? false,
    isNew: p.isNew ?? false,
    layout: p.layout ?? '',
    tags: Array.isArray(p.tags) ? [...p.tags] : [],
    competences: Array.isArray(p.competences) ? [...p.competences] : [],
    outils: Array.isArray(p.outils) ? [...p.outils] : [],
    teamName: p.team?.name ?? '',
    teamUrl: p.team?.url ?? '',
    gallery: p.gallery
      ? p.gallery.map(g => ({ src: g.src ?? '', description: g.description ?? '' }))
      : [],
    _subProjects: p.subProjects ?? null,
  };
}

function formToProject(form) {
  const p = {};
  p.id = !isNaN(parseInt(form.id)) ? parseInt(form.id) : form.id;
  p.title = form.title;
  p.category = form.category;
  p.type = form.type;
  p.year = form.year;
  if (form.context) p.context = form.context;
  if (form.period) p.period = form.period;
  if (form.duration) p.duration = form.duration;
  p.description = form.description;
  if (form.hidden) p.hidden = true;
  if (form.isNew) p.isNew = true;
  if (form.layout) p.layout = form.layout;
  if (form.thumbnail) p.thumbnail = form.thumbnail;
  if (form.thumbnailMaxHeight) p.thumbnailMaxHeight = form.thumbnailMaxHeight;
  if (form.thumbnailMaxWidth) p.thumbnailMaxWidth = form.thumbnailMaxWidth;
  if (form.role && form.role.length) p.role = form.role;
  if (form.teamName) p.team = { name: form.teamName, url: form.teamUrl };
  if (form.youtubeId) p.youtubeId = form.youtubeId;
  if (form.externalUrl) p.externalUrl = form.externalUrl;
  if (form.pdfFile) p.pdfFile = form.pdfFile;
  if (form.figmaEmbed) p.figmaEmbed = form.figmaEmbed;
  if (form.tags.length) p.tags = form.tags;
  if (form.competences.length) p.competences = form.competences;
  if (form.outils.length) p.outils = form.outils;
  const gallery = form.gallery.filter(g => g.src);
  if (gallery.length) p.gallery = gallery;
  if (form._subProjects) p.subProjects = form._subProjects;
  return p;
}

function emptyForm(projects) {
  return {
    id: nextId(projects).toString(),
    title: '',
    category: 'Affiches',
    type: 'Personnel',
    year: new Date().getFullYear().toString(),
    context: '',
    period: '',
    duration: '',
    description: '',
    thumbnail: '',
    role: [],
    youtubeId: '',
    externalUrl: '',
    pdfFile: '',
    figmaEmbed: '',
    thumbnailMaxHeight: '',
    thumbnailMaxWidth: '',
    hidden: false,
    isNew: false,
    layout: '',
    tags: [],
    competences: [],
    outils: [],
    teamName: '',
    teamUrl: '',
    gallery: [],
    _subProjects: null,
  };
}

// Sélecteur avec boutons cliquables + input pour valeur custom
function TagPicker({ label, value, onChange, suggestions }) {
  const [custom, setCustom] = useState('');

  const toggle = (item) => {
    if (value.includes(item)) {
      onChange(value.filter(v => v !== item));
    } else {
      onChange([...value, item]);
    }
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setCustom('');
  };

  // Éléments sélectionnés qui ne sont pas dans les suggestions prédéfinies
  const customSelected = value.filter(v => !suggestions.includes(v));

  return (
    <div>
      <div className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">{label}</div>

      {/* Chips sélectionnés */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {value.map(item => (
            <button
              key={item}
              onClick={() => toggle(item)}
              className="flex items-center gap-1 bg-white text-black text-xs px-2.5 py-1 rounded-full font-medium hover:bg-zinc-200 transition-colors"
            >
              {item}
              <span className="text-zinc-500 text-xs leading-none">×</span>
            </button>
          ))}
        </div>
      )}

      {/* Boutons prédéfinis non sélectionnés */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {suggestions.filter(s => !value.includes(s)).map(item => (
          <button
            key={item}
            onClick={() => toggle(item)}
            className="text-xs px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Input custom */}
      <div className="flex gap-2">
        <input
          type="text"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
          placeholder="Ajouter une valeur personnalisée..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600"
        />
        <button
          onClick={addCustom}
          disabled={!custom.trim()}
          className="text-xs px-3 py-1.5 border border-zinc-700 rounded text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-30"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

const ROLE_SUGGESTIONS = [
  'Design graphique',
  'UI Design',
  'UX Design',
  'UI/UX Design',
  'UX Designer & SEO',
  'Direction artistique',
  'Branding',
  'Identité visuelle',
  'Logo & Charte graphique',
  'Identité visuelle, Logo & Charte graphique',
  'Charte graphique & Logo',
  'Développement web',
  'Réalisation',
  'Montage vidéo',
  'Motion design',
  'Photographie',
];

// Sélecteur de rôles (multi-valeurs) avec boutons + input custom
function RolePicker({ value, onChange }) {
  const [custom, setCustom] = useState('');

  const toggle = (item) => {
    if (value.includes(item)) {
      onChange(value.filter(v => v !== item));
    } else {
      onChange([...value, item]);
    }
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setCustom('');
  };

  return (
    <div>
      <div className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">Rôle(s)</div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {value.map(item => (
            <button
              key={item}
              onClick={() => toggle(item)}
              className="flex items-center gap-1 bg-white text-black text-xs px-2.5 py-1 rounded-full font-medium hover:bg-zinc-200 transition-colors"
            >
              {item}
              <span className="text-zinc-500 text-xs leading-none">×</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {ROLE_SUGGESTIONS.filter(s => !value.includes(s)).map(item => (
          <button
            key={item}
            onClick={() => toggle(item)}
            className="text-xs px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
          placeholder="Rôle personnalisé..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600"
        />
        <button
          onClick={addCustom}
          disabled={!custom.trim()}
          className="text-xs px-3 py-1.5 border border-zinc-700 rounded text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-30"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

// Bouton qui ouvre le picker en mode multi-sélection
function GalleryMultiPicker({ onAdd }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-zinc-400 hover:text-white border border-zinc-700 rounded px-2 py-1 transition-colors"
      >
        + Plusieurs images
      </button>
      {open && (
        <ImagePickerModal
          multiSelect
          onSelect={() => {}}
          onSelectMultiple={onAdd}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

const input = 'w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600';
const labelCls = 'block text-xs text-zinc-500 mb-1 font-medium uppercase tracking-wide';
const section = 'border border-zinc-800 rounded-lg p-4 space-y-4';
const sectionTitle = 'text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 block';

export default function AdminProjects() {
  const [projects, setProjects] = useState(() => [...initialProjects]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const selectProject = (p) => {
    setSelectedId(p.id);
    setForm(projectToForm(p));
    setStatus('');
  };

  const newProject = () => {
    setSelectedId(null);
    setForm(emptyForm(projects));
    setStatus('');
  };

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const updateGallery = (idx, field, value) =>
    setForm(f => {
      const gallery = [...f.gallery];
      gallery[idx] = { ...gallery[idx], [field]: value };
      return { ...f, gallery };
    });

  const addGalleryItem = () =>
    setForm(f => ({ ...f, gallery: [...f.gallery, { src: '', description: '' }] }));

  const addGalleryItems = (paths) =>
    setForm(f => ({
      ...f,
      gallery: [...f.gallery, ...paths.map(src => ({ src, description: '' }))],
    }));

  const removeGalleryItem = (idx) =>
    setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }));

  const moveGalleryItem = (idx, dir) =>
    setForm(f => {
      const gallery = [...f.gallery];
      const target = idx + dir;
      if (target < 0 || target >= gallery.length) return f;
      [gallery[idx], gallery[target]] = [gallery[target], gallery[idx]];
      return { ...f, gallery };
    });

  const doSave = async (newProjects) => {
    setStatus('saving');
    setErrorMsg('');
    try {
      const res = await fetch('/api/save-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: newProjects }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects(newProjects);
        setStatus('saved');
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Erreur inconnue');
      }
    } catch (e) {
      setStatus('error');
      setErrorMsg(e.message);
    }
  };

  const save = () => {
    if (!form.title.trim()) { setStatus('error'); setErrorMsg('Le titre est requis'); return; }
    const project = formToProject(form);
    const newProjects = selectedId !== null
      ? projects.map(p => p.id === selectedId ? project : p)
      : [...projects, project];
    setSelectedId(project.id);
    doSave(newProjects);
  };

  const deleteProject = async () => {
    if (!window.confirm(`Supprimer "${form.title}" ?`)) return;
    const newProjects = projects.filter(p => p.id !== selectedId);
    await doSave(newProjects);
    setSelectedId(null);
    setForm(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>

      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-zinc-500 hover:text-white text-sm transition-colors">← Portfolio</Link>
          <h1 className="text-base font-semibold tracking-tight">Admin Projets</h1>
          <span className="text-xs text-zinc-700 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">localhost</span>
        </div>
        <button
          onClick={newProject}
          className="bg-white text-black text-xs font-semibold px-4 py-2 rounded hover:bg-zinc-200 transition-colors"
        >
          + Nouveau projet
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 53px)' }}>

        {/* Sidebar */}
        <div className="w-64 border-r border-zinc-800 overflow-y-auto flex-shrink-0">
          <div className="p-2 space-y-0.5">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => selectProject(p)}
                className={`w-full text-left px-3 py-2.5 rounded text-sm transition-colors ${
                  selectedId === p.id
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <div className="font-medium truncate text-sm leading-tight">{p.title}</div>
                <div className="text-xs text-zinc-600 mt-0.5">{p.category} · {p.year}{p.hidden ? ' · masqué' : ''}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 overflow-y-auto">
          {!form ? (
            <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
              Sélectionne un projet ou crée-en un nouveau
            </div>
          ) : (
            <div className="max-w-2xl mx-auto px-6 py-6 space-y-5">

              {/* Status */}
              {status === 'saved' && (
                <div className="bg-green-950 border border-green-800 text-green-400 px-4 py-2.5 rounded text-sm">
                  Sauvegardé · rechargez la page pour voir les changements dans le portfolio
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-2.5 rounded text-sm">
                  Erreur : {errorMsg}
                </div>
              )}

              {/* Identité */}
              <div className={section}>
                <span className={sectionTitle}>Identité</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>ID</label>
                    <input type="text" value={form.id} onChange={e => set('id', e.target.value)} className={input} />
                  </div>
                  <div>
                    <label className={labelCls}>Année</label>
                    <input type="text" value={form.year} onChange={e => set('year', e.target.value)} className={input} />
                  </div>
                  <div className="flex flex-col justify-end pb-1">
                    <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                      <input type="checkbox" checked={form.hidden} onChange={e => set('hidden', e.target.checked)} />
                      Masqué
                    </label>
                    <label className="flex items-center gap-2 text-sm text-yellow-400 cursor-pointer mt-1">
                      <input type="checkbox" checked={form.isNew} onChange={e => set('isNew', e.target.checked)} />
                      Nouveauté
                    </label>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Titre</label>
                  <input type="text" value={form.title} onChange={e => set('title', e.target.value)} className={input} placeholder="Nom du projet" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Catégorie</label>
                    <select value={form.category} onChange={e => set('category', e.target.value)} className={input}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Type</label>
                    <select value={form.type} onChange={e => set('type', e.target.value)} className={input}>
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <RolePicker value={form.role} onChange={v => set('role', v)} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Layout</label>
                    <select value={form.layout} onChange={e => set('layout', e.target.value)} className={input}>
                      <option value="">Standard</option>
                      <option value="double">Double</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className={section}>
                <span className={sectionTitle}>Contenu</span>
                <div>
                  <label className={labelCls}>Contexte</label>
                  <input type="text" value={form.context} onChange={e => set('context', e.target.value)} className={input} placeholder="ex: Projet SAE BUT2 · IUT de Bobigny" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Période</label>
                    <input type="text" value={form.period} onChange={e => set('period', e.target.value)} className={input} placeholder="Janvier · Mars 2025" />
                  </div>
                  <div>
                    <label className={labelCls}>Durée</label>
                    <input type="text" value={form.duration} onChange={e => set('duration', e.target.value)} className={input} placeholder="4 semaines" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    className={`${input} min-h-28 resize-y`}
                    placeholder="Description du projet..."
                  />
                </div>
              </div>

              {/* Médias */}
              <div className={section}>
                <span className={sectionTitle}>Médias</span>
                <div>
                  <label className={labelCls}>Thumbnail</label>
                  <ImageInput value={form.thumbnail} onChange={v => set('thumbnail', v)} />
                </div>
                {form.thumbnail && (
                  <img src={form.thumbnail} alt="" className="h-20 object-contain rounded border border-zinc-800 mt-1" />
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Hauteur max thumbnail</label>
                    <input type="text" value={form.thumbnailMaxHeight} onChange={e => set('thumbnailMaxHeight', e.target.value)} className={input} placeholder="350px" />
                  </div>
                  <div>
                    <label className={labelCls}>Largeur max thumbnail</label>
                    <input type="text" value={form.thumbnailMaxWidth} onChange={e => set('thumbnailMaxWidth', e.target.value)} className={input} placeholder="400px" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>YouTube ID</label>
                  <input type="text" value={form.youtubeId} onChange={e => set('youtubeId', e.target.value)} className={input} placeholder="dQw4w9WgXcQ" />
                </div>
                <div>
                  <label className={labelCls}>URL externe</label>
                  <input type="text" value={form.externalUrl} onChange={e => set('externalUrl', e.target.value)} className={input} placeholder="https://..." />
                </div>
                <div>
                  <label className={labelCls}>Fichier PDF</label>
                  <input type="text" value={form.pdfFile} onChange={e => set('pdfFile', e.target.value)} className={input} placeholder="/images/projects/fichier.pdf" />
                </div>
                <div>
                  <label className={labelCls}>Figma embed URL</label>
                  <input type="text" value={form.figmaEmbed} onChange={e => set('figmaEmbed', e.target.value)} className={input} placeholder="https://embed.figma.com/..." />
                </div>
              </div>

              {/* Équipe */}
              <div className={section}>
                <span className={sectionTitle}>Équipe</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Nom du partenaire</label>
                    <input type="text" value={form.teamName} onChange={e => set('teamName', e.target.value)} className={input} placeholder="Jean Dupont" />
                  </div>
                  <div>
                    <label className={labelCls}>URL profil</label>
                    <input type="text" value={form.teamUrl} onChange={e => set('teamUrl', e.target.value)} className={input} placeholder="https://..." />
                  </div>
                </div>
              </div>

              {/* Compétences & Tags */}
              <div className={section}>
                <span className={sectionTitle}>Compétences & Tags</span>
                <TagPicker
                  label="Tags"
                  value={form.tags}
                  onChange={v => set('tags', v)}
                  suggestions={ALL_TAGS}
                />
                <div className="border-t border-zinc-800 pt-4">
                  <TagPicker
                    label="Compétences"
                    value={form.competences}
                    onChange={v => set('competences', v)}
                    suggestions={ALL_COMPETENCES}
                  />
                </div>
                <div className="border-t border-zinc-800 pt-4">
                  <TagPicker
                    label="Outils"
                    value={form.outils}
                    onChange={v => set('outils', v)}
                    suggestions={ALL_OUTILS}
                  />
                </div>
              </div>

              {/* Galerie */}
              <div className={section}>
                <div className="flex items-center justify-between mb-3">
                  <span className={sectionTitle} style={{ margin: 0 }}>Galerie</span>
                  <div className="flex items-center gap-2">
                    <GalleryMultiPicker onAdd={addGalleryItems} />
                    <button
                      onClick={addGalleryItem}
                      className="text-xs text-zinc-400 hover:text-white border border-zinc-700 rounded px-2 py-1 transition-colors"
                    >
                      + Une image
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {form.gallery.length === 0 && (
                    <div className="text-xs text-zinc-700 text-center py-3">Aucune image</div>
                  )}
                  {form.gallery.map((item, idx) => (
                    <div key={idx} className="border border-zinc-700 rounded p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-600">Image {idx + 1}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveGalleryItem(idx, -1)}
                              disabled={idx === 0}
                              className="text-zinc-600 hover:text-white disabled:opacity-20 transition-colors px-1 text-xs"
                              title="Monter"
                            >↑</button>
                            <button
                              onClick={() => moveGalleryItem(idx, 1)}
                              disabled={idx === form.gallery.length - 1}
                              className="text-zinc-600 hover:text-white disabled:opacity-20 transition-colors px-1 text-xs"
                              title="Descendre"
                            >↓</button>
                          </div>
                        </div>
                        <button onClick={() => removeGalleryItem(idx)} className="text-xs text-red-600 hover:text-red-400 transition-colors">
                          Supprimer
                        </button>
                      </div>
                      <div>
                        <label className={labelCls}>Chemin</label>
                        <ImageInput value={item.src} onChange={v => updateGallery(idx, 'src', v)} placeholder="/images/projects/image.webp" />
                      </div>
                      <div>
                        <label className={labelCls}>Description (alt)</label>
                        <input type="text" value={item.description} onChange={e => updateGallery(idx, 'description', e.target.value)} className={input} placeholder="Description de l'image" />
                      </div>
                      {item.src && (
                        <img src={item.src} alt="" className="h-16 object-contain rounded border border-zinc-800" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1 pb-10">
                <div>
                  {selectedId !== null && (
                    <button onClick={deleteProject} className="text-sm text-red-600 hover:text-red-400 transition-colors">
                      Supprimer ce projet
                    </button>
                  )}
                </div>
                <button
                  onClick={save}
                  disabled={status === 'saving'}
                  className="bg-white text-black text-sm font-semibold px-6 py-2.5 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {status === 'saving' ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
