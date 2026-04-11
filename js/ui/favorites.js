import state from '../state.js';
import { saveToStorage } from '../utils/storage.js';

export function toggleFavorite(exerciseId) {
  const idx = state.favs.indexOf(exerciseId);
  if (idx >= 0) {
    state.favs.splice(idx, 1);
  } else {
    state.favs.push(exerciseId);
  }
  saveToStorage('oxy_favs', state.favs);
}

