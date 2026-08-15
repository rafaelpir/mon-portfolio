import { useState } from 'react';
import { Link } from 'react-router-dom';
import { timelineEvents as initialEvents, timelineCategories } from '../data/timeline';

const input = 'w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600';
const labelCls = 'block text-xs text-zinc-500 mb-1 font-medium uppercase tracking-wide';

function nextId(events) {
  const nums = events.map(e => (typeof e.id === 'number' ? e.id : 0));
  return Math.max(0, ...nums) + 1;
}

export default function AdminTimeline() {
  const [events, setEvents] = useState(() => initialEvents.map(e => ({ ...e })));
  const [status, setStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (idx, field, value) =>
    setEvents(evs => evs.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));

  const addEvent = () =>
    setEvents(evs => [
      { id: nextId(evs), year: '', title: '', description: '', category: timelineCategories[0] || '', icon: '' },
      ...evs,
    ]);

  const removeEvent = (idx) => {
    if (!window.confirm(`Supprimer "${events[idx].title || 'cet évènement'}" ?`)) return;
    setEvents(evs => evs.filter((_, i) => i !== idx));
  };

  const moveEvent = (idx, dir) =>
    setEvents(evs => {
      const target = idx + dir;
      if (target < 0 || target >= evs.length) return evs;
      const copy = [...evs];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });

  const save = async () => {
    setStatus('saving');
    setErrorMsg('');
    try {
      const res = await fetch('/api/save-timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
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
      <div className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-zinc-500 hover:text-white text-sm transition-colors">← Portfolio</Link>
          <Link to="/admin/projects" className="text-zinc-500 hover:text-white text-sm transition-colors">Projets</Link>
          <Link to="/admin/profile" className="text-zinc-500 hover:text-white text-sm transition-colors">Profil</Link>
          <h1 className="text-base font-semibold tracking-tight">Admin Timeline</h1>
          <span className="text-xs text-zinc-700 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">localhost</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addEvent}
            className="bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded hover:bg-zinc-700 transition-colors"
          >
            + Nouvel évènement
          </button>
          <button
            onClick={save}
            disabled={status === 'saving'}
            className="bg-white text-black text-sm font-semibold px-6 py-2 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {status === 'saving' ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        {status === 'saved' && (
          <div className="bg-green-950 border border-green-800 text-green-400 px-4 py-2.5 rounded text-sm">
            Sauvegardé · rechargez la page d'accueil / À propos pour voir les changements
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-2.5 rounded text-sm">
            Erreur : {errorMsg}
          </div>
        )}

        <p className="text-xs text-zinc-600">
          L'ordre ci-dessous est l'ordre d'affichage dans la timeline (pas forcément chronologique).
        </p>

        <datalist id="timeline-categories">
          {timelineCategories.map(c => <option key={c} value={c} />)}
        </datalist>

        {events.map((event, idx) => (
          <div key={event.id} className="border border-zinc-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600">#{idx + 1}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveEvent(idx, -1)}
                    disabled={idx === 0}
                    className="text-zinc-600 hover:text-white disabled:opacity-20 transition-colors px-1 text-xs"
                    title="Monter"
                  >↑</button>
                  <button
                    onClick={() => moveEvent(idx, 1)}
                    disabled={idx === events.length - 1}
                    className="text-zinc-600 hover:text-white disabled:opacity-20 transition-colors px-1 text-xs"
                    title="Descendre"
                  >↓</button>
                </div>
              </div>
              <button onClick={() => removeEvent(idx)} className="text-xs text-red-600 hover:text-red-400 transition-colors">
                Supprimer
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Année / période</label>
                <input
                  type="text"
                  value={event.year}
                  onChange={e => update(idx, 'year', e.target.value)}
                  className={input}
                  placeholder="2022-2023"
                />
              </div>
              <div>
                <label className={labelCls}>Catégorie</label>
                <input
                  type="text"
                  list="timeline-categories"
                  value={event.category}
                  onChange={e => update(idx, 'category', e.target.value)}
                  className={input}
                  placeholder="Formation"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Titre</label>
              <input
                type="text"
                value={event.title}
                onChange={e => update(idx, 'title', e.target.value)}
                className={input}
                placeholder="Nom de la formation / expérience"
              />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                value={event.description}
                onChange={e => update(idx, 'description', e.target.value)}
                className={`${input} min-h-20 resize-y`}
                placeholder="Description..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
