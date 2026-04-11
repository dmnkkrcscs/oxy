import { el } from '../utils/dom.js';
import { formatTime } from '../utils/format.js';
import { toggleFavorite } from './favorites.js';
import state from '../state.js';

export function createExerciseCard(exercise, { onStart, onInfo, onFavToggle }) {
  const fav = state.favs.includes(exercise.id);

  const iconDiv = el('div', {
    className: 'exercise-card-icon',
    style: { background: exercise.iconBg || 'linear-gradient(135deg, var(--accent), var(--accent2))' },
    textContent: exercise.icon || '\u{1F62E}\u200D\u{1F4A8}',
  });

  const nameDiv = el('div', { className: 'exercise-card-name', textContent: exercise.name });
  const descDiv = el('div', { className: 'exercise-card-desc', textContent: exercise.desc });

  const infoBtn = el('button', {
    className: 'exercise-btn',
    title: 'Info',
    textContent: '\u2139\uFE0F',
    'aria-label': `Info zu ${exercise.name}`,
    onClick: (e) => { e.stopPropagation(); onInfo(exercise); },
  });

  const durationTag = el('span', { className: 'exercise-tag', textContent: formatTime(exercise.duration) });
  const catTag = el('span', {
    className: 'exercise-tag',
    textContent: exercise.cat === 'Meditation' ? (exercise.subcat || 'Meditation') : exercise.cat,
  });

  const favBtn = el('button', {
    className: 'exercise-btn fav-btn',
    title: 'Favorit',
    textContent: fav ? '\u2B50' : '\u2606',
    'aria-label': fav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen',
    onClick: (e) => {
      e.stopPropagation();
      toggleFavorite(exercise.id);
      onFavToggle();
    },
  });

  const actionsCenter = el('div', { className: 'exercise-card-actions-center' }, [durationTag, catTag]);
  const actions = el('div', { className: 'exercise-card-actions' }, [infoBtn, actionsCenter, favBtn]);

  const card = el('div', { className: 'exercise-card' }, [iconDiv, nameDiv, descDiv, actions]);

  card.addEventListener('click', (e) => {
    if (!e.target.closest('.exercise-btn')) {
      onStart(exercise.id);
    }
  });

  return card;
}
