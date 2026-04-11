import state from '../state.js';
import { CATEGORIES, BREATHING_SUBCATS } from '../constants.js';
import { getExercises } from '../data/exercise-loader.js';
import { showScreen } from '../router.js';
import { clearElement, el } from '../utils/dom.js';
import { createExerciseCard } from './card.js';
import { showExerciseInfo } from './modal.js';

let onStartExercise = null;

export function setStartExerciseHandler(handler) {
  onStartExercise = handler;
}

export function renderHome() {
  showScreen('home');
  renderCategoryTabs();
  renderSubcatTabs();
  renderExerciseGrid();
}

function renderCategoryTabs() {
  const container = document.getElementById('catTabs');
  if (!container) return;
  clearElement(container);

  for (const cat of CATEGORIES) {
    const btn = el('button', {
      className: 'cat-tab' + (state.cat === cat ? ' active' : ''),
      textContent: cat,
      'aria-label': `Kategorie ${cat}`,
      onClick: () => {
        state.cat = cat;
        state.subcat = null;
        renderCategoryTabs();
        renderSubcatTabs();
        renderExerciseGrid();
      },
    });
    container.appendChild(btn);
  }
}

function renderSubcatTabs() {
  const container = document.getElementById('subcatTabs');
  if (!container) return;

  let subcats = [];
  if (state.cat === 'Atemübungen') {
    subcats = BREATHING_SUBCATS;
  } else if (state.cat === 'Meditation') {
    subcats = [...new Set(
      getExercises()
        .filter(e => e.cat === 'Meditation' && e.subcat)
        .map(e => e.subcat)
    )];
  }

  if (subcats.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';
  clearElement(container);

  const allBtn = el('button', {
    className: 'cat-tab' + (!state.subcat ? ' active' : ''),
    textContent: 'Alle',
    onClick: () => { state.subcat = null; renderSubcatTabs(); renderExerciseGrid(); },
  });
  container.appendChild(allBtn);

  for (const sub of subcats) {
    const btn = el('button', {
      className: 'cat-tab' + (state.subcat === sub ? ' active' : ''),
      textContent: sub,
      onClick: () => { state.subcat = sub; renderSubcatTabs(); renderExerciseGrid(); },
    });
    container.appendChild(btn);
  }
}

function renderExerciseGrid() {
  const gridContainer = document.getElementById('exerciseList');
  if (!gridContainer) return;
  clearElement(gridContainer);

  const all = getExercises();
  let filtered;

  if (state.cat === 'Favoriten') {
    filtered = all.filter(ex => state.favs.includes(ex.id));
  } else if (state.cat === 'Atemübungen') {
    filtered = all.filter(ex => ex.cat !== 'Meditation');
    if (state.subcat) {
      filtered = filtered.filter(ex => ex.cat === state.subcat);
    }
  } else if (state.cat === 'Meditation') {
    filtered = all.filter(ex => ex.cat === 'Meditation');
    if (state.subcat) {
      filtered = filtered.filter(ex => ex.subcat === state.subcat);
    }
  } else {
    filtered = all;
  }

  for (const exercise of filtered) {
    const card = createExerciseCard(exercise, {
      onStart: (id) => onStartExercise?.(id),
      onInfo: (ex) => showExerciseInfo(ex),
      onFavToggle: () => renderExerciseGrid(),
    });
    gridContainer.appendChild(card);
  }
}
