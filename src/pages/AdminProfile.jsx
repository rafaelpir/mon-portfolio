import { useState } from 'react';
import { Link } from 'react-router-dom';
import frHome from '../i18n/locales/fr/home.json';
import enHome from '../i18n/locales/en/home.json';

const input = 'w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600';
const labelCls = 'block text-xs text-zinc-500 mb-1 font-medium uppercase tracking-wide';
const section = 'border border-zinc-800 rounded-lg p-4 space-y-4';
const sectionTitle = 'text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 block';

function initialForm() {
  return {
    educationFr: frHome.hero.education,
    educationEn: enHome.hero.education,
    statusFr: frHome.availability.status,
    statusEn: enHome.availability.status,
    detailFr: frHome.availability.alternance,
    detailEn: enHome.availability.alternance,
    intro1Fr: frHome.about.intro1,
    intro1En: enHome.about.intro1,
    intro2Fr: frHome.about.intro2,
    intro2En: enHome.about.intro2,
    intro3Fr: frHome.about.intro3,
    intro3En: enHome.about.intro3,
  };
}

// Champ FR / EN côte à côte
function BilingualField({ label, fr, en, onFr, onEn, textarea }) {
  const Tag = textarea ? 'textarea' : 'input';
  const extra = textarea ? `${input} min-h-20 resize-y` : input;
  return (
    <div>
      <div className={labelCls}>{label}</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] text-zinc-600 mb-1">FR</div>
          <Tag value={fr} onChange={e => onFr(e.target.value)} className={extra} />
        </div>
        <div>
          <div className="text-[10px] text-zinc-600 mb-1">EN</div>
          <Tag value={en} onChange={e => onEn(e.target.value)} className={extra} />
        </div>
      </div>
    </div>
  );
}

export default function AdminProfile() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field) => (value) => setForm(f => ({ ...f, [field]: value }));

  const save = async () => {
    setStatus('saving');
    setErrorMsg('');
    const payload = {
      fr: {
        hero: { education: form.educationFr },
        availability: { status: form.statusFr, alternance: form.detailFr },
        about: {
          intro1: form.intro1Fr,
          intro2: form.intro2Fr,
          intro3: form.intro3Fr,
          availabilityValue: form.statusFr,
        },
      },
      en: {
        hero: { education: form.educationEn },
        availability: { status: form.statusEn, alternance: form.detailEn },
        about: {
          intro1: form.intro1En,
          intro2: form.intro2En,
          intro3: form.intro3En,
          availabilityValue: form.statusEn,
        },
      },
    };
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-zinc-500 hover:text-white text-sm transition-colors">← Portfolio</Link>
          <Link to="/admin/projects" className="text-zinc-500 hover:text-white text-sm transition-colors">Projets</Link>
          <Link to="/admin/timeline" className="text-zinc-500 hover:text-white text-sm transition-colors">Timeline</Link>
          <h1 className="text-base font-semibold tracking-tight">Admin Profil</h1>
          <span className="text-xs text-zinc-700 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">localhost</span>
        </div>
        <button
          onClick={save}
          disabled={status === 'saving'}
          className="bg-white text-black text-sm font-semibold px-6 py-2 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {status === 'saving' ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-5">
        {status === 'saved' && (
          <div className="bg-green-950 border border-green-800 text-green-400 px-4 py-2.5 rounded text-sm">
            Sauvegardé · rechargez la page d'accueil pour voir les changements
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-2.5 rounded text-sm">
            Erreur : {errorMsg}
          </div>
        )}

        <div className={section}>
          <span className={sectionTitle}>Formation</span>
          <BilingualField
            label="Ligne formation (Hero + À propos)"
            fr={form.educationFr}
            en={form.educationEn}
            onFr={set('educationFr')}
            onEn={set('educationEn')}
          />
        </div>

        <div className={section}>
          <span className={sectionTitle}>Disponibilité</span>
          <BilingualField
            label="Statut (court)"
            fr={form.statusFr}
            en={form.statusEn}
            onFr={set('statusFr')}
            onEn={set('statusEn')}
          />
          <BilingualField
            label="Détail (badge disponibilités)"
            fr={form.detailFr}
            en={form.detailEn}
            onFr={set('detailFr')}
            onEn={set('detailEn')}
          />
        </div>

        <div className={section}>
          <span className={sectionTitle}>Présentation (section À propos)</span>
          <BilingualField
            label="Paragraphe 1, qui je suis / formation"
            fr={form.intro1Fr}
            en={form.intro1En}
            onFr={set('intro1Fr')}
            onEn={set('intro1En')}
            textarea
          />
          <BilingualField
            label="Paragraphe 2, disponibilité"
            fr={form.intro2Fr}
            en={form.intro2En}
            onFr={set('intro2Fr')}
            onEn={set('intro2En')}
            textarea
          />
          <BilingualField
            label="Paragraphe 3, motivation"
            fr={form.intro3Fr}
            en={form.intro3En}
            onFr={set('intro3Fr')}
            onEn={set('intro3En')}
            textarea
          />
        </div>
      </div>
    </div>
  );
}
